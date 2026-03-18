const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function generateOrderCode() {
  return "ORD-" + Math.floor(Math.random() * 1000000);
}

/*
================================
CREATE ORDER
================================
*/
exports.createOrder = async (data) => {
  const items = data.items || [];

  if (!items.length) {
    throw new Error("Order must have items");
  }

  let total = 0;

  const itemsData = await Promise.all(
    items.map(async (i) => {
      const qty = Number(i.qty || 1);

      if (!qty || qty < 1) {
        throw new Error("Quantity must be at least 1");
      }

      const variant = await prisma.productVariant.findUnique({
        where: { id: Number(i.variantId) },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!variant) {
        throw new Error("Variant not found");
      }

      if (!variant.status) {
        throw new Error(`Variant "${variant.name}" is inactive`);
      }

      if (variant.isOutOfStock) {
        throw new Error(`Variant "${variant.name}" is out of stock`);
      }

      if (!variant.product) {
        throw new Error("Product not found");
      }

      if (!variant.product.status) {
        throw new Error(`Product "${variant.product.name}" is inactive`);
      }

      const price = Number(variant.salePrice || variant.price || 0);

      total += price * qty;

      return {
        variantId: variant.id,
        price,
        qty,
        productName: variant.product.name,
        variantName: variant.name,
        image: variant.product.image || "",
        slug: variant.product.slug || "",
        categoryName: variant.product.category?.name || "",
      };
    }),
  );

  const order = await prisma.order.create({
    data: {
      code: generateOrderCode(),
      email: data.email,
      phone: data.phone,
      contactMethod: data.contactMethod,
      total,

      items: {
        create: itemsData,
      },
    },

    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  await prisma.orderLog.create({
    data: {
      orderId: order.id,
      message: "Order created",
    },
  });

  return formatOrder(order);
};

/*
================================
GET ALL ORDERS
================================
*/
exports.getOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });

  return orders.map(formatOrder);
};

/*
================================
GET ORDER BY ID
================================
*/
exports.getOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },

    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
      logs: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return formatOrder(order);
};

/*
================================
UPDATE STATUS
================================
*/
exports.updateOrderStatus = async (id, status) => {
  const order = await prisma.order.update({
    where: { id: Number(id) },
    data: { status },
  });

  await prisma.orderLog.create({
    data: {
      orderId: order.id,
      message: `Status changed to ${status}`,
    },
  });

  return order;
};

/*
================================
UPDATE ORDER
================================
*/
exports.updateOrder = async (id, data) => {
  const order = await prisma.order.update({
    where: { id: Number(id) },
    data,
  });

  await prisma.orderLog.create({
    data: {
      orderId: order.id,
      message: "Order updated",
    },
  });

  return order;
};

/*
================================
FORMAT ORDER RESPONSE
================================
*/
function formatOrder(order) {
  const items = order.items.map((i) => ({
    id: i.id,
    name: i.productName || i.variant?.product?.name || "Unknown product",
    variantName: i.variantName || i.variant?.name || "",
    price: Number(i.price),
    qty: Number(i.qty),
    image: i.image || i.variant?.product?.image || "",
    slug: i.slug || i.variant?.product?.slug || "",
    categoryName: i.categoryName || i.variant?.product?.category?.name || "",
    isOutOfStock: i.variant?.isOutOfStock ?? false,
    status: i.variant?.status ?? false,
  }));

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return {
    ...order,
    createdAt: order.createdAt,
    total,
    items,
  };
}

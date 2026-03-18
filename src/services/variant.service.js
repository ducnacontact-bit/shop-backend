const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// CREATE
exports.createVariant = (data) => {
  return prisma.productVariant.create({
    data: {
      name: data.name,
      price: Number(data.price),
      salePrice:
        data.salePrice === undefined ||
        data.salePrice === null ||
        data.salePrice === ""
          ? null
          : Number(data.salePrice),
      status:
        data.status === undefined
          ? true
          : data.status === true || data.status === "true",
      isFeatured: data.isFeatured === true || data.isFeatured === "true",
      isBestSeller: data.isBestSeller === true || data.isBestSeller === "true",
      isOutOfStock: data.isOutOfStock === true || data.isOutOfStock === "true",
      productId: Number(data.productId),
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

// GET ALL
exports.getVariants = () => {
  return prisma.productVariant.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

// GET BY PRODUCT ID (cho admin)
exports.getVariantsByProduct = (productId) => {
  return prisma.productVariant.findMany({
    where: {
      productId: Number(productId),
    },
    orderBy: {
      id: "asc",
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

// GET BY PRODUCT SLUG (cho user ngoài site)
exports.getVariantsBySlug = (slug) => {
  return prisma.productVariant.findMany({
    where: {
      product: {
        slug,
        status: true,
      },
      status: true,
    },
    orderBy: {
      id: "asc",
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

// GET ONE BY ID
exports.getVariantById = (id) => {
  return prisma.productVariant.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

// UPDATE
exports.updateVariant = (id, data) => {
  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = Number(data.price);

  if (data.salePrice !== undefined) {
    updateData.salePrice =
      data.salePrice === null || data.salePrice === ""
        ? null
        : Number(data.salePrice);
  }

  if (data.status !== undefined) {
    updateData.status = data.status === true || data.status === "true";
  }

  if (data.isFeatured !== undefined) {
    updateData.isFeatured =
      data.isFeatured === true || data.isFeatured === "true";
  }

  if (data.isBestSeller !== undefined) {
    updateData.isBestSeller =
      data.isBestSeller === true || data.isBestSeller === "true";
  }

  if (data.isOutOfStock !== undefined) {
    updateData.isOutOfStock =
      data.isOutOfStock === true || data.isOutOfStock === "true";
  }

  if (data.productId !== undefined) {
    updateData.productId = Number(data.productId);
  }

  return prisma.productVariant.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

// DELETE
exports.deleteVariant = (id) => {
  return prisma.productVariant.delete({
    where: { id: Number(id) },
  });
};

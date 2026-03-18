const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// CREATE
exports.createProduct = async (data) => {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      image: data.image || null,
      description: data.description || null,
      status:
        data.status === undefined
          ? true
          : data.status === true || data.status === "true",
      categoryId: data.categoryId ? Number(data.categoryId) : null,
    },
    include: {
      category: true,
    },
  });
};

// GET ALL (pagination + search)
exports.getProducts = async ({ page = 1, limit = 10, search = "" }) => {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limitNumber,
    orderBy: { id: "desc" },
    include: {
      category: true,
      variants: true,
    },
  });

  const total = await prisma.product.count({ where });

  return {
    data: products,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
  };
};

// GET ONE BY SLUG
exports.getProductBySlug = async (slug) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        where: {
          status: true,
        },
        orderBy: { id: "asc" },
      },
    },
  });
};

// GET ONE BY ID
// exports.getProductById = async (id) => {
//   return prisma.product.findUnique({
//     where: {
//       id: Number(id),
//     },
//     include: {
//       category: true,
//       variants: true,
//     },
//   });
// };
exports.getProductById = async (id) => {
  const productId = Number(id);

  if (!productId || Number.isNaN(productId)) {
    throw new Error("Invalid product id");
  }

  return prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: true,
      variants: true,
    },
  });
};
// UPDATE
exports.updateProduct = async (id, data) => {
  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.image !== undefined) updateData.image = data.image || null;
  if (data.description !== undefined) {
    updateData.description = data.description || null;
  }
  if (data.status !== undefined) {
    updateData.status = data.status === true || data.status === "true";
  }
  if (data.categoryId !== undefined) {
    updateData.categoryId = data.categoryId ? Number(data.categoryId) : null;
  }

  return prisma.product.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      category: true,
      variants: true,
    },
  });
};

// DELETE
exports.deleteProduct = async (id) => {
  const productId = Number(id);

  return prisma.$transaction(async (tx) => {
    await tx.productVariant.deleteMany({
      where: { productId },
    });

    await tx.product.delete({
      where: { id: productId },
    });
  });
};

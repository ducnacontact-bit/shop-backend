const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// CREATE
exports.createCategory = async (data) => {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      status:
        data.status === undefined
          ? true
          : data.status === true || data.status === "true",
    },
  });
};

// GET ALL
exports.getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      products: true,
    },
  });
};

// GET ONE BY ID
exports.getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      products: true,
    },
  });
};

// GET ONE BY SLUG
exports.getCategoryBySlug = async (slug) => {
  return prisma.category.findUnique({
    where: {
      slug,
    },
    include: {
      products: {
        where: {
          status: true,
        },
        include: {
          variants: {
            where: {
              status: true,
            },
            orderBy: {
              id: "asc",
            },
          },
        },
      },
    },
  });
};

// UPDATE
exports.updateCategory = async (id, data) => {
  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.status !== undefined) {
    updateData.status = data.status === true || data.status === "true";
  }

  return prisma.category.update({
    where: {
      id: Number(id),
    },
    data: updateData,
  });
};

// DELETE
exports.deleteCategory = async (id) => {
  const categoryId = Number(id);

  const productCount = await prisma.product.count({
    where: {
      categoryId,
    },
  });

  if (productCount > 0) {
    throw new Error("Cannot delete category because it still has products");
  }

  return prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

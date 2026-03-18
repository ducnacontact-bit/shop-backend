const prisma = require("../db/db");

exports.handleWebhook = async (data) => {
  try {
    const { content, transferAmount } = data;

    if (!content) {
      return { message: "No content" };
    }

    console.log("Webhook content:", content);

    const amount = Number(transferAmount || 0);

    // tìm mã ORD
    const match = content.match(/ORD[-]?\d+/i);

    if (!match) {
      return { message: "Order code not found" };
    }

    let orderCode = match[0].toUpperCase();

    // chuẩn hóa ORD123 → ORD-123
    if (!orderCode.includes("-")) {
      orderCode = orderCode.replace("ORD", "ORD-");
    }

    console.log("Extracted order code:", orderCode);

    const order = await prisma.order.findFirst({
      where: {
        code: orderCode,
      },
    });

    if (!order) {
      console.log("Order not found:", orderCode);
      return { message: "Order not found" };
    }

    if (order.status === "paid") {
      return { message: "Already paid" };
    }

    if (amount < order.total) {
      console.log("Amount not enough:", amount);
      return { message: "Amount not enough" };
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    });

    console.log("Order paid:", order.code);

    return {
      success: true,
      orderCode: order.code,
    };
  } catch (err) {
    console.error("Webhook error:", err);

    throw err;
  }
};

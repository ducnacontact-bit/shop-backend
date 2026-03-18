const prisma = require("../db/db");

exports.createPayment = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    throw new Error("Order already processed");
  }

  // ⭐ kiểm tra payment pending chưa hết hạn
  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId: order.id,
      status: "pending",
      expiredAt: {
        gt: new Date(),
      },
    },
  });

  // nếu đã có QR chưa hết hạn → dùng lại
  if (existingPayment) {
    return existingPayment;
  }

  const bank = "MB";
  const account = process.env.BANK_ACCOUNT;

  const total = (order.items || []).reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const qr = `https://img.vietqr.io/image/${bank}-${account}-compact.png?amount=${total}&addInfo=${order.code}`;

  // ⭐ QR hết hạn sau 10 phút
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: total,
      qrCode: qr,
      status: "pending",
      expiredAt,
    },
  });

  return payment;
};

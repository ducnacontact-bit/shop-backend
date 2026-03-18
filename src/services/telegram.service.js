const TelegramBot = require("node-telegram-bot-api")
const prisma = require("../db/db")

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token, { polling: true })

console.log("Telegram bot started...")

bot.on("message", async (msg) => {

  const chatId = msg.chat.id
  const text = msg.text

  console.log("Telegram message:", text)

  if (!text) return

  // tìm order code dạng ORD-xxxxx
  const match = text.match(/ORD-\d+/)

  if (!match) return

  const orderCode = match[0]

  const order = await prisma.order.findFirst({
    where: { code: orderCode }
  })

  if (!order) {
    bot.sendMessage(chatId, "Order not found")
    return
  }

  if (order.status === "paid") {
    bot.sendMessage(chatId, "Order already paid")
    return
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "paid" }
  })

  bot.sendMessage(chatId, `Payment confirmed for ${orderCode}`)

})

module.exports = bot
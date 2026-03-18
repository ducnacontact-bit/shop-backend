const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const prisma = new PrismaClient()

// =======================
// REGISTER
// =======================
exports.register = async (data) => {

  const { username, password, confirmPassword,  role } = data

  if (!username || !password) {
    throw new Error("Username and password are required")
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match")
  }

  const exist = await prisma.user.findUnique({
    where: { username }
  })

  if (exist) {
    throw new Error("Username already exists")
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      password: hash,
      role
    }
  })

  return {
    id: user.id,
    username: user.username,
    role: user.role
  }
}


// =======================
// LOGIN
// =======================
exports.login = async (data) => {

  const { username, password } = data

  if (!username || !password) {
    throw new Error("Username and password are required")
  }

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user) {
    throw new Error("User not found")
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw new Error("Wrong password")
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  )

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
    token
  }
}
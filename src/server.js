require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./services/telegram.service");

const sepayRoutes = require("./routes/sepay.routes");
const productRoutes = require("./routes/product.routes");
const variantRoutes = require("./routes/variant.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const paymentRoutes = require("./routes/payment.routes");
const categoryRoutes = require("./routes/category.routes");
const rateLimit = require("./middleware/rateLimit.middleware");
const passport = require("passport");
const adminRoutes = require("./routes/admin.routes");

require("./config/passport");

const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(rateLimit);
app.use(passport.initialize());

app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", variantRoutes);
app.use("/api", orderRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", sepayRoutes);

app.get("/", (req, res) => {
  res.send("Backend API running 🚀");
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

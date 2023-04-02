const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mrtholoiabc@gmail.com",
    pass: "sufbvbxegkfxqqry",
  },
});
const mailOptions = {
  from: "mrtholoiabc@gmail",
  to: "thonqfx17090@funix.edu.vn",
  subject: "nodemailer text",
  html: "test<button>sending</button> semding gmail using nodeJs",
};

exports.getCart = async (req, res, next) => {
  try {
    console.log(req.session.isLoggedIn);
    const user = await User.findById(req.params.id);
    res.status(200).json(user.cart.items);
  } catch (err) {
    next(err);
  }
};
exports.postCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const count = req.body.count;

    const product = await Product.findById(req.body.productId);

    user.addToCart(product, count);
    return res.status(200).json("Add To Cart Thanh Cong");
  } catch (err) {
    next(err);
  }
};
exports.updateCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const count = req.body.count;

    const product = await Product.findById(req.body.productId);
    console.log(product);
    user.updateCart(product, count);

    return res.status(200).json("Update Cart Thanh Cong");
  } catch (err) {
    next(err);
  }
};
exports.deleteCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    console.log(req.body);
    const product = await Product.findById(req.body.productId);
    console.log(product);
    user.deleteCartItem(product);
    return res.status(200).json("Delete Cart Thanh Cong");
  } catch (err) {
    next(err);
  }
};
exports.postOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    const newOrder = await new Order(req.body);
    // console.log(newOrder.email);
    // console.log(newOrder.products);
    const product = newOrder.products.map((p) => p);
    console.log(newOrder.total);
    const table = product.map((pro) => {
      return `<tr>
      <td>${pro.product.name}</td>
      <td  ><img src=${pro.product.img1} width ="10%"alt=${
        pro.product.name
      }></td>
      <td>${pro.product.price}VND</td>
      <td>${pro.quantity} san pham</td>
      <td>${Number(pro.quantity) * Number(pro.product.price)} VND</tr>`;
    });
    newOrder.save();
    const mailOptions = {
      from: "mrtholoiabc@gmail",
      to: newOrder.email,
      subject: `Xin Chao ${newOrder.name}`,
      html: `<p>phone:${newOrder.phone}</p><span>
      <p>Address:${newOrder.address}</p>
      </span>
      <table>
  <tr>
    <th>Tên sản phẩm</th>
    <th>Hình ảnh</th>
    <th>Giá</th>
    <th>Số lượng</th>
    <th>Thành tiền</th>
  </tr>
  ${table}
  </table>
<h1>Tổng Thanh Toán ${newOrder.total} VND</h1>
<h1>Cám Ơn Bạn</h1>
      `,
    };
    user.clearCart();
    transport.sendMail(mailOptions);
    return res.status(200).json("Order Thành Công");
  } catch (err) {
    next(err);
  }
};
exports.getOrders = async (req, res, next) => {
  try {
    const order = await Order.find();
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};
exports.getOrder = async (req, res, next) => {
  try {
    const userId = req.params.id;
    //console.log(userId);

    const orders = await Order.find({ userId: userId });

    console.log(orders);
    // const order = orders.filter((order) => {
    //   order.userId.toString() === userId;
    // });

    // console.log(order);
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
exports.getOrderDetail = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const detailId = req.params.detailid;
    const orders = await Order.find({ userId: userId });

    //const order = orders.filter((order) => order.userId.toString() === userId);
    const detail = orders.filter((order) => order._id.toString() === detailId);
    return res.status(200).json(detail);
  } catch (err) {
    next(err);
  }
};

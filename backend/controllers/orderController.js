const Order = require("../models/Order");
const sendEmail = require("../config/email");
const sendSMS = require("../config/sms");

const emailCustomer = require("../templates/emailTemplateCustomer");
const smsCustomer = require("../templates/smsTemplateCustomer");
const smsAdmin = require("../templates/smsTemplateAdmin");

exports.createOrder = async (req, res) => {
  const order = await Order.create(req.body);

  await sendEmail(order.email, "Order Confirmed", emailCustomer(order));
  await sendSMS(order.phone, smsCustomer(order));
  await sendSMS(process.env.ADMIN_PHONE, smsAdmin(order));

  res.json({ message: "Order placed successfully" });
};

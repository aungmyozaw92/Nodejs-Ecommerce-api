const Order = require('../../models/Order');
const Product = require('../../models/Product');
const CustomError = require('../../errors');
const { StatusCodes } = require('http-status-codes');
const { checkPermission } = require('../../utils');
const stripe = require('stripe')(process.env.STRIPE_PAYMENT_KEY);


const index = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ status: true, data: orders, count: orders.length });
};

const show = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermission(req.user, order.user);
    res.status(StatusCodes.OK).json({ status: true, data: order });
};

const create = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if ( !cartItems || cartItems.length < 1 ) {
        throw new CustomError.BadRequestError('No cart items!')
    }

    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please add tax and shipping fee');
    }

    let orderItems = [];
    let subTotal = 0;

    for(const item of cartItems) {
        const product = await Product.findOne({ _id: item.product });
        if (!product) {
            throw new CustomError.NotFoundError(`No product found with id: ${item.product}`);
        }
        const { name, price, image, _id } = product;
        const orderItem = {
            name,
            price,
            image,
            amount: item.amount,
            product: _id
        };
        //add item to orderItems
        orderItems = [ ...orderItems, orderItem ];
        // calculate sub total
        subTotal += item.amount * price;
    }
    // calculate total
    const total = tax + shippingFee + subTotal;
    // get client secret
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
    });

    const order = await Order.create({
        orderItems,
        total,
        subtotal : subTotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });

    res
        .status(StatusCodes.CREATED)
        .json({ status:true, data: order, clientSecret: order.clientSecret });
};

const update = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermission(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ status: true, data: order });
};

const getUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ status: true, data: orders, count: orders.length });
};

module.exports = {
    index,
    show,
    create,
    update,
    getUserOrders,
}
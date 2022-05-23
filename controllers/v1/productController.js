const Product = require('../../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');
const path = require('path');

const index = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ status:true, data: products, count: products.length });
};

const show = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId});
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ status: true, data: product });
};

const create = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ status: true, data: product });
};

const update = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate(
        { _id: productId },
        req.body,
        { new: true,
          runValidators: true
        }
    );
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
    res.status(StatusCodes.OK).json({ status:true, data: product });
};

const destroy = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
    await product.remove();
    res.status(StatusCodes.OK).json({ status:true, message: 'Success! Product removed.' });
};

const upload = async (req, res) => {
    if (!req.files) {
       throw new CustomError.BadRequestError('No file uploaded');
    }
    const image = req.files.image;
    if(!image.mimetype.startsWith('image')){
         throw new CustomError.BadRequestError('Please upload image');
    }
    const maxSize = 1024 * 1024;
    if(!image.size > maxSize){
         throw new CustomError.BadRequestError('Please upload image smaller than 1MB');
    }
    const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${image.name}`
  );
  await image.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${image.name}` });
};

module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    upload,
}
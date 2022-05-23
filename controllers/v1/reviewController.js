const Review = require('../../models/Review');
const Product = require('../../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');
const { checkPermission } = require('../../utils');

const index = async (req, res) => {
    const reviews = await Review.find({})
                                .populate({
                                    path: 'product',
                                    select: 'name price company'
                                })
                                .populate({
                                    path: 'user',
                                    select: 'name'
                                });
    res.status(StatusCodes.OK).json({ status: true, data: reviews, count:reviews.length });
};

const create = async (req, res) => {
    const { product: productId } = req.body;

    const product = await Product.findOne({ _id: productId });
    if(!product){
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }
    //check already review
    const reviewExits = await Review.findOne({ 
        product: productId,
        user: req.user.userId,
    });
    
    if (reviewExits) {
        throw new CustomError.BadRequestError('Already exit review for this product');
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ status: true, data: review });
};

const show = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId })
                                 .populate({
                                    path: 'product',
                                    select: 'name price company'
                                })
                                .populate({
                                    path: 'user',
                                    select: 'name'
                                });
    if (!review) {
        throw new CustomError.NotFoundError(`No review found with id: ${ reviewId }`);
    }
    res.status(StatusCodes.OK).json({ status: true, data: review });
};

const update = async (req, res) => {
    const { id: reviewId } = req.params;
    const { title, rating, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`No review found with id: ${ reviewId }`);
    }
    checkPermission(req.user, review.user);

    review.title = title;
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(StatusCodes.OK).json({ status: true, data: review });
};

const destroy = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`No review found with id: ${ reviewId }`);
    }
    checkPermission(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({ status: true, message: 'Successful remove review' });
};

const getProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ status: true, data: reviews, count: reviews.length });
};

module.exports = {
    index,
    create,
    show,
    update,
    destroy,
    getProductReviews
}
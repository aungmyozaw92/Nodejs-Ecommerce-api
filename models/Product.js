const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Product name required'],
        maxlength: [100, 'Name cannot be more than 100 charaters']
    },
    price: {
        type: Number,
        required: [true, 'Product price required'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Product price required'],
        maxlength: [1000, 'Name cannot be more than 1000 charaters']
    },
    image: {
        type: String,
        default: '/uploads/test.jpeg'
    },

    category: {
      type: String,
      required: [true, 'Product category required'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Company name required'],
      enum: {
        values: ['company1', 'company2', 'company3'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } 
});

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

productSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
})

module.exports = mongoose.model('Product', productSchema);
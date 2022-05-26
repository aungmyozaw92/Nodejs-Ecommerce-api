const express = require('express');
const app = express();

require('dotenv').config();
require('express-async-errors');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

//Connect db
const DBConnection = require('./db/connect');

//Routes
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const productRoute = require('./routes/productRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const orderRoute = require('./routes/orderRoutes');

//middleware 
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

// app.get('/api/v1', (req, res) => {
//     console.log(req.signedCookies);
//     res.send('api/v1 route');
// });
// app.get('/', (req, res) => {
//     console.log(req.cookies);
//     res.send('Hello');
// });

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/orders', orderRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try{
        await DBConnection(process.env.DB_URL)
        app.listen(port, console.log(`Server is listening on port ${port}`));
    }catch(error){
        console.log(error);
    }
}

start();
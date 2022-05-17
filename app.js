const express = require('express');
const app = express();

require('dotenv').config();
require('express-async-errors');

const morgan = require('morgan');

//Connect db
const DBConnection = require('./db/connect');

//Routes
const authRoute = require('./routes/authRoutes');

//middleware 
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use('/api/v1/auth', authRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try{
        await DBConnection(process.env.DB_URL)
        app.listen(port, console.log(`Server is listening on port ${port}`));
    }catch(error){
        console.log(error);
    }
}

start();
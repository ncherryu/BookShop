const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('./models/index');

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT}번 포트에서 대기 중`);
});

const connectDB = async () => {
    await sequelize.sync({ force: false })
        .then(() => {
            console.log('DB 연결 성공');
        })
        .catch((err) => {
            console.error(err);
        })
}
connectDB();


const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/category', categoryRouter);
app.use('/likes', likeRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);


app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = StatusCodes.NOT_FOUND;

    next(error);
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errMsg = err.message || '서버 내부 오류 발생';
    console.error(`에러 발생: ${err.name}`);
    console.error(`에러 메시지: ${err.message}`);
    console.error(`에러 스택: ${err.stack}`);
    return res.status(statusCode).json({ message: errMsg });
})
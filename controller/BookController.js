const { ensureAuthorization, getLoginedId } = require('../jwtAuthorization');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { getAllBooks, getBookDetail } = require('../service/BookService');

const allBooks = async (req, res, next) => {
    try {
        const { category_id, news, limit, current_page, sort } = req.query;
        const allBooks = await getAllBooks({
            category_id,
            news,
            limit,
            current_page,
            sort
        });

        res.status(StatusCodes.OK).json(allBooks);
    } catch (err) {
        next(err);
    }
};

const bookDetail = async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id);
        const userId = getLoginedId(req);
        const bookInfo = await getBookDetail(userId, bookId);

        res.status(StatusCodes.OK).json(bookInfo);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    allBooks,
    bookDetail
};
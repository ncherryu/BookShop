const express = require('express');
const router = express.Router();
const {
    allBooks,
    bookDetail
} = require('../controller/BookController');
const {
    limitValidate,
    currentPageValidate,
    bookIdValidate
} = require('../validator/BookValidator');
const { validate } = require('../validator/validate');

router.use(express.json());

router.get(
    '/',
    [limitValidate, currentPageValidate, validate],
    allBooks
);
router.get(
    '/:id',
    [bookIdValidate, validate],
    bookDetail
); // 개별 도서 조회

module.exports = router;
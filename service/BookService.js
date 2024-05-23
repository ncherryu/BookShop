const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../models');
const { Op } = require('sequelize');
const { CustomError } = require('../utils/CustomError');
const Book = require('../models/books');
const Category = require('../models/category');


const getAllBooks = async ({
    category_id,
    news,
    limit,
    current_page,
    sort
}) => {
    try {
        const offset = limit * (current_page - 1);

        let whereCondition = {};
        let orderCondition = [];

        if (category_id)
            whereCondition = { ...whereCondition, category_id: category_id };

        if (news)
            whereCondition = {
                ...whereCondition,
                pub_date: {
                    [Op.between]: [
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), Date.now()
                    ]
                }
            }

        const orderList = ['likes', 'orders', 'pub_date'];
        if (orderList.find(e => e === sort)) {
            orderCondition = [...orderCondition, [sort, 'DESC']];
        }


        let allBooks = await Book.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE `liked_book_id` = `Book`.`id`)'),
                        'likes'
                    ],
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM `orderedBook` WHERE `orderedBook`.`book_id` = `Book`.`id`)'),
                        'orders'
                    ]
                ]
            },
            where: whereCondition,
            order: orderCondition,
            limit: +limit,
            offset: offset
        });

        if (!allBooks.length) {
            throw new CustomError(
                '조회할 책이 없습니다.',
                StatusCodes.NOT_FOUND
            )
        }

        allBooks = {
            books: [...allBooks],
            pagination: {
                currentPage: +current_page,
                totalCount: allBooks.length
            }
        };

        return allBooks;



        // const allBooksRes = {};
        // const offset = limit * (current_page - 1);
        // let allBooksSql = `SELECT SQL_CALC_FOUND_ROWS all_books.*
        //                         FROM (SELECT *,
        //                             (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes,
        //                             (SELECT COUNT(*) FROM orderedBook WHERE orderedBook.book_id = books.id) AS orders 
        //                             FROM books) all_books `;
        // let values = [];

        // if (category_id && news) {
        //     allBooksSql += `WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() `;
        //     values = [parseInt(category_id)];
        // } else if (category_id) {
        //     allBooksSql += `WHERE category_id = ? `;
        //     values = [parseInt(category_id)];
        // } else if (news) {
        //     allBooksSql = `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() `
        // }

        // const orderList = ['likes', 'orders', 'pub_date'];
        // if (orderList.find(e => e === sort)) {
        //     allBooksSql += `ORDER BY all_books.${sort} DESC `;
        // }

        // allBooksSql += `LIMIT ? OFFSET ?`;
        // values.push(parseInt(limit), offset);

        // const allBooks = await sequelize.query(allBooksSql, {
        //     replacements: values,
        //     type: QueryTypes.SELECT
        // })

        // if (!allBooks.length) {
        //     throw new CustomError(
        //         '조회할 책이 없습니다.',
        //         StatusCodes.NOT_FOUND
        //     )
        // }

        // allBooksRes['books'] = allBooks;

        // const totalCountSql = `SELECT found_rows()`;
        // const totalCount = await sequelize.query(totalCountSql, {
        //     type: QueryTypes.SELECT
        // });

        // const pagination = {};
        // pagination['currentPage'] = parseInt(current_page);
        // pagination['totalCount'] = totalCount[0]['found_rows()'];

        // allBooksRes['pagination'] = pagination;

        // return allBooksRes;

    } catch (err) {
        throw new CustomError(
            err.message || '책 목록을 조회할 수 없습니다.',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const getBookDetail = async (userId, bookId) => {
    try {
        let attributesList = [
            [
                sequelize.literal('(SELECT COUNT(*) FROM likes WHERE liked_book_id = Book.id)'),
                'likes'
            ]
        ]

        if (userId) {
            const escapedUserId = sequelize.escape(`${userId}`);
            const escapedBookId = sequelize.escape(`${bookId}`);

            attributesList = [
                ...attributesList,
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM likes 
                        WHERE user_id = ${escapedUserId} AND liked_book_id = ${escapedBookId})`
                    ),
                    'liked'
                ]
            ]
        }

        const foundBook = await Book.findOne({
            attributes: {
                include: attributesList
            },
            include: [
                {
                    model: Category,
                    as: ['category_name'],
                    attributes: ['category_name']
                }
            ],
            where: {
                id: bookId
            }
        });

        if (!foundBook) {
            throw new CustomError(
                '존재하지 않는 책입니다.',
                StatusCodes.NOT_FOUND
            );
        }

        return foundBook;

        // let values = [];

        // let bookDetailSql = `SELECT *,
        //                         (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id)  AS likes `;
        // if (userId) {
        //     bookDetailSql += `, (SELECT COUNT(*) FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked `;
        //     values = [userId, bookId];
        // }

        // bookDetailSql += `FROM books
        //                     LEFT JOIN category
        //                     ON books.category_id = category.category_id
        //                     WHERE books.id = ?`;
        // values.push(bookId);

        // const bookInfo = await sequelize.query(bookDetailSql, {
        //     replacements: values,
        //     type: QueryTypes.SELECT
        // });

        // if (!bookInfo.length) {
        //     throw new CustomError(
        //         '존재하지 않는 책입니다.',
        //         StatusCodes.NOT_FOUND
        //     );
        // }

        // return bookInfo[0];
    } catch (err) {
        throw new CustomError(
            err.message || '책 상세 조회 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

module.exports = { getAllBooks, getBookDetail };
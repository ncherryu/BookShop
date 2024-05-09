const { ensureAuthorization } = require('../jwtAuthorization');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const allBooks = (req, res) => {
    let allBooksRes = {};
    let { category_id, news, limit, current_page, sort } = req.query;
    let offset = limit * (current_page - 1);

    let sql = `SELECT SQL_CALC_FOUND_ROWS all_books.*
                    FROM (SELECT *,
                            (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                            (SELECT COUNT(*) FROM orderedBook WHERE orderedBook.book_id = books.id) AS orders 
                            FROM books) all_books `;
    let values = [];

    if (category_id && news) {
        sql += `WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() `;
        values = [parseInt(category_id)];
    } else if (category_id) {
        sql += `WHERE category_id = ? `;
        values = [parseInt(category_id)];
    } else if (news) {
        sql = `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() `
    }

    if (sort) { // likes, orders, pub_date
        sql += `ORDER BY all_books.${sort} DESC `;
    }

    sql += `LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), offset);
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.length) {
                results.forEach(result => {
                    result.pubDate = result.pub_date;
                    delete result.pub_date;
                })
                allBooksRes['books'] = results;
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        });

    sql = `SELECT found_rows()`;
    conn.query(sql,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            let pagination = {};
            pagination['currentPage'] = parseInt(current_page);
            pagination['totalCount'] = results[0]['found_rows()'];

            allBooksRes['pagination'] = pagination;

            return res.status(StatusCodes.OK).json(allBooksRes);
        });
};

const bookDetail = (req, res) => {
    let bookId = parseInt(req.params.id);
    let sql = `SELECT *,
                (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id)  AS likes `;
    let values = [];

    const authorization = ensureAuthorization(req);
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.'
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: '잘못된 토큰입니다.'
        });
    } else if (authorization instanceof ReferenceError) {
        values = [bookId];
    } else {
        sql += `, (SELECT COUNT(*) FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked `;
        values = [authorization.id, bookId, bookId];
    }

    sql += `FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id = ?`;

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.length) {
                return res.status(StatusCodes.OK).json(results[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        })
};

module.exports = {
    allBooks,
    bookDetail
};
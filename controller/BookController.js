const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    let { category_id, news, limit, current_page } = req.query;
    let offset = limit * (current_page - 1);

    // let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id `;
    let sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books `;
    let values = [];

    if (category_id && news) {
        sql += `WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = [parseInt(category_id)];
    } else if (category_id) {
        sql += `WHERE category_id = ?`;
        values = [parseInt(category_id)];
    } else if (news) {
        sql = `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`
    }

    sql += ` LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), offset);
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.length) {
                results.map((result) => {
                    result.pubDate = result.pub_date;
                    delete result.pub_date;
                })
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        });
};

const bookDetail = (req, res) => {
    let bookId = parseInt(req.params.id);
    const userId = parseInt(req.body.user_id);

    const sql = `SELECT *,
	                (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id)  AS likes,
	                (SELECT COUNT(*) FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked
                FROM books
                LEFT JOIN category
	            ON books.category_id = category.category_id
	            WHERE books.id = ?`;
    const values = [userId, bookId, bookId];
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
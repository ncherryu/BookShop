const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allCategory = (req, res) => {
    const { limit, current_page } = req.query;
    const offset = limit * (current_page - 1);

    const sql = `SELECT * FROM category LIMIT ? OFFSET ?`;
    conn.query(sql, [parseInt(limit), offset],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        })
}

module.exports = { allCategory };
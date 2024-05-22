// const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const { getAllCategory } = require('../service/CategoryService');

const allCategory = async (req, res, next) => {
    try {
        const { limit, current_page } = req.query;
        const allCategory = await getAllCategory(limit, current_page);
        res.status(StatusCodes.OK).json(allCategory);
    } catch (err) {
        next(err);
    }
}

module.exports = { allCategory };
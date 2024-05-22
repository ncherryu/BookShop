const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../utils/CustomError');
const Category = require('../models/category');

const getAllCategory = async (limit, currentPage) => {
    try {
        const offset = limit * (currentPage - 1);
        const categories = await Category.findAll({
            limit: parseInt(limit),
            offset: offset
        });

        if (!categories.length) {
            throw new CustomError(
                '카테고리가 없습니다.',
                StatusCodes.NOT_FOUND
            );
        }

        return categories;
    } catch (err) {
        throw new CustomError(
            err.message || '카테고리 조회 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

module.exports = { getAllCategory };
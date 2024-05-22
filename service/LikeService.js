const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../utils/CustomError');
const Like = require('../models/likes');

const isExistedLike = async (userId, bookId) => {
    try {
        const isLiked = await Like.findOne({
            attributes: ['user_id', 'liked_book_id'],
            where: {
                user_id: userId,
                liked_book_id: bookId
            }
        });

        if (isLiked) { return true; }
        return false;
    } catch (err) {
        throw new CustomError(
            '좋아요 여부 확인 실패',
            StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const createLike = async (userId, bookId) => {
    try {
        const isLiked = await isExistedLike(userId, bookId);
        if (isLiked) {
            throw new CustomError(
                '이미 좋아요 되어 있습니다.',
                StatusCodes.BAD_REQUEST
            );
        }

        const createLikeResult = await Like.create({
            user_id: userId,
            liked_book_id: bookId
        });

        return createLikeResult;
    } catch (err) {
        throw new CustomError(
            err.message || '좋아요 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const deleteLike = async (userId, bookId) => {
    try {
        const deleteLikeResult = await Like.destroy({
            where: { user_id: userId, liked_book_id: bookId }
        });

        if (!deleteLikeResult) {
            throw new CustomError(
                '좋아요 되어 있지 않습니다.',
                StatusCodes.NOT_FOUND
            )
        }

        return deleteLikeResult;
    } catch (err) {
        throw new CustomError(
            err.message || '좋아요 취소 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }

}

module.exports = { createLike, deleteLike };
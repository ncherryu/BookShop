const { StatusCodes } = require('http-status-codes');
const { getLoginedId } = require('../jwtAuthorization');
const { createLike, deleteLike } = require('../service/LikeService');

const addLike = async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id);
        const userId = getLoginedId(req);
        const createLikeResult = await createLike(userId, bookId);
        return res.status(StatusCodes.CREATED).json(createLikeResult);
    } catch (err) {
        next(err);
    }
};

const removeLike = async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id);
        const userId = getLoginedId(req);
        const deleteLikeResult = await deleteLike(userId, bookId);
        return res.status(StatusCodes.OK).json(deleteLikeResult);
    } catch (err) {
        next(err);
    }
};

module.exports = { addLike, removeLike };
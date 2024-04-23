const express = require('express');
const router = express.Router();
const { addLike, removeLike } = require('../controller/LikeController');
const { bookIdValidate } = require('../validator/LikeValidator');
const { validate } = require('../validator/validate');
const { validateToken } = require('../jwtAuthorization');

router.use(express.json());

// 좋아요 추가
router.post(
    '/:id',
    [validateToken, bookIdValidate, validate],
    addLike
);

// 좋아요 취소
router.delete(
    '/:id',
    [validateToken, bookIdValidate, validate],
    removeLike
);

module.exports = router;
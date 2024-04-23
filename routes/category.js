const express = require('express');
const router = express.Router();
const {
    allCategory
} = require('../controller/CategoryController');
const { limitValidate, currentPageValidate } = require('../validator/CategoryValidator');
const { validate } = require('../validator/validate');

router.use(express.json());

router.get(
    '/',
    [limitValidate, currentPageValidate, validate],
    allCategory); // 카테고리 전체 목록 조회

module.exports = router;


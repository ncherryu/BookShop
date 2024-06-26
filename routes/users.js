const express = require('express');
const router = express.Router();
const {
    join,
    login,
    passwordResetRequest,
    passwordReset
} = require('../controller/UserController');
const {
    emailValidate,
    passwordValidate
} = require('../validator/UserValidator');
const { validate } = require('../validator/validate');

router.use(express.json());

router.post(
    '/join',
    [emailValidate, passwordValidate, validate],
    join
);
router.post(
    '/login',
    [emailValidate, passwordValidate, validate],
    login
);
router.post(
    '/reset',
    [emailValidate, validate],
    passwordResetRequest
);
router.put(
    '/reset',
    [emailValidate, passwordValidate, validate],
    passwordReset
);

module.exports = router;
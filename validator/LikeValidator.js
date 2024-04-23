const { param } = require('express-validator');

const bookIdValidate = param('id').notEmpty().isInt().withMessage('책 id 필요');

module.exports = { bookIdValidate };

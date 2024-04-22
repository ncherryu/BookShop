const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');

dotenv.config();

function ensureAuthorization(req) {
    try {
        const receivedJwt = req.headers['authorization'];
        const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

        return decodedJwt;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

function validateToken(req, res, next) {
    const authorization = ensureAuthorization(req);
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.'
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: '잘못된 토큰입니다.'
        });
    }

    return next();
}

module.exports = { ensureAuthorization, validateToken };
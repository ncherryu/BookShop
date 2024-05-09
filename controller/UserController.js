const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const join = (req, res) => {
    const { email, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    const sql = `INSERT INTO users(email, password, salt) VALUES(?, ?, ?)`;
    const values = [email, hashPassword, salt]
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (results.affectedRows) {
                res.status(StatusCodes.CREATED).json(results);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        });
};

const login = (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];

            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');

            if (loginUser && loginUser.password === hashPassword) {
                // token  발행
                const token = jwt.sign({
                    id: loginUser.id,
                    email: loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '30m', // payload에 exp 항목과 iss 항목이 생김. 토큰 유효 기간과 발행자를 의미
                    issuer: 'minjin'
                });

                // 토큰 쿠키에 담기
                res.cookie('token', token, {
                    httpOnly: true
                });
                console.log(token);

                res.status(StatusCodes.OK).json(results);
            } else { // 입력한 url도 유효하지만 접근이 금지됨 = 너를 인증해줄수 없다.
                res.status(StatusCodes.UNAUTHORIZED).end();
                // 401: UNAUTHORIZED(미인증), 403: FORBIDDEN(접근 권리 없음)
            }
        }
    );
};

const passwordResetRequest = (req, res) => {
    const { email } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({
                    email: email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const passwordReset = (req, res) => {
    const { email, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
    const values = [hashPassword, salt, email];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        })
};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users');
const { CustomError } = require('../utils/CustomError');
const { passwordEncryption, getHashPassword } = require('../utils/passwordEncryption');

dotenv.config();

const findUser = async (email) => {
    try {
        const foundUser = await User.findOne({
            where: { email: email }
        })

        return foundUser;
    } catch (err) {
        throw new CustomError(
            '사용자를 찾을 수 없습니다.',
            StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const createUser = async (email, password) => {
    try {
        const foundUser = await findUser(email);

        if (foundUser) {
            throw new CustomError(
                '이미 사용된 이메일입니다.',
                StatusCodes.BAD_REQUEST
            )
        }

        const { salt, hashPassword } = passwordEncryption(password);

        const createdResult = await User.create({
            email: email,
            password: hashPassword,
            salt: salt
        })

        return createdResult;

    } catch (err) {
        throw new CustomError(
            err.message || '사용자 생성 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const createToken = (id, email) => {
    const token = jwt.sign({
        id: id,
        email: email
    }, process.env.PRIVATE_KEY, {
        expiresIn: '30m',
        issuer: 'minjin'
    });

    return token;
}

const loginUser = async (email, password) => {
    try {
        const foundUser = await findUser(email);

        if (foundUser) {
            const hashPassword = getHashPassword(password, foundUser.salt);
            if (foundUser.password === hashPassword) {
                const token = createToken(foundUser.id, email);

                return token;
            }
        }

        throw new CustomError(
            '아이디 또는 비밀번호가 일치하지 않습니다.',
            StatusCodes.UNAUTHORIZED
        );
    } catch (err) {
        throw new CustomError(
            err.message || '로그인 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const checkExistedEmail = async (email) => {
    try {
        const foundUser = await findUser(email);

        if (foundUser) {
            return true;
        }

        throw new CustomError(
            '존재하지 않는 이메일 입니다.',
            StatusCodes.UNAUTHORIZED
        )
    } catch (err) {
        throw new CustomError(
            err.message || '비밀번호 초기화 요청 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const changePassword = async (email, password) => {
    try {
        const { salt, hashPassword } = passwordEncryption(password);

        const result = await User.update({
            password: hashPassword,
            salt: salt
        }, {
            where: {
                email: email
            }
        });

        if (!result[0]) {
            throw new CustomError(
                '존재하지 않는 이메일 입니다.',
                StatusCodes.BAD_REQUEST
            )
        }
    } catch (err) {
        throw new CustomError(
            err.message || '비밀번호 변경 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

module.exports = {
    createUser,
    loginUser,
    checkExistedEmail,
    changePassword
};
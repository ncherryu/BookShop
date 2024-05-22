const crypto = require('crypto');

const getHashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
}

const passwordEncryption = (password) => {
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = getHashPassword(password, salt);

    return { salt, hashPassword };
}

module.exports = { passwordEncryption, getHashPassword };
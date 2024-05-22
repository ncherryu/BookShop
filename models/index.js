const Sequelize = require('sequelize');
const Book = require('./books');
const CartItem = require('./cartItems');
const Category = require('./category');
const Delivery = require('./delivery');
const Like = require('./likes');
const OrderedBook = require('./orderedBook');
const Order = require('./orders');
const User = require('./users');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

Book.initiate(sequelize);
CartItem.initiate(sequelize);
Category.initiate(sequelize);
Delivery.initiate(sequelize);
Like.initiate(sequelize);
OrderedBook.initiate(sequelize);
Order.initiate(sequelize);
User.initiate(sequelize);

// associate 함수에서 관계 함수를 인식 못하는 오류 발생으로 관계는 여기에 작성
Category.hasMany(Book);
Book.belongsTo(Category);
Book.hasMany(Like);
Like.belongsTo(Book);
User.hasMany(Like);
Like.belongsTo(User);
Book.hasMany(CartItem, { foreignKey: 'id', sourceKey: 'id' });
CartItem.belongsTo(Book, { foreignKey: 'id', targetKey: 'id' });
Order.belongsTo(Delivery, { foreignKey: 'delivery_id' });
Delivery.hasMany(Order, { foreignKey: 'id' });
OrderedBook.belongsTo(Book, { foreignKey: 'book_id' });
Book.hasMany(OrderedBook, { foreignKey: 'id' });


module.exports = db;
module.exports = { sequelize };
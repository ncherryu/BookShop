const Sequelize = require('sequelize');

class CartItem extends Sequelize.Model {
    static initiate(sequelize) {
        CartItem.init({
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'books',
                    key: 'id'
                }
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'CartItem',
            tableName: 'cartItems',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    // 외래키: book_id, user_id
    static associate(db) {}
}

module.exports = CartItem;
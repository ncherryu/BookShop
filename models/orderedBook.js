const Sequelize = require('sequelize');

class OrderedBook extends Sequelize.Model {
    static initiate(sequelize) {
        OrderedBook.init({
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                }
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
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'OrderedBook',
            tableName: 'orderedBook',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    // 외래키: order_id, book_id
    static associate(db) { }
}

module.exports = OrderedBook;
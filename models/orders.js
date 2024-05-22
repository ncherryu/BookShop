const Sequelize = require('sequelize');

class Order extends Sequelize.Model {
    static initiate(sequelize) {
        Order.init({
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            book_title: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            total_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            total_price: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            delivery_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'delivery',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Order',
            tableName: 'orders',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    // 외래키: user_id, delivery_id
    static associate(db) {}
}

module.exports = Order;
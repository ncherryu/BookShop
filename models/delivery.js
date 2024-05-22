const Sequelize = require('sequelize');

class Delivery extends Sequelize.Model {
    static initiate(sequelize) {
        Delivery.init({
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            address: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            receiver: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            contact: {
                type: Sequelize.STRING(45),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Delivery',
            tableName: 'delivery',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static associate(db) {}
}

module.exports = Delivery;
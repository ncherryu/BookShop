const Sequelize = require('sequelize');

class Like extends Sequelize.Model {
    static initiate(sequelize) {
        Like.init({
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                autoIncrement: false,
                primaryKey: true
            },
            liked_book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'books',
                    key: 'id'
                },
                autoIncrement: false,
                primaryKey: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Like',
            tableName: 'likes',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    // 외래키: user_id, liked_book_id
    static associate(db) { }
}

module.exports = Like;
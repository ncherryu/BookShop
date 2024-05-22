const Sequelize = require('sequelize');

class Book extends Sequelize.Model {
    static initiate(sequelize) {
        Book.init({
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            img: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'category',
                    key: 'category_id'
                }
            },
            form: {
                type: Sequelize.STRING(45),
                allowNull: false
            },
            isbn: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true
            },
            summary: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            detail: {
                type: Sequelize.TEXT('long'),
                allowNull: true
            },
            author: {
                type: Sequelize.STRING(45),
                allowNull: true
            },
            pages: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            contents: {
                type: Sequelize.TEXT('long'),
                allowNull: true
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            pub_date: {
                type: Sequelize.DATE,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Book',
            tableName: 'books',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static associate(db) {

    }
}

module.exports = Book;
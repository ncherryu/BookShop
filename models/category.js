const Sequelize = require('sequelize');

class Category extends Sequelize.Model {
    static initiate(sequelize) {
        Category.init({
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            category_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Category',
            tableName: 'category',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    // static associate(db) {
    //     db.Category.hasMany(db.Book, { foreignKey: 'category_id', sourceKey: 'category_id' });
    // }
}

module.exports = Category;
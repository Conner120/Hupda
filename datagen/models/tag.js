/* jshint indent: 1 */
var uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const tag = sequelize.define('tag', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
            field: 'id'
        },
        tag: {
            type: DataTypes.STRING(90),
            allowNull: false,
            unique: false,
            field: 'tag'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'createdAt'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updatedAt'
        },
    }, {
        tableName: 'tags'
    });
    tag.associate = function (models) {
        tag.belongsToMany(models.post, { through: 'TaggedPosts' })
    }
    return tag;
};

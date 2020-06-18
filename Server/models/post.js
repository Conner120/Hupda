/* jshint indent: 1 */
var uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const post = sequelize.define('post', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
            field: 'id'
        },
        title: {
            type: DataTypes.STRING(120),
            allowNull: false,
            defaultValue: "My Post",
            unique: false,
            field: 'title'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false,
            field: 'content',
        },
        impressions: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            field: 'impressions',
        },
        profileId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'profile',
                key: 'id'
            },
            field: 'profile_id'
        },
        alc: {
            type: DataTypes.INTEGER,
            default: 0
        },
        visible: {
            type: DataTypes.ENUM('visible', 'deleted'),
            allowNull: false,
            defaultValue: 'visible',
            field: 'visible'
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
        tableName: 'posts'
    });
    post.associate = function (models) {
        post.hasMany(models.postMedia, { as: 'media', foreignKey: 'post_id', sourceKey: 'id' });
        post.hasMany(models.reaction, { foreignKey: 'post_id', sourceKey: 'id' });
        post.belongsTo(models.profile, { foreignKeyConstraint: true, as: "poster", foreignKey: 'profile_id' })
        post.hasMany(models.comment, { as: 'comments', foreignKey: 'post_id', sourceKey: 'id' })
    }
    return post;
};

/* jshint indent: 1 */
var uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const postMedia = sequelize.define('postMedia', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
            field: 'id'
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false,
            field: 'type'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description'
        },
        alc: {
            type: DataTypes.INTEGER,
            default: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'createdAt'
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
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            },
            field: 'post_id'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updatedAt'
        },
    }, {
        tableName: 'postsMedia'
    });
    postMedia.associate = function (models) {
        postMedia.belongsTo(models.profile, { foreignKeyConstraint: true, as: "poster", foreignKey: 'profile_id' })
        postMedia.belongsTo(models.postMedia, { foreignKey: 'post_id', targetKey: 'id' });
    }
    return postMedia;
};

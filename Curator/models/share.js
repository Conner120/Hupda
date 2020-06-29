/* jshint indent: 1 */
var uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const share = sequelize.define('share', {
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
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            },
            field: 'post_id'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false,
            field: 'content',
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
        }
    }, {
        tableName: 'sharePost'
    });
    share.associate = function (models) {
        share.belongsTo(models.profile, { foreignKeyConstraint: true, as: "poster", foreignKey: 'profile_id' });
        share.belongsTo(models.post, { as: 'sharedContent', foreignKey: 'post_id', sourceKey: 'id' })
    }
    return share;
};

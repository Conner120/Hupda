/* jshint indent: 1 */
var uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const profile = sequelize.define('profile', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
            field: 'id'
        },
        settings: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'settings'
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            },
            field: 'user_id'
        },
        first: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'first'
        },
        last: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'last'
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'email'
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'phone'
        },

        DOB: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'dob'
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
        profilepicuri: {
            type: DataTypes.STRING(2048),
            allowNull: true,
            field: 'profilepicuri'
        }
    }, {
        tableName: 'profiles'
    });
    profile.associate = function (models) {
        profile.belongsTo(models.user, { foreignKeyConstraint: true, as: "user", foreignKey: 'user_id' })
        profile.belongsToMany(models.profile, { as: 'friends', through: 'friend_friend' })
        profile.hasMany(models.post, { foreignKey: 'profileId' });
    }
    return profile;
};

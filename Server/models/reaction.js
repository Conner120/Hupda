/* jshint indent: 1 */
var uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const reaction = sequelize.define('reaction', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
            field: 'id'
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
        profileId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'profile',
                key: 'id'
            },
            field: 'profile_id'
        },
        reactionType: {
            type: DataTypes.ENUM('love', 'like', 'dislike', 'thanks', 'good job'),
            allowNull: false,
            field: 'type'
        }
    }, {
        tableName: 'reactions'
    });
    reaction.associate = function (models) {
        reaction.belongsTo(models.profile, { foreignKeyConstraint: true, as: "reactor", foreignKey: 'profile_id' })
        reaction.belongsTo(models.post, { foreignKey: 'post_id', targetKey: 'id' });
    }
    return reaction;
};

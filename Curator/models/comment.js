/* jshint indent: 1 */
var uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    comment = sequelize.define('comment', {
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
        commentId: {
            type: DataTypes.UUID,
            allowNull: false,
            // references: {
            //     model: 'post',
            //     key: 'id'
            // },
            field: 'comment_id'
        },

    }, {
        tableName: 'comments'
    });
    comment.associate = function (models) {
        comment.belongsTo(models.post, { foreignKeyConstraint: true, as: "originalPost", foreignKey: 'postId' })
        comment.belongsTo(models.post, { foreignKeyConstraint: true, as: "commentPost", foreignKey: 'commentId' })
    }
    return comment;
};

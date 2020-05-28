'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true,
        }
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('posts');
  }
};

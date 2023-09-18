"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UsersComments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.STRING,
      },
      contentId: {
        type: Sequelize.STRING,
      },
      parentId: {
        type: Sequelize.STRING,
      },
      text: {
        type: Sequelize.STRING,
      },
      createAt: {
        type: Sequelize.DATE,
      },
      modifyAt: {
        type: Sequelize.DATE,
      },
      upvotes: {
        type: Sequelize.INTEGER,
      },
      downvotes: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UsersComments");
  },
};

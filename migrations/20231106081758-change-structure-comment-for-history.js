"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("UsersComments", "title", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Default Title",
      }),
      queryInterface.changeColumn("UsersComments", "contentId", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "0",
      }),
      queryInterface.changeColumn("UsersComments", "userId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.removeColumn("UsersComments", "upvotes", {}),
      queryInterface.removeColumn("UsersComments", "downvotes", {}),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      tokenValue: {
        type: Sequelize.STRING
      },
      createAt: {
        type: Sequelize.DATE
      },
      expiredAt: {
        type: Sequelize.DATE
      },
      usageState: {
        type: Sequelize.STRING
      },
      tokenType: {
        type: Sequelize.STRING
      },
      deiceInfo: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  }
};
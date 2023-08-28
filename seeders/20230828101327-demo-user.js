"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 生成隨機整數
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 生成隨機日期（近期）
    function getRandomDate(start, end) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    }

    // 產生 10 筆隨機資料
    const randomData = Array.from({ length: 10 }, () => {
      const firstNames = [
        "John",
        "Jane",
        "Michael",
        "Emily",
        "William",
        "Olivia",
      ];
      const lastNames = [
        "Doe",
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
      ];
      const emails = [
        "example1@example.com",
        "example2@example.com",
        "example3@example.com",
      ];

      const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
      const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
      const email = emails[getRandomInt(0, emails.length - 1)];

      const createdAt = getRandomDate(new Date(2023, 0, 1), new Date());
      const updatedAt = getRandomDate(createdAt, new Date());

      return { firstName, lastName, email, createdAt, updatedAt };
    });

    // 使用 map 將資料轉換成所需格式
    const formattedData = randomData.map((item) => {
      return {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    return queryInterface.bulkInsert("Users", formattedData);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};

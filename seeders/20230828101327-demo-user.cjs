"use strict";

/* const { createHash } = require("node:crypto");

const hash = createHash("sha256"); */

// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50

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

    const firstNames = [
      "John",
      "Jane",
      "Michael",
      "Emily",
      "William",
      "Olivia",
    ];
    const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones"];

    // 產生 10 筆隨機資料
    const randomData = Array.from({ length: 10 }, (idx) => {
      const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
      const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;

      const createdAt = getRandomDate(new Date(2023, 0, 1), new Date());
      const updatedAt = getRandomDate(createdAt, new Date());

      return { firstName, lastName, email, createdAt, updatedAt, idx };
    });

    return import("../utils/hash.mjs")
      .then((module) => {
        const { createHash } = module;
        return createHash("1qazxswe");
      })
      .then((result) => {
        // 使用 calculateHash 函数
        // 使用 map 將資料轉換成所需格式
        const userBaseId = 10_000;
        const formattedData = randomData.map((item, index) => {
          return {
            userName: item.firstName + item.lastName,
            email: item.email,
            password: result,
            //modifyAt: item.createdAt,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            verificationStatus: "false",
            userId: `A${userBaseId + index}`,
          };
        });
        formattedData.push({
          userName: "olivia.doe",
          email: "olivia.doe@gmail.com",
          password: result,
          //modifyAt: item.createdAt,
          createdAt: new Date(),
          updatedAt: new Date(),
          verificationStatus: "false",
          userId: `A${userBaseId + 11}`,
        });
        return queryInterface.bulkInsert("Users", formattedData);
      });
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

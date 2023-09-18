"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const words = [
      "Lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "consectetur",
      "adipiscing",
      "elit",
      "sed",
      "do",
      "eiusmod",
      "tempor",
      "incididunt",
      "ut",
      "labore",
      "et",
      "dolore",
      "magna",
      "aliqua",
      "Ut",
      "enim",
      "ad",
      "minim",
      "veniam",
      "quis",
      "nostrud",
      "exercitation",
      "ullamco",
      "laboris",
      "nisi",
      "ut",
      "aliquip",
      "ex",
      "ea",
      "commodo",
      "consequat",
      "Duis",
      "aute",
      "irure",
      "dolor",
      "in",
      "reprehenderit",
      "in",
      "voluptate",
      "velit",
      "esse",
      "cillum",
      "dolore",
      "eu",
      "fugiat",
      "nulla",
      "pariatur",
      "Excepteur",
      "sint",
      "occaecat",
      "cupidatat",
      "non",
      "proident",
      "sunt",
      "in",
      "culpa",
      "qui",
      "officia",
      "deserunt",
      "mollit",
      "anim",
      "id",
      "est",
      "laborum",
    ];
    function createRandomComment() {
      const minWords = 1;
      const maxWords = 10;
      const wordCount =
        Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
      let appendedText = "";
      for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        appendedText += words[randomIndex] + " ";
      }

      return appendedText.trim();
    }

    const commentBaseId = 1000;
    const userBaseId = 10_000;

    const contentObjs = Array.from({ length: 10 }, (_, index) => index).map(
      (_, idx) => {
        return {
          userId: `A${userBaseId + idx}`,
          contentId: `C${1000 + idx}`,
          parentId: null,
          text: createRandomComment(),
          createdAt: new Date(),
          //modifyAt: new Date(),
          updatedAt: new Date(),
          upvotes: 0,
          downvotes: 0,
        };
      }
    );
    await queryInterface.bulkInsert("UsersComments", contentObjs, {});
  },
  /* userId: DataTypes.STRING,
  contentId: DataTypes.STRING,
  parentId: DataTypes.STRING,
  text: DataTypes.STRING,
  createAt: DataTypes.DATE,
  modifyAt: DataTypes.DATE,
  upvotes: DataTypes.INTEGER,
  downvotes: DataTypes.INTEGER */
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

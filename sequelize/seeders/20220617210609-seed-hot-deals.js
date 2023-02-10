'use strict';

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
    return queryInterface.bulkInsert(
      'deals',
      [
        {
          id: 'c6fe38a9-37c3-4def-ac51-6daafbfd6997',
          agent_id: 'dce6090b-bbe2-4ced-85ef-b4e0a7e8325f',
          title: 'Ưu đãi cuối năm từ Thuận Phát!',
          image:
            'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/banner.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '938032a8-43ca-4634-904d-b5c7beec0975',
          agent_id: '51290b47-cf2c-46cd-8f15-40274e6a5358',
          title: 'Ưu đãi cuối năm từ Thuận Phát!',
          image:
            'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/banner.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '0cdf6e1b-5835-4620-8cfb-55a0e0abb584',
          agent_id: '3f7ae35b-466a-4494-ae1b-70ea26c154cd',
          title: 'Ưu đãi cuối năm từ Thuận Phát!',
          image:
            'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/banner.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('deals', null, {});
  },
};

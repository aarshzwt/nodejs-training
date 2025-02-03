'use strict';
const { faker } = require('@faker-js/faker'); 
const { User } = require('../Exercises/Day7/models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    var dummyJSON = [];
   for(var i = 0 ; i < 15 ; i++){
      dummyJSON.push({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(), 
        age: faker.number.int({ min: 5, max: 100 }),
        role: faker.helpers.arrayElement(['Admin', 'User']),
        isActive: faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
   }
   await User.bulkCreate(dummyJSON, { individualHooks: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};

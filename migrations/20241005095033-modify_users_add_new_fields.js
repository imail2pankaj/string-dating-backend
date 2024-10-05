'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users', // table name
        'age', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
      ),
      queryInterface.addColumn(
        'users',
        'profile_pic',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'users',
        'location',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'users',
        'bio',
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'profile_pic'),
      queryInterface.removeColumn('users', 'location'),
      queryInterface.removeColumn('users', 'age'),
      queryInterface.removeColumn('users', 'bio'),
    ]);
  }
};

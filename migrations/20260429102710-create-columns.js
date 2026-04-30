'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('OrderItem', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('OrderItem', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('Order', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('Order', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('Customer', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('Customer', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('MenuItem', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('MenuItem', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('OrderItem', 'createdAt');
    await queryInterface.removeColumn('OrderItem', 'updatedAt');
    await queryInterface.removeColumn('Order', 'createdAt');
    await queryInterface.removeColumn('Order', 'updatedAt');
    await queryInterface.removeColumn('Customer', 'createdAt');
    await queryInterface.removeColumn('Customer', 'updatedAt');
    await queryInterface.removeColumn('MenuItem', 'createdAt');
    await queryInterface.removeColumn('MenuItem', 'updatedAt');
  }
};

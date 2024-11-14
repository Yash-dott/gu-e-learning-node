'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Students', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            studentId: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            mobile: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.TEXT('long')
            },
            picture: {
                type: Sequelize.STRING
            },
            FCM: {
                type: Sequelize.TEXT('long')
            },
            courseId: {
                type: Sequelize.INTEGER
            },
            semesterId: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.BOOLEAN
            },
            createdBy: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('Students');
    }
};
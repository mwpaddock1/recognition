const uuid = require('uuid');

function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
}
const mongoose = require('mongoose');

const employeeList = {
    create: function (lastName, firstName, emailAddress, password) {
        console.log('Creating new employee');
        const employee = {
            lastName: lastName,
            firstName: firstName,
            emailAddress: emailAddress,
            password: password,
            id: uuid.v4(),
        };
        this.employees[employee.id] = employee;
        return employee;
    },
    get: function () {
        console.log('Retrieving employee list employees');
        return Object.keys(this.employees).map(key => this.employees[key]);
    },
    delete: function (id) {
        console.log(`Deleting employee list employee \`${id}\``);
        delete this.items[id];
    },
    update: function (updatedEmployee) {
        console.log(`Updating employee list employee\`${updatedEmployee.id}\``);
        const {
            id
        } = updatedEmployee;
        if (!(id in this.employees)) {
            throw StorageException(
                `Can't update item \`${id}\` because doesn't exist.`)
        }
        this.employees[updatedEmployee.id] = updatedEmployee;
        return updatedEmployee;
    }
};

function createEmployeeList() {
    const storage = Object.create(employeeList);
    storage.employees = {};
    return storage;
}

module.exports = {
    employeeList: createEmployeeList()
}
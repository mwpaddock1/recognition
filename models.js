const uuid = require('uuid');

function StorageException(message) {
    this.message = message;
    this.name = "StorageException";
}

const employeeList = {
    create: function (lastName, firstName, emailAddress) {
        console.log('Creating new employee');
        const employee = {
            lastName: lastName,
            firstName: firstName,
            emailAddress: emailAddress,
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

function createemployeeList() {
    const storage = Object.create(employeeList);
    storage.employees = {};
    return storage;
}

module.exports = {
    employeeList: createemployeeList()
}
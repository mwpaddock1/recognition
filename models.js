const uuid = require('uuid');

// this module provides volatile storage, using a `ShoppingList`
// and `Recipes` model. We haven't learned about databases yet,
// so for now we're using in-memory storage. This means each time
// the app stops, our storage gets erased.

// don't worry to much about how `ShoppingList` and `Recipes`
// are implemented. Our concern in this example is with how
// the API layer is implemented, and getting it to use an
// existing model.


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
        console.log(`Deleting employeelist employee\`${updatedEmployee.id}\``);
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
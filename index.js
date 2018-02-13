const MOCK_DATA = {
    employees: [{
            lastName: "Foo",
            firstName: "Joseph",
            emailAddress: "jfoo@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0
        },
        {
            lastName: "Bar",
            firstName: "Mary",
            emailAddress: "mbar@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0
        },
        {
            lastName: "Staff",
            firstName: "John",
            emailAddress: "jstaff@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0
        },
        {
            lastName: "Worker",
            firstName: "John",
            emailAddress: "jworker@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0
        }
    ]
};

// backend fetch data call
function fetchEmployees(callback) {
    // The data fed into this callback needs to look the same as what the 
    // api call would return.
    callback(MOCK_DATA.employees);
}

// Actual app code
let employees = [];

fetchEmployees((fetchedEmployees) => {
    employees = fetchedEmployees;
});

let index = 0;

function moveToNextEmployee(event) {
    index = (index + 1) % employees.length;
    let currentEmployee = employees[index];

    firstNameTag.innerText = currentEmployee.firstName;
    lastNameTag.innerText = currentEmployee.lastName;
}
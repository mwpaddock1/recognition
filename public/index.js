const MOCK_DATA = {
    employees: [{
            lastName: "Foo",
            firstName: "Joseph",
            emailAddress: "jfoo@fizzbuzz.com",
            pointsGiven: 10,
            pointsReceived: 5,
            pointsRemaining: 90,
            pointsFromLastName: "Bar",
            pointsFromFirstName: "Mary",
            corpGoal: "costs",
            points: 5,
            reason: "sourced a new paper vendor"
        },
        {
            lastName: "Bar",
            firstName: "Mary",
            emailAddress: "mbar@fizzbuzz.com",
            pointsGiven: 5,
            pointsReceived: 0,
            pointsRemaining: 95,
            pointsFromLastName: "Staff",
            pointsFromFirstName: "John",
            corpGoal: "service",
            points: 10,
            reason: "served dinner at the homeless shelter"
        },
        {
            lastName: "Staff",
            firstName: "John",
            emailAddress: "jstaff@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 10,
            pointsRemaining: 100
        },
        {
            lastName: "Worker",
            firstName: "John",
            emailAddress: "jworker@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0,
            pointsRemaining: 100
        }
    ]
};

function getEmployees(callbackFn) {
    setTimeout(function () {
        callbackFn(MOCK_DATA)
    }, 100);
}

// this function stays the same when we connect
// to real API later
function displayEmployees(employees) {

    for (let currentEmployee = 0; currentEmployee < employees.length; currentEmployee++) {

        $('#js-last-name').append(`<h2>${employees[currentEmployee].lastName}</h2>`);
        $('#js-first-name').append(`<h2>${employees[currentEmployee].firstName}</h2>`);
        $('#js-points-received').append(`<h2>${employees[currentEmployee].pointsReceived}</h2>`);
        $('#js-points-given').append(`<h2>${employees[currentEmployee].pointsGiven}</h2>`);
        $('#js-points-remaining').append(`<h2>${employees[currentEmployee].pointsRemaining}</h2>`);
    }
}

$("form[name=sign-up-form]").submit(function (event) {
    event.preventDefault();
    //get the form inputs and place them into an array
    let inputArray =
        $(event.currentTarget).serializeArray();

    //reformat the array
    let reformattedArray = inputArray.map(item => {
        let rObj = {};
        console.log(item);
        rObj[item.name] = item.value;
        return rObj;
    })

    console.log(reformattedArray);

    const reducingFunction = (obj1, obj2) =>
        Object.assign(obj1, obj2);
    let newEmployee = (reformattedArray.reduce(reducingFunction));
    let loggedInEmployee = (`${newEmployee.firstName} ${newEmployee.lastName}`);

    $('#js-logged-in-employee').append(`You are logged in as ${loggedInEmployee}`);
    console.log(reformattedArray.reduce(reducingFunction));
    addNewEmployee(newEmployee)
        .then(getAllEmployees)
        .then(displayEmployees);
});

function addNewEmployee(employeeData) {
    return new Promise((resolve, reject) => {
        MOCK_DATA.employees.push(employeeData);
        resolve();
    })
}

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        resolve(MOCK_DATA.employees);
    });
}

function myApplication() {
    // //Add an employee
    // addNewEmployee({
    //         firstName: 'Tony',
    //         lastName: 'Perkins',
    //     })
    //     .then(getAllEmployees)
    //     .then(displayEmployees);
}




$('#employee-list').click(function (event) {
    console.log("employee has been selected-sending to individual employee page")
    //hide and display correct elements in here when the htmls are combined
})

$('.js-new-points.button').click(function (event) {
    console.log("sending to addpoints section")
})

$('.js-add-points-button.button').click(function (event) {
    console.log("adding the points");

    // for giver and recipient:
    //update the points
    //display the goal and the reason
    //then, return to employee-list
})




// this function can stay the same even when we
// are connecting to real API
function getAndDisplayEmployees() {
    getEmployees(displayEmployees);
}

$(function () {
    myApplication();
});
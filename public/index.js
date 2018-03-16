// console.log(JSON.stringify({
//     employees: [{
//             lastName: "Foo",
//             firstName: "Joseph",
//             emailAddress: "jfoo@fizzbuzz.com",
//             pointsGiven: 10,
//             pointsReceived: 5,
//             pointsRemaining: 90,
//             pointsFromLastName: "Bar",
//             pointsFromFirstName: "Mary",
//             corpGoal: "costs",
//             points: 5,
//             reason: "sourced a new paper vendor"
//         },
//         {
//             lastName: "Bar",
//             firstName: "Mary",
//             emailAddress: "mbar@fizzbuzz.com",
//             pointsGiven: 5,
//             pointsReceived: 0,
//             pointsRemaining: 95,
//             pointsFromLastName: "Staff",
//             pointsFromFirstName: "John",
//             corpGoal: "service",
//             points: 10,
//             reason: "served dinner at the homeless shelter"
//         },
//         {
//             lastName: "Staff",
//             firstName: "John",
//             emailAddress: "jstaff@fizzbuzz.com",
//             pointsGiven: 0,
//             pointsReceived: 10,
//             pointsRemaining: 100
//         },
//         {
//             lastName: "Worker",
//             firstName: "John",
//             emailAddress: "jworker@fizzbuzz.com",
//             pointsGiven: 0,
//             pointsReceived: 0,
//             pointsRemaining: 100
//         }
//     ]
// }));

// function getEmployees(callbackFn) {
//     setTimeout(function () {
//         callbackFn(MOCK_DATA)
//     }, 100);
// }

// this function stays the same when we connect
// to real API later
let globalEmployees;
let tranxLog;

function displayEmployees(globalEmployees) {
    for (let currentEmployee = 0; currentEmployee < globalEmployees.length; currentEmployee++) {
        const empInfoHTML = (
            ` <div class = "current-employee" data-email="${globalEmployees[currentEmployee].emailAddress}">
                    <h2 class = "js-last-name employee-box"> ${globalEmployees[currentEmployee].lastName}</h2>
                    <h2 class = "js-first-name employee-box"> ${globalEmployees[currentEmployee].firstName}</h2>
                    <h2 class = "js-points-received employee-box"> ${globalEmployees[currentEmployee].pointsReceived}</h2>
                    <h2 class = "js-points-given employee-box"> ${globalEmployees[currentEmployee].pointsGiven}</h2>
                    <h2 class = "js-points-remaining employee-box"> ${globalEmployees[currentEmployee].pointsRemaining}</h2>                    
              </div>
            `
        )
        $('row.employee-boxes').append(empInfoHTML);
    }
    $('.current-employee').click(function (event) {
        let selectedEmployeeEmail = ($(event.currentTarget).data('email'));
        console.log("sending to individual-employee addpoints section");
        let selectedEmployee = globalEmployees.filter(globalEmployee => selectedEmployeeEmail === globalEmployee.emailAddress);
        console.log(selectedEmployee);
        return selectedEmployee;
    });
}

$("form[name=sign-up-form]").submit(function (event) {
    event.preventDefault();
    //get the form inputs and place them into an array
    let inputArray =
        $(event.currentTarget).serializeArray();

    let reformattedArray = inputArray.map(item => {
        let rObj = {};
        console.log(item);
        rObj[item.name] = item.value;
        return rObj;
    });
    const reducingFunction = (obj1, obj2) =>
        Object.assign(obj1, obj2);
    let newEmployee = (reformattedArray.reduce(reducingFunction));

    let loggedInEmployee = (`${newEmployee.firstName} ${newEmployee.lastName}`);
debugger
    $('.js-logged-in-employee').append(`You are logged in as ${loggedInEmployee}`);
    console.log(reformattedArray.reduce(reducingFunction));
    addNewEmployee(newEmployee)
        .then(getAllEmployees)
        .then((employeesGet) => {
            globalEmployees = employeesGet;
            return globalEmployees;
        })
        .then(displayEmployees);
    console.log('here');
    console.log(globalEmployees);
});
//login existing employee
function login(emailAddress, password) {
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();
        getAllEmployees(MOCK_DATA);
        resolve();
    })
}
$("form[name=login-form]").submit(function (event) {
    event.preventDefault();
    const employeeEmail = $('input[name=email]');
    const loggedInEmployeeEmail = employeeEmail.val();
    const employeePassword = $('input[name=login-password]');
    const loggedInEmployeePassword = employeePassword.val();

    login(loggedInEmployeeEmail, loggedInEmployeePassword)
        .then(getAllEmployees)
        .then((employeesGet) => {
            globalEmployees = employeesGet;
            return globalEmployees;
        })
        .then(displayEmployees);
    console.log(globalEmployees);

    function userFind(user) {
        return (user.emailAddress === loggedInEmployeeEmail && user.password === loggedInEmployeePassword)
    }
    let loggedInUser = globalEmployees.filter(globalEmployee => loggedInEmployeeEmail === globalEmployee.emailAddress);
    console.log(loggedInUser);
    return loggedInUser


    if (!loggedInUser) {
        console.log('rejected');
    } else {
        $('#js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
    }

    login(loggedInEmployeeEmail, loggedInEmployeePassword)
        .then(loggedInUser => {})

        .catch(err => {
            console.log('error');
        });
})

function getMockData() {
    let MOCK_DATA_STRING = localStorage.getItem('MOCK_DATA');
    let MOCK_DATA = JSON.parse(MOCK_DATA_STRING);
    return MOCK_DATA;
}

function setMockData(MOCK_DATA) {
    let MOCK_DATA_STRING = JSON.stringify(MOCK_DATA);
    localStorage.setItem('MOCK_DATA', MOCK_DATA_STRING);
}
//add new employee and login 
function addNewEmployee(employeeData) {
    employeeData.pointsGiven = 0;
    employeeData.pointsReceived = 0;
    employeeData.pointsRemaining = 100;
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();
        //also give the new empl
        MOCK_DATA.employees.push(employeeData);
        setMockData(MOCK_DATA);
        resolve();
    })
}

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();
        resolve(MOCK_DATA.employees);
    });
}
$('.button-give-points').click(function (event) {
    console.log("going to assign points page");
});

$("form[name=add-points-form]").submit(function (event) {
    event.preventDefault();
    //grab the inputs and update the db
    const employeeAction = $('input[name=employee-action]');
    const reason = employeeAction.val();
    const corpGoal = $('select[name=goal]');
    const goal = corpGoal.val();
    const pointsDropdown = $('select[name=points]');
    const points = pointsDropdown.val();
    console.log(reason);
    console.log(goal);
    console.log(points);
    // for giver and recipient:
    //update the points, goal and reason
    //then, return to updated employee-list
});

// this function can stay the same even when we
// are connecting to real API

// function getAndDisplayEmployees() {
//     getEmployees(displayEmployees);
//}
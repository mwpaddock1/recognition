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
function displayEmployees(employees) {
    for (let currentEmployee = 0; currentEmployee < employees.length; currentEmployee++) {
        const empInfoHTML = (
            ` <div class = "current-employee" data-email="${employees[currentEmployee].emailAddress}">
                    <h2 class = "js-last-name employee-box"> ${employees[currentEmployee].lastName}</h2>
                    <h2 class = "js-first-name mployee-box"> ${employees[currentEmployee].firstName}</h2>
                    <h2 class = "js-points-received employee-box"> ${employees[currentEmployee].pointsReceived}</h2>
                    <h2 class = "js-points-given employee-box"> ${employees[currentEmployee].pointsGiven}</h2>
                    <h2 class = "js-points-remainingemployee-box"> ${employees[currentEmployee].pointsRemaining}</h2>                    
              </div>
            `
        )
        $('row.employee-boxes').append(empInfoHTML);
    }
    $('.current-employee').click(function (event) {
        console.log($(event.currentTarget).data('email'));
        console.log("sending to individual-employee addpoints section");
        //display employee name and current recognition status -given&received- along with ellipses and totals
    });
}
let globalEmployees;
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
    const reducingFunction = (obj1, obj2) =>
        Object.assign(obj1, obj2);
    let newEmployee = (reformattedArray.reduce(reducingFunction));
    let loggedInEmployee = (`${newEmployee.firstName} ${newEmployee.lastName}`);

    $('#js-logged-in-employee').append(`You are logged in as ${loggedInEmployee}`);
    console.log(reformattedArray.reduce(reducingFunction));
    addNewEmployee(newEmployee)
        .then(getAllEmployees)
        .then((employeesGet) => {
            globalEmployees = employeesGet;
            return globalEmployees;
        })

        .then(displayEmployees);
});
//login existing employee
function login(emailAddress, password) {
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();

        function userFind(user) {
            return (user.emailAddress === emailAddress && user.password === password)
        }
        let loggedInUser = MOCK_DATA.employees.find(userFind);
        if (!loggedInUser) {
            reject()
        } else {
            resolve()
            $('#js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
            getAllEmployees(MOCK_DATA);
            displayEmployees(MOCK_DATA.employees);
        }
    })
}
$("form[name=login-form]").submit(function (event) {
    event.preventDefault();
    //use the email address to find the logged-in-employee and then list on the screen
    const employeeEmail = $('input[name=email]');
    const loggedInEmployeeEmail = employeeEmail.val();
    const employeePassword = $('input[name=login-password]');
    const loggedInEmployeePassword = employeePassword.val();

    login(loggedInEmployeeEmail, loggedInEmployeePassword)

        .then(loggedInUser => {})
        .catch(err => {
            console.log('error');
        });
});

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
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();
        //also give the new employee points
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
})

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
// }
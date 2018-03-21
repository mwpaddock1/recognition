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

// // }));
// console.log(JSON.stringify({
//     transactions: [{
//             recipientLastName: "Foo",
//             recipientFirstName: "Joseph",
//             recipientEmailAddress: "jfoo@fizzbuzz.com",
//             senderLastName: "Bar",
//             senderFirstName: "Mary",
//             senderEmailAddress: "mbar@fizzbuzz.com",
//             goal: "costs",
//             points: 5,
//             reason: "sourced a new paper vendor"
//         },
//         {
//             recipientLastName: "Bar",
//             recipientFirstName: "Mary",
//             recipientEmailAddress: "mbar@fizzbuzz.com",
//             senderLastName: "Staff",
//             senderFirstName: "John",
//             senderEmailAddress: "jstaff@fizzbuzz.com",
//             goal: "service",
//             points: 10,
//             reason: "served dinner at the homeless shelter"

//         }

//     ]
//  }));

// function getEmployees(callbackFn) {
//     setTimeout(function () {
//         callbackFn(MOCK_DATA)
//     }, 100);
// }

// this function stays the same when we connect
// to real API later
let globalEmployees;
let globalTransactions;
let user;
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
    user = newEmployee;

    $('.js-logged-in-employee').append(`You are logged in as ${user.firstName} ${user.lastName}`);
    console.log(reformattedArray.reduce(reducingFunction));
    addNewEmployee(newEmployee)
        .then(getAllEmployees)
        .then((employeesGet) => {
            globalEmployees = employeesGet;
            return globalEmployees;
        })
        .then(displayEmployees)

});
$("form[name=login-form]").submit(function (event) {
    event.preventDefault();
    const employeeEmail = $('input[name=email]');
    const loggedInEmployeeEmail = employeeEmail.val();
    const employeePassword = $('input[name=login-password]');
    const loggedInEmployeePassword = employeePassword.val();
    console.log(loggedInEmployeeEmail);

    getAllEmployees()
        .then((employeesGet) => {
            globalEmployees = employeesGet;

            function getUser() {
                for (let i = 0; i < globalEmployees.length; i++) {
                    let userEmail = globalEmployees[i].emailAddress;
                    let userPassword = globalEmployees[i].password;
                    if (userEmail === loggedInEmployeeEmail && userPassword === loggedInEmployeePassword) {
                        user = globalEmployees[i];
                        $('.js-logged-in-employee').append(`You are logged in as ${user.firstName} ${user.lastName}`);
                        console.log(user);
                    } else {
                        console.log('no match');
                    }
                }
            }
            getUser();
            return globalEmployees
        })

        .then(displayEmployees)
});

function addNewEmployee(employeeData) {
    employeeData.pointsGiven = 0;
    employeeData.pointsReceived = 0;
    employeeData.pointsRemaining = 100;
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();
        //also include the new employee
        MOCK_DATA.employees.push(employeeData);
        setMockData(MOCK_DATA);
        resolve();
    })
}


//login existing employee
function loginEmployee(info) {
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();
        setMockData(MOCK_DATA);
        //getAllEmployees(MOCK_DATA);
        resolve();
    })
}

function getMockData() {
    let MOCK_DATA_STRING = localStorage.getItem('MOCK_DATA');
    let MOCK_DATA = JSON.parse(MOCK_DATA_STRING);
    return MOCK_DATA;
}

function setMockData(MOCK_DATA) {
    let MOCK_DATA_STRING = JSON.stringify(MOCK_DATA);
    localStorage.setItem('MOCK_DATA', MOCK_DATA_STRING);
}

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();
        resolve(MOCK_DATA.employees);
    })
}

function displayEmployees() {
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
        console.log(selectedEmployeeEmail);
        console.log("sending to individual-employee addpoints section");
        let selectedEmployee = globalEmployees.filter(globalEmployee => selectedEmployeeEmail === globalEmployee.emailAddress);
        console.log(selectedEmployee);
        selectedIndividual = {
            firstName: selectedEmployee[0].firstName,
            lastName: selectedEmployee[0].lastName,
            emailAddress: selectedEmployee[0].emailAddress,
        }
        let recipientEmailInput = $("#recipient");

        recipientEmailInput.val(selectedIndividual.emailAddress);

        document.getElementById('employee').innerHTML = selectedIndividual.firstName + ' ' + selectedIndividual.lastName;
        
        getAllTranx()
            .then((transactionsGet) => {
                globalTransactions = transactionsGet;
                
                const selectedEmployeePointsStatus = globalTransactions.filter(globalTransaction =>
                   globalTransaction.recipientEmailAddress === selectedIndividual.emailAddress || globalTransaction.senderEmailAddress === selectedIndividual.emailAddress
                );
                debugger
                console.log (selectedEmployeePointsStatus);
                const pointsStatusHTML= (`
                
                
                
                `

                )
                
            })
    });
}
$('.button-give-points').click(function (event) {
    console.log("going to assign points page");
});


$("form[name=add-points-form]").submit(function (event) {
    event.preventDefault();
    //grab the inputs and update the transactions
    const employeeAction = $('input[name=employee-action]');
    const reason = employeeAction.val();
    const corpGoal = $('select[name=goal]');
    const goal = corpGoal.val();
    const pointsDropdown = $('select[name=points]');
    const points = pointsDropdown.val();

    let newTransaction = {
        senderEmailAddress: user.emailAddress,
        goal: goal,
        points: points,
        reason: reason,
        recipientEmailAddress: $("#recipient").val()
    }
    console.log(reason);
    console.log(goal);
    console.log(points);
    // console.log(senderEmail);
    addNewTranx(newTransaction)
        .then(getAllTranx)
        .then((transactionsGet) => {
            globalTransactions = transactionsGet;
            return globalTransactions;
        })
        .then(displayTranx)
});

function updateEmployeePoints(newTransaction) {
    function findRecipient(employee) {
        return employee.emailAddress === newTransaction.recipientEmailAddress;
    }
    let recipient = globalEmployees.find(findRecipient);
    recipient.pointsReceived = (recipient.pointsReceived + newTransaction.points)

    function findSender(employee) {
        return employee.emailAddress === newTransaction.senderEmailAddress;
    }
    let sender = globalEmployees.find(findSender);
    globalEmployees.pointsGiven = globalEmployess.pointsGiven + newTransaction.points
    globalEmployees.pointsRemainingGiven = globalEmployess.pointsRemaining - newTransaction.points
}

function addNewTranx(tranxData) {
    return new Promise((resolve, reject) => {
        let TRANX_DATA = getTranxData();
        //also include the new employee
        TRANX_DATA.transactions.push(tranxData);
        setTranxData(TRANX_DATA);
        resolve();
    })
}

function getTranxData() {
    let TRANX_DATA_STRING = localStorage.getItem('TRANX_DATA');
    let TRANX_DATA = JSON.parse(TRANX_DATA_STRING);
    return TRANX_DATA;
}

function setTranxData(TRANX_DATA) {
    let TRANX_DATA_STRING = JSON.stringify(TRANX_DATA);
    localStorage.setItem('TRANX_DATA', TRANX_DATA_STRING);
}

function getAllTranx() {
    return new Promise((resolve, reject) => {
        let TRANX_DATA = getTranxData();
        resolve(TRANX_DATA.transactions);
    })
}

function displayTranx() {
    for (let currentTranx = 0; currentTranx < globalTransactions.length; currentTranx++) {
        const tranxInfoHTML = (
            ` <div class = "current-transaction">
                <h2>Sender Email: ${globalTransactions[currentTranx].senderEmailAddress}</h2>
                <h2>Points Given: ${globalTransactions[currentTranx].points}</h2>
                <h2>Corporate Goal: ${globalTransactions[currentTranx].goal}</h2>
                <h2>Description: ${globalTransactions[currentTranx].reason}</h2> 
                <h2>Recipient:${globalTransactions[currentTranx].recipientEmailAddress}</h2>
                <br>                      
              </div>
            `
        )

        $('section.js-transaction-log').append(tranxInfoHTML);
    }
}
// for giver and recipient:
//update the points, goal and reason
//then, return to updated employee-list


// this function can stay the same even when we
// are connecting to real API

// function getAndDisplayEmployees() {
//     getEmployees(displayEmployees);
//
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
//             corpGoal: "Costs",
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

// //  }));
// console.log(JSON.stringify({
//     transactions: [{
//             recipientLastName: "Foo",
//             recipientFirstName: "Joseph",
//             recipientEmailAddress: "jfoo@fizzbuzz.com",
//             senderLastName: "Bar",
//             senderFirstName: "Mary",
//             senderEmailAddress: "mbar@fizzbuzz.com",
//             goal: "Costs",
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

// $(".new-search-button").on("click", function (event) {
//     $(".js-search-form").removeClass("hidden");
//     $(".js-search-results").addClass("hidden");
$('.sign-up-opening-button').on("click", function (event) {
    $('.thumbs-up').addClass('hidden');
    $('#js-sign-up-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('button.sign-up-button').removeClass('hidden');
    $('button.login-button').addClass('hidden');
    $('button.login-opening-button').addClass('hidden');
    $('.sign-up-opening-button').addClass('hidden');

});

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
    //add something to make sure an employee doesn't dupe him/herself
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
$('.login-opening-button').on("click", function (event) {
    $('.thumbs-up').addClass('hidden');
    $('#js-login-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('button.login-button').addClass('hidden');
    $('button.sign-up-button').addClass('hidden');
    $('button.sign-up-opening-button').addClass('hidden');
    $('.login-opening-button').addClass('hidden');
});
$('.cancel-button').on("click", function (event) {
    $('.thumbs-up').removeClass('hidden');
    $('#js-login-form').addClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
    $('.cancel-button').addClass('hidden');
    $('button.login-button').removeClass('hidden');
    $('button.sign-up-button').removeClass('hidden');
    $('button.sign-up-opening-button').removeClass('hidden');
    $('.login-opening-button').removeClass('hidden');
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
                        console.log('Please enter a valid email address and password combinaton');
                    }
                }
            }
            getUser();
            return globalEmployees
        })
        .then(displayEmployees)
});
$('.sign-in-button').on("click", function (event) {
    $('#js-login-form').addClass('hidden');
    $('.goal-container').removeClass('hidden');
    $('.employee-list').removeClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
});
$('button.employee-list-button').click(function (event) {
    $('.employee-list').removeClass('hidden');
    $('button.employee-list-button').addClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('.individual-recognition-summary').addClass('hidden');
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
        resolve(employeeData);
    })
}

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
        $('.employee-list').addClass('hidden');
        $('button.sign-in-button').addClass('hidden');
        $('button.employee-list-button').removeClass('hidden');
        $('.cancel-button').addClass('hidden');
        $('.individual-recognition-summary').removeClass('hidden');
        let selectedEmployeeEmail = ($(event.currentTarget).data('email'));
        console.log(selectedEmployeeEmail);
        console.log("sending to individual-employee addpoints section");
        let selectedEmployee = globalEmployees.filter(globalEmployee => selectedEmployeeEmail === globalEmployee.emailAddress);

        console.log(selectedEmployee);

        if (selectedEmployee.pointsRemaining <= 0) {
            alert("You have used your alloted 100 points for this year. Please give your recognition verbally!")
        }

        if (selectedEmployee.emailAddress === user.emailAddress) {
            alert("You may not give points to yourself!")

        } else {
            let selectedIndividual = {
                firstName: selectedEmployee[0].firstName,
                lastName: selectedEmployee[0].lastName,
                emailAddress: selectedEmployee[0].emailAddress,
            }

            let recipientEmailInput = $("#recipient");

            recipientEmailInput.val(selectedIndividual.emailAddress);

            $('.employee-page-title').append(`Recognition for ${selectedIndividual.firstName} ${ selectedIndividual.lastName}`

            );

            getAllTranx()
                .then((transactionsGet) => {
                    globalTransactions = transactionsGet;

                    let highlightedEmployeeInfo = globalTransactions.filter(globalTransaction => (globalTransaction.senderEmailAddress === selectedIndividual.emailAddress) || (globalTransaction.recipientEmailAddress === selectedIndividual.emailAddress)
                        //highlightedEmployeeInfo is an array of objects
                    )
                    let sortedTransactions = highlightedEmployeeInfo.reduce(function (allTransactions, transaction) {
                        if (transaction.goal in allTransactions) {
                            allTransactions[transaction.goal].push(transaction);
                            debugger
                        } else {

                            allTransactions[transaction.goal] = [transaction];
debugger

                            return allTransactions;
                        }
                    }, {});

                    for (let i = 0; i < highlightedEmployeeInfo.length; i++) {
                        let transactionInfo = {
                            goal: highlightedEmployeeInfo[i].goal,
                            points: highlightedEmployeeInfo[i].points,
                            reason: highlightedEmployeeInfo[i].reason,
                            senderEmailAddress: highlightedEmployeeInfo[i].senderEmailAddress,
                            // senderFirstName: highlightedEmployeeInfo[i].senderFirstName,
                            // senderLastName: highlightedEmployeeInfo[i].senderLastName,
                            recipientEmailAddress: highlightedEmployeeInfo[i].recipientEmailAddress,
                            // recipientFirstName: highlightedEmployeeInfo[i].recipientFirstName,
                            // recipientLastName: highlightedEmployeeInfo[i].recipientLastName
                        }
                        let recipientHTMLResults = formatRecipientInfo(transactionInfo);
                        let senderHTMLResults = formatSenderInfo(transactionInfo);
                    };
                });

            function formatSenderInfo(transactionInfo) {
                const senderInfoHTML = (
                    `<section class ="points-given"> 
                                          <p class="ellipse ellipse-display ${transactionInfo.goal}-ellipse">${transactionInfo.goal}</p> <h2> ${transactionInfo.points} points from Sender <i>${transactionInfo.reason}</i><h2>
                             </section>`
                );

                $("row.points-given-box").append(senderInfoHTML);
                return senderInfoHTML;
            }

            function formatRecipientInfo(transactionInfo) {
                const recipientInfoHTML = (
                    `<section class ="points-received">                                   
                                       <p class="ellipse ellipse-display ${transactionInfo.goal}-ellipse">${transactionInfo.goal}</p> <h2> ${transactionInfo.points} points to Recipient for: <i>${transactionInfo.reason}</i><h2>
                             </section>`
                );
                $("row.points-received-box").append(recipientInfoHTML);
                return recipientInfoHTML;
            }
        };
    })
    $('button.give-points-button').click(function (event) {
        $('.individual-info-container').removeClass('hidden');
        $('.individual-recognition-summary').addClass('hidden');


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
        const points = parseInt(pointsDropdown.val());

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
            .then(updateEmployeePoints)
            .then(getAllTranx)
            .then((transactionsGet) => {
                globalTransactions = transactionsGet;
                return globalTransactions;
            })
            .then(displayTranx)

        //figure out where these go:
        $('.employee-list').removeClass('hidden');
        $('button.employee-list-button').addClass('hidden');
        $('button.cancel-button').removeClass('hidden');
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
        sender.pointsGiven = sender.pointsGiven + newTransaction.points

        sender.pointsRemaining = sender.pointsRemaining - newTransaction.points
    }



    function addNewTranx(tranxData) {
        return new Promise((resolve, reject) => {
            let TRANX_DATA = getTranxData();
            //also include the new employee
            TRANX_DATA.transactions.push(tranxData);
            setTranxData(TRANX_DATA);

            let MOCK_DATA = getMockData();

            function findRecipient(employee) {
                return employee.emailAddress === tranxData.recipientEmailAddress;
            }

            let recipient = MOCK_DATA.employees.find(findRecipient);
            recipient.pointsReceived = recipient.pointsReceived + tranxData.points

            function findSender(employee) {
                return employee.emailAddress === tranxData.senderEmailAddress
            }
            let sender = MOCK_DATA.employees.find(findSender)
            sender.pointsGiven = sender.pointsGiven + tranxData.points;

            sender.pointsRemaining = sender.pointsRemaining - tranxData.points
            setMockData(MOCK_DATA)
            resolve(tranxData);
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
                                            <h2>Recipient: ${globalTransactions[currentTranx].recipientEmailAddress}</h2>
                                            <br>                      
                                          </div>
                                        `
            )

            $('section.js-transaction-log').append(tranxInfoHTML);
        }
    }
}

// for giver and recipient:
//update the points, goal and reason
//then, return to updated employee-list


// this function can stay the same even when we
// are connecting to real API

// function getAndDisplayEmployees() {
//     getEmployees(displayEmployees);
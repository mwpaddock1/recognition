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
let JWT;
let loggedInUser;

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
    loggedInUser = newEmployee;
    //add something to make sure an employee doesn't dupe him/herself

    console.log(reformattedArray.reduce(reducingFunction));
    addNewEmployee(newEmployee)
        .then(getAllEmployees)
        .then((employeesGet) => {
            globalEmployees = employeesGet;
            return globalEmployees;
        })
        .then(displayEmployees)
    $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${  loggedInUser.lastName}`);
});
$('.login-opening-button').on("click", function (event) {
    $('.thumbs-up').addClass('hidden');
    $('#js-login-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('button.login-button').addClass('hidden');
    $('button.login-banner-button').addClass('hidden');
    $('button.sign-up-button').addClass('hidden');
    $('button.sign-up-opening-button').addClass('hidden');
    $('.login-opening-button').addClass('hidden');
});
$('button.login-banner-button').on('click', function (event) {
    $('.thumbs-up').addClass('hidden');
    $('#js-login-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('button.login-button').addClass('hidden');
    $('button.login-banner-button').addClass('hidden');
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
    $('.goals').addClass('hidden');
    $('.employee-list').addClass('hidden');
});
$("form[name=login-form]").submit(function (event) {
    event.preventDefault();
    const employeeEmail = $('input[name=email]');
    const loggedInEmployeeEmail = employeeEmail.val();
    const employeePassword = $('input[name=login-password]');
    const loggedInEmployeePassword = employeePassword.val();
    console.log(loggedInEmployeeEmail);
    loginEmployee(loggedInEmployeeEmail, loggedInEmployeePassword)
        .then(getAllEmployees)
        .then((employeesGet) => {
            globalEmployees = employeesGet;
            return globalEmployees
        })
        .then(displayEmployees)
    // $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);

});
$('.sign-in-button').on("click", function (event) {
    $('#js-login-form').addClass('hidden');
    $('.goals').removeClass('hidden');
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

function loginEmployee(loggedInEmployeeEmail, loggedInEmployeePassword) {
    let token = "thisisastring";
    return new Promise((resolve, reject) => {
        let MOCK_DATA = getMockData();

        function getUser() {
            for (let i = 0; i < MOCK_DATA.employees.length; i++) {
                let userEmail = MOCK_DATA.employees[i].emailAddress;
                let userPassword = MOCK_DATA.employees[i].password;
                if (userEmail === loggedInEmployeeEmail && userPassword === loggedInEmployeePassword) {
                    return MOCK_DATA.employees[i]
                }
            }
        }
        loggedInUser = getUser();
        resolve({
            token,
            loggedInUser
        });
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
        if (loggedInUser.pointsRemaining <= 0) {
            alert("You have used your alloted 100 points for this year. Please give your recognition verbally!")
        }
        if (selectedEmployeeEmail === loggedInUser.emailAddress) {
            alert("You may not give points to yourself!")
        } else {
            $('.employee-list').addClass('hidden');
            $('button.sign-in-button').addClass('hidden');
            $('button.employee-list-button').removeClass('hidden');
            $('.cancel-button').addClass('hidden');
            $('.individual-recognition-summary').removeClass('hidden');
            let selectedIndividual = {
                firstName: selectedEmployee[0].firstName,
                lastName: selectedEmployee[0].lastName,
                emailAddress: selectedEmployee[0].emailAddress,
            }
            let recipientEmailInput = $("#recipient");
            recipientEmailInput.val(selectedIndividual.emailAddress);
            $('.employee-page-title').append(`Recognition for ${selectedIndividual.firstName} ${ selectedIndividual.lastName}`);
           
            getAllTranx()
                .then((transactionsGet) => {
                    globalTransactions = transactionsGet;
                    let highlightedEmployeeSenderInfo = globalTransactions.filter(globalTransaction => (globalTransaction.senderEmailAddress === selectedIndividual.emailAddress))

                    let sortedSentTransactions = highlightedEmployeeSenderInfo.reduce(function (allSentTransactions, transaction) {
                        if (transaction.goal in allSentTransactions) {
                            allSentTransactions[transaction.goal].push(transaction);
                            return allSentTransactions;
                        } else {
                            allSentTransactions[transaction.goal] = [transaction];                            
                            return allSentTransactions; 
                        }                      
                    }, {});
                    console.log(sortedSentTransactions);
                    for (i in sortedSentTransactions) {
                           //sortedSentTransactions is an object with 4 keys(Cost, Sales, Ideas, Service) which have arrays as the values
                        for (let j = 0; j <sortedSentTransactions[i].length; j++) {                           
                            sentTransactionInfo = {
                                goal: sortedSentTransactions[i][j].goal,
                                points: sortedSentTransactions[i][j].points,
                                reason: sortedSentTransactions[i][j].reason,
                                // senderEmailAddress: sortedSentTransactions[i][j].senderEmailAddress,
                                // senderFirstName: sortedSentTransactions[i][j].senderFirstName,
                                // senderLastName: sortedSentTransactions[i][j].senderLastName,
                                recipientEmailAddress: sortedSentTransactions[i][j].recipientEmailAddress,
                                recipientFirstName: sortedSentTransactions[i][j].recipientFirstName,
                                recipientLastName: sortedSentTransactions[i][j].recipientLastName
                            }

                            // if (j === 0) {
                            //     const sentCategoryInfoHTML = (`<section class="points-given"><p class="ellipse ellipse-display ${sentTransactionInfo.goal}-ellipse">${sentTransactionInfo.goal}</p>
                            //     </section>`);
                            //     $("row.points-given-box").append(sentCategoryInfoHTML);
                            //     return
                            // } else {
                            //     console.log('nothing to do here')
                            // }

                            let senderHTMLResults = formatSenderInfo(sentTransactionInfo);
                        }                        
                    };
                    let highlightedEmployeeRecipientInfo = globalTransactions.filter(globalTransaction =>
                        (globalTransaction.recipientEmailAddress === selectedIndividual.emailAddress)
                        //highlightedEmployeeInfo is an array of objects
                    )

                    let sortedRecipientTransactions = highlightedEmployeeRecipientInfo.reduce(function (allReceivedTransactions, transaction) {
                        if (transaction.goal in allReceivedTransactions) {
                            allReceivedTransactions[transaction.goal].push(transaction);
                            return allReceivedTransactions;
                        } else {
                            allReceivedTransactions[transaction.goal] = [transaction];
                            return allReceivedTransactions;
                        }
                    }, {});
                    console.log(sortedRecipientTransactions);
                    for (let i in sortedRecipientTransactions) {
                        
                        //sortedRecipientTransactions is an object with 4 keys(Cost, Sales, Ideas, Service) which have arrays as the values
                        for (let j = 0; j < sortedRecipientTransactions[i].length; j++) {

                            // if (j = 0) {
                            //     const recipientCategoryInfoHTML = (
                            //         `<section class="points-given"><p class="ellipse ellipse-display ${sortedRecipientTransactions[i][j].goal}-ellipse">${sortedRecipientTransactions[i][j].goal}</p>
                            //         </section>`
                            //     );
                            //     $("row.points-given-box").append(recipientCategoryInfoHTML);
                            //     return recipientCategoryInfoHTML
                            // } else {
                            //     console.log(j);
                            // }
                            recipientTransactionInfo = {
                                goal: sortedRecipientTransactions[i][j].goal,
                                points: sortedRecipientTransactions[i][j].points,
                                reason: sortedRecipientTransactions[i][j].reason,
                                senderEmailAddress: sortedRecipientTransactions[i][j].senderEmailAddress,
                                // senderFirstName: sortedSentTransactions[i][j].senderFirstName,
                                // senderLastName: sortedSentTransactions[i][j].senderLastName,
                                recipientEmailAddress: sortedRecipientTransactions[i][j].recipientEmailAddress,
                                recipientFirstName: sortedRecipientTransactions[i][j].recipientFirstName,
                                recipientLastName: sortedRecipientTransactions[i][j].recipientLastName
                            }


                            let recipientHTMLResults = formatRecipientInfo(recipientTransactionInfo);
                            // if (j == 0) {
                            //     const recipientCategoryInfoHTML = (`<section class="points-given"><p class="ellipse ellipse-display ${recipientTransactionInfo.goal}-ellipse">${recipientTransactionInfo.goal}</p>
                            //         </section>`);
                            //     $("row.points-given-box").append(recipientCategoryInfoHTML);
                            //     return recipientCategoryInfoHTML
                            // } else {
                            //     console.log(j);
                            // }
                        }
                    }
                });
        };
    });

    function formatSenderInfo(sentTransactionInfo) {
        const sentInfoHTML = (
            `<section class ="points-given"> 
                    <h2> ${sentTransactionInfo.points} points to ${sentTransactionInfo.recipientEmailAddress} ${sentTransactionInfo.senderLastName} for <i>${sentTransactionInfo.reason}</i><h2>
             </section>`
        );

        $("row.points-given-box").append(sentInfoHTML);
        return sentInfoHTML;
    }

    function formatRecipientInfo(recipientTransactionInfo) {
        const recipientInfoHTML = (
            `<section class ="points-received">                                   
                                        <h2> ${recipientTransactionInfo.points} points from ${recipientTransactionInfo.senderEmailAddress} ${recipientTransactionInfo.recipientLastName} for: <i>${recipientTransactionInfo.reason}</i><h2>
                             </section>`
        );
        $("row.points-received-box").append(recipientInfoHTML);
        return recipientInfoHTML;
    }
};

$('button.give-points-button').click(function (event) {
    $('.individual-info-container').removeClass('hidden');
    $('.individual-recognition-summary').addClass('hidden');


    console.log("going to assign points page");
});

$("form[name=add-points-form]").submit(function (event) {
    event.preventDefault();
    $('.employee-boxes').empty();

    //grab the inputs and update the transactions
    const employeeAction = $('input[name=employee-action]');
    const reason = employeeAction.val();
    const corpGoal = $('select[name=goal]');
    const goal = corpGoal.val();
    const pointsDropdown = $('select[name=points]');
    const points = parseInt(pointsDropdown.val());

    let newTransaction = {
        senderEmailAddress: loggedInUser.emailAddress,
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
        .then(getAllEmployees)
        .then(displayEmployees);
    //figure out where these go:
    $('.employee-list').removeClass('hidden');
    $('button.employee-list-button').addClass('hidden');
    $('button.logout-button').removeClass('hidden');
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





// this function can stay the same even when we
// are connecting to real API

// function getAndDisplayEmployees() {
//     getEmployees(displayEmployees);
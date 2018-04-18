let globalEmployees;
let globalTransactions;
let JWT;
let loggedInUser;

$('.sign-up-opening-button').on("click", function (event) {
    renderSignUpForm()
});

function renderSignUpForm() {
    $('.thumbs-up').addClass('hidden');
    $('#js-sign-up-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('.sign-up-button').removeClass('hidden');
    $('.login-button').addClass('hidden');
    $('.login-opening-button').addClass('hidden');
    $('.sign-up-opening-button').addClass('hidden');
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
    loggedInUser = newEmployee;

    console.log(reformattedArray.reduce(reducingFunction));
    addNewEmployee(newEmployee)
        .then(getAllEmployees)
        .then((employeesGet) => {
            globalEmployees = employeesGet;
            return globalEmployees;
        })
        .then(displayEmployees)
    $('.demo-credentials').addClass('hidden');

    $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
    document.getElementById("js-sign-up-form").reset();

});
$('.login-opening-button').on("click", function (event) {
    renderLoginForm()
});

function renderLoginForm() {
    $('.thumbs-up').addClass('hidden');
    $('#js-login-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('.login-button').addClass('hidden');
    $('.sign-in-button').removeClass('hidden');
    $('.login-banner-button').addClass('hidden');
    $('.sign-up-button').addClass('hidden');
    $('.sign-up-opening-button').addClass('hidden');
    $('.login-opening-button').addClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
    
};
$('.login-banner-button').on('click', function (event) {
    renderLoginForm()
});

function renderRestart() {
    $('#js-login-form').addClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
    $('.cancel-button').addClass('hidden');
    $('.login-button').removeClass('hidden');
    $('.sign-up-button').removeClass('hidden');
    $('.sign-up-opening-button').removeClass('hidden');
    $('.login-opening-button').removeClass('hidden');
    $('.thumbs-up').removeClass('hidden');
    $('.goals').addClass('hidden');
    $('.employee-list').addClass('hidden');
    $('.demo-credentials').removeClass('hidden');
    $('.goals').addClass('hidden');
    $('row.employee-boxes').empty();
    $('.employee-list').addClass('hidden');
    $('.demo-credentials').removeClass('hidden');
    $('.logout-button').addClass('hidden');
    $('.js-logged-in-employee').empty();
}
$('.cancel-button').on("click", function (event) {
    renderRestart()
});
$('.logout-button').on('click', function (event) {
    renderRestart()
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
        .then(displayEmployees);
    if (loggedInUser.emailAddress === 'hr@fizzbuzz.com') {
        $('.delete-employee-button').removeClass('hidden')
    }

    $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
    document.getElementById("js-login-form").reset();
});
$('delete-employee-button').on("click", function (event){
    // remove employee
})
$('.sign-in-button').on("click", function (event) {
    $('#js-login-form').addClass('hidden');
    $('.goals').removeClass('hidden');
    $('.employee-list').removeClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
    $('.demo-credentials').addClass('hidden');
});
$('.employee-list-button').click(function (event) {
    $('.employee-list').removeClass('hidden');
    $('section.points-given').empty();
    $('section.points-received').empty();
    $('.employee-page-title').empty();
    $('.employee-list-button').addClass('hidden');
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

    //get the selected employee and display his / her points
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
            $('.sign-in-button').addClass('hidden');
            $('.employee-list-button').removeClass('hidden');
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
                    //then pick out the transactions related to the highlighted employee
                    let sortedSentTransactions = highlightedEmployeeSenderInfo.reduce(function (allSentTransactions, transaction) {
                        if (transaction.goal in allSentTransactions) {
                            allSentTransactions[transaction.goal].push(transaction);
                            return allSentTransactions;
                        } else {
                            allSentTransactions[transaction.goal] = [transaction];
                            return allSentTransactions;
                        }
                    }, {});
                    //then break out the sent recognition and display it
                    for (i in sortedSentTransactions) {
                        for (let j = 0; j < sortedSentTransactions[i].length; j++) {
                            function findSortedSenderRecipient(sortedEmp) {
                                return sortedEmp.emailAddress === sortedSentTransactions[i][j].recipientEmailAddress
                            }
                            let sortedSender = globalEmployees.find(findSortedSenderRecipient);
                            sentTransactionInfo = {
                                goal: sortedSentTransactions[i][j].goal,
                                points: sortedSentTransactions[i][j].points,
                                reason: sortedSentTransactions[i][j].reason,
                                recipientEmailAddress: sortedSentTransactions[i][j].recipientEmailAddress,
                                senderFirstName: sortedSender.firstName,
                                senderLastName: sortedSender.lastName,
                            }
                            //break the transactions out by corporate goal
                            if (j === 0) {
                                const goalTitle = sentTransactionInfo.goal;
                                const sentCategoryInfoHTML = (`<section class="points-given"><p class="ellipse ellipse-display ${goalTitle}-ellipse">${goalTitle}</p>
                                                                </section>`);
                                $("row.points-given-box").append(sentCategoryInfoHTML);

                            } else {
                                console.log('not a goal title');
                            }
                            let senderHTMLResults = formatSenderInfo(sentTransactionInfo);
                        }
                    };
                    //then break out the received recognition and display it
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
                    for (let i in sortedRecipientTransactions) {
                        //sortedRecipientTransactions is an object with 4 keys(Cost, Sales, Ideas, Service) which have arrays as the values
                        for (let j = 0; j < sortedRecipientTransactions[i].length; j++) {
                            function findSortedRecipientSender(sortedEmployee) {
                                return sortedEmployee.emailAddress === sortedRecipientTransactions[i][j].senderEmailAddress
                            }
                            let sortedRecipient = globalEmployees.find(findSortedRecipientSender);

                            recipientTransactionInfo = {
                                goal: sortedRecipientTransactions[i][j].goal,
                                points: sortedRecipientTransactions[i][j].points,
                                reason: sortedRecipientTransactions[i][j].reason,
                                senderEmailAddress: sortedRecipientTransactions[i][j].senderEmailAddress,
                                recipientFirstName: sortedRecipient.firstName,
                                recipientLastName: sortedRecipient.lastName
                            }
                            //break the transactions out by corporate goal
                            if (j === 0) {
                                const goalTitle = recipientTransactionInfo.goal;
                                const recipientCategoryInfoHTML = (`<section class="points-received"><p class="ellipse ellipse-display ${goalTitle}-ellipse">${goalTitle}</p>
                                                                </section>`);
                                $("row.points-received-box").append(recipientCategoryInfoHTML);
                            } else {
                                console.log('not a goal title');
                            }
                            let recipientHTMLResults = formatRecipientInfo(recipientTransactionInfo);
                        }
                    }
                });
        };

    });

    function formatSenderInfo(sentTransactionInfo) {
        const sentInfoHTML = (
            `<section class ="points-given" role="region">                                
                <h2> ${sentTransactionInfo.points} points to ${sentTransactionInfo.senderFirstName} ${sentTransactionInfo.senderLastName} for:  <i>${sentTransactionInfo.reason}</i><h2> 
             </section>`
        );
        $("row.points-given-box").append(sentInfoHTML);
        return sentInfoHTML;
    }

    function formatRecipientInfo(recipientTransactionInfo) {
        const recipientInfoHTML = (
            `<section class ="points-received" role="region">                                                      
               <h2> ${recipientTransactionInfo.points} points from ${recipientTransactionInfo.recipientFirstName} ${recipientTransactionInfo.recipientLastName} for: <i>${recipientTransactionInfo.reason}</i><h2>                                       
             </section>`
        );
        $("row.points-received-box").append(recipientInfoHTML);
        return recipientInfoHTML;
    }

};
$('.give-points-button').click(function (event) {
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
        senderFirstName: loggedInUser.firstName,
        senderLastName: loggedInUser.lastName,
        senderEmailAddress: loggedInUser.emailAddress,
        goal: goal,
        points: points,
        reason: reason,
        recipientEmailAddress: $("#recipient").val()
    }
    console.log(reason);
    console.log(goal);
    console.log(points);

    addNewTranx(newTransaction)
        .then(updateEmployeePoints)
        .then(getAllTranx)
        .then((transactionsGet) => {
            globalTransactions = transactionsGet;
            return globalTransactions;
        })
        .then(getAllEmployees)
        .then(displayEmployees);
    $('.employee-list').removeClass('hidden');
    $('.employee-list-button').addClass('hidden');
    $('.logout-button').removeClass('hidden');
    $('.individual-info-container').addClass('hidden');
    document.getElementById("js-add-points-form").reset();
});

function updateEmployeePoints(newTransaction) {
    function findRecipient(employee) {
        return employee.emailAddress === newTransaction.recipientEmailAddress;
    }

    let recipient = globalEmployees.find(findRecipient);
    recipient.pointsReceived = (recipient.pointsReceived + newTransaction.points);

    function findSender(employee) {
        return employee.emailAddress === newTransaction.senderEmailAddress;
    }
    let sender = globalEmployees.find(findSender);
    sender.pointsGiven = sender.pointsGiven + newTransaction.points;
    sender.pointsRemaining = sender.pointsRemaining - newTransaction.points;
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
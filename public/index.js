let globalEmployees = [];
let globalTransactions = [];
let loggedInUser;
let selectedIndividual;

$("form[name=sign-up-form]").submit(function (event) {
    event.preventDefault();
    //get the form inputs and place them into an array
    let inputArray =
        $(event.currentTarget).serializeArray();
    let reformattedArray = inputArray.map(item => {
        let rObj = {};
        rObj[item.name] = item.value;
        return rObj;
    });
    const reducingFunction = (obj1, obj2) =>
        Object.assign(obj1, obj2);

    let newEmployee = (reformattedArray.reduce(reducingFunction));
    console.log(newEmployee);

    if (newEmployee.password !== newEmployee['retype-password']) {
        alert('Passwords must match!')

    } else {
        loggedInUser = newEmployee;
        addNewEmployee(newEmployee);
        $('.demo-credentials').addClass('hidden');
        $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
    }
    document.getElementById("js-sign-up-form").reset();
});

$("form[name=login-form]").submit(function (event) {
    event.preventDefault();
    const usernameEmail = $('input[name=usernameEmail]');
    const loggedInUsername = usernameEmail.val();
    console.log(loggedInUsername);
    const employeePassword = $('input[name=login-password]');
    const loggedInEmployeePassword = employeePassword.val();
    loginEmployee(loggedInUsername, loggedInEmployeePassword);

    document.getElementById("js-login-form").reset();
});

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function addNewEmployee(employeeData) {
    console.log('inside addNewEmployee');
    $.ajax({
        method: 'POST',
        url: '/users',
        dataType: 'json',
        data: JSON.stringify(employeeData),
        contentType: 'application/json',
        success: function (empData) {
            console.log('employee added');
            getAllEmployees();
            renderEmployeeList();
        }
    });
}

function loginEmployee(loggedInUsername, loggedInEmployeePassword) {
    let employeeData = {
        'username': loggedInUsername,
        'password': loggedInEmployeePassword
    }
    $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        dataType: 'json',
        data: JSON.stringify(employeeData),
        contentType: 'application/json',
        success: function (empData) {
            console.log(empData);
            getAllEmployees();
            let tokenData = parseJwt(empData.authToken);
            loggedInUser = tokenData.user;
            $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
            renderEmployeeList();
        },
        statusCode: {
            401: function () {
                alert('Incorrect Username or Password');
            }
        }
    });
}

// function getMockData() {
//     let MOCK_DATA_STRING = localStorage.getItem('MOCK_DATA');
//     let MOCK_DATA = JSON.parse(MOCK_DATA_STRING);
//     return MOCK_DATA;
//}

// function setMockData(MOCK_DATA) {
//     let MOCK_DATA_STRING = JSON.stringify(MOCK_DATA);
//     localStorage.setItem('MOCK_DATA', MOCK_DATA_STRING);
// }

function getAllEmployees() {
    console.log('inside getAllEmployees');
    $.ajax({
        method: 'GET',
        url: '/users',
        dataType: 'json',
        contentType: 'application/json',
        success: function (empData) {
            displayEmployees(empData.users);
        }
    });
}

function displayEmployees(workers) {
    console.log('inside display Employees');
    globalEmployees = workers;
    for (let i = 0; i < globalEmployees.length; i++) {
        const empInfoHTML = (
            ` <div class = "current-employee" data-username="${globalEmployees[i].username}">
                    <h2 class = "js-last-name employee-box"> ${globalEmployees[i].lastName}</h2>
                    <h2 class = "js-first-name employee-box"> ${globalEmployees[i].firstName}</h2>
                    <h2 class = "js-points-received employee-box"> ${globalEmployees[i].pointsReceived}</h2>
                    <h2 class = "js-points-given employee-box"> ${globalEmployees[i].pointsGiven}</h2>
                    <h2 class = "js-points-remaining employee-box"> ${globalEmployees[i].pointsRemaining}</h2>                   
              </div>
            `
        );
        $('row.employee-boxes').append(empInfoHTML);
    }
}

$('row.employee-boxes').on('click', '.current-employee', function (event) {
    let selectedEmployeeUsername = $(this).data('username');
    selectAndDisplayEmployee(selectedEmployeeUsername);
    // displayEmployeeTransactions(); 
    getAllTransactions();
});

function selectAndDisplayEmployee(selectedEmployeeUsername) {
    //get the selected employee and display his / her points    
    let selectedEmployee = globalEmployees.filter(globalEmployee =>
        selectedEmployeeUsername === globalEmployee.username);
    if (loggedInUser.username === 'hr@fizzbuzz.com') {
        $('.delete-employee-button').removeClass('hidden');
    }
    if (loggedInUser.pointsRemaining <= 0) {
        alert("You have used your alloted 100 points for this year. Please request additional points from Human Resources (hr@fizzbuzz.com) or give your recognition verbally!");
        renderEmployeeList();
    }
    if (selectedEmployee.username === loggedInUser.username) {
        alert("You may not give points to yourself!")
    } else {
        selectedIndividual = {
            firstName: selectedEmployee[0].firstName,
            lastName: selectedEmployee[0].lastName,
            username: selectedEmployee[0].username,
        }
        renderIndividualEmployeeRecognition();
        let recipientUsernameInput = $("#recipient");
        recipientUsernameInput.val(selectedIndividual.username);
        $('.employee-page-title').append(`Recognition for ${selectedIndividual.firstName} ${ selectedIndividual.lastName}`);
        $('.delete-employee-button').on("click", function (event) {
            console.log('delete button clicked');
            deleteEmployee(selectedIndividual.username)
        });
        return selectedIndividual
    }
}

//get and sort the transactions for the selected employee

function displayEmployeeTransactions(awards) {
    console.log('inside displayEmployeeTransactions');
    globalTransactions = awards;
    for (let i = 0; i < globalTransactions.length; i++) {}
    //sent 
    let highlightedEmployeeSenderInfo = globalTransactions.filter(globalTransaction => (globalTransaction.senderUsername === selectedIndividual.username));

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
                return sortedEmp.username === sortedSentTransactions[i][j].recipientUsername
            }

            let sortedSender = globalEmployees.find(findSortedSenderRecipient);

            // maybe have to get this from the transactions -let sortedTransaction = globalTransactions.find etcc...
            sentTransactionInfo = {
                goal: sortedSentTransactions[i][j].goal,
                points: sortedSentTransactions[i][j].points,
                action: sortedSentTransactions[i][j].action,
                recipientUsername: sortedSentTransactions[i][j].recipientUsername,
                // senderFirstName: sortedSentTransactions[i][j].senderFirstName,
                // senderLastName: sortedSentTransactions[i][j].senderLastName,
                senderFirstName: sortedSender.firstName,
                senderLastName: sortedSender.lastName,
            }
            //break the sent transactions out by corporate goal
            if (j === 0) {
                const goalTitle = sentTransactionInfo.goal;
                const sentCategoryInfoHTML = (
                    `<section class="points-given"><p class="ellipse ellipse-display ${goalTitle}-ellipse">${goalTitle}</p>
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
        (globalTransaction.recipientUsername === selectedIndividual.username)
    )
    //received
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
        for (let j = 0; j < sortedRecipientTransactions[i].length; j++) {
            function findSortedRecipientSender(sortedEmployee) {
                return sortedEmployee.username === sortedRecipientTransactions[i][j].senderUsername
            }
            let sortedRecipient = globalEmployees.find(findSortedRecipientSender);

            recipientTransactionInfo = {
                goal: sortedRecipientTransactions[i][j].goal,
                points: sortedRecipientTransactions[i][j].points,
                action: sortedRecipientTransactions[i][j].action,
                senderUsername: sortedRecipientTransactions[i][j].senderUsername,
                // recipientFirstName: sortedRecipient.firstName,
                // recipientLastName: sortedRecipient.lastName
            }
            //break the transactions out by corporate goal
            if (j === 0) {
                const goalTitle = recipientTransactionInfo.goal;
                const recipientCategoryInfoHTML =
                    (`<section class="points-received">
                  <p class="ellipse ellipse-display ${goalTitle}-ellipse">${goalTitle}</p>
                </section>`);
                $("row.points-received-box").append(recipientCategoryInfoHTML);
            } else {
                console.log('not a goal title');
            }
            let recipientHTMLResults = formatRecipientInfo(recipientTransactionInfo);
        }
    };
};

function formatSenderInfo(sentTransactionInfo) {
    const sentInfoHTML = (
        `<section class ="points-given" role="region">                             
         <h2> ${sentTransactionInfo.points} points to ${sentTransactionInfo.senderFirstName} ${sentTransactionInfo.senderLastName} for:<br><i>${sentTransactionInfo.action}</i><h2> 
        </section>`
    );
    $("row.points-given-box").append(sentInfoHTML);
    return sentInfoHTML;
}

function formatRecipientInfo(recipientTransactionInfo) {
    const recipientInfoHTML = (
        `<section class ="points-received" role="region">                           
        <h2> ${recipientTransactionInfo.points} points from ${recipientTransactionInfo.recipientFirstName} ${recipientTransactionInfo.recipientLastName} for:<br><i>${recipientTransactionInfo.action}</i><h2>                                  
        </section>`
    );
    $("row.points-received-box").append(recipientInfoHTML);
    return recipientInfoHTML;
};

$("form[name=add-points-form]").submit(function (event) {
    event.preventDefault();
    $('.employee-boxes').empty();

    //grab the inputs and update the transactions
    const employeeAction = $('input[name=employee-action]');
    const action = employeeAction.val();
    const corpGoal = $('select[name=goal]');
    const goal = corpGoal.val();
    const pointsDropdown = $('select[name=points]');
    const points = parseInt(pointsDropdown.val());

    let newTransaction = {
        senderFirstName: loggedInUser.firstName,
        senderLastName: loggedInUser.lastName,
        senderUsername: loggedInUser.username,
        goal: goal,
        points: points,
        action: action,
        recipientUsername: $("#recipient").val()
    }
    console.log(newTransaction);

    addNewTransaction(newTransaction);

    document.getElementById("js-add-points-form").reset();
});

function updateSender(user) {
    console.log(`inside updateSender ${user.username}`);
    $.ajax({
        method: 'PUT',
        url: `/users/PutPointsSentBy/${user.username}`,
        dataType: 'json',
        data: JSON.stringify({
            pointsGiven: user.pointsGiven,
            pointsRemaining: user.pointsRemaining
        }),
        contentType: 'application/json',
        success: function () {
            console.log('sender updated');
        }
    });
}

function updateRecipient(user) {
    console.log(`inside updateRecipient ${user.username}`);
    $.ajax({
        method: 'PUT',
        url: `/users/PutPointsGivenToRecipient/${user.username}`,
        dataType: 'json',
        data: JSON.stringify({
            pointsReceived: user.pointsReceived
        }),
        contentType: 'application/json',
        success: function () {
            console.log('recipient updated');
        }
    });
}

function addNewTransaction(transactionData) {
    console.log('inside addNewTransaction');
    $.ajax({
        method: 'POST',
        url: '/transactions',
        dataType: 'json',
        data: JSON.stringify(transactionData),
        contentType: 'application/json',
        success: function (transData) {
            console.log('transaction added');
            for (let i = 0; i < globalEmployees.length; i++) {
                if (globalEmployees[i].username === transactionData.recipientUsername) {
                    let awardee = globalEmployees[i];
                    awardee.pointsReceived = (parseInt(awardee.pointsReceived) + transactionData.points);
                    updateRecipient(awardee);
                }
            }
            for (let i = 0; i < globalEmployees.length; i++) {
                if (globalEmployees[i].username === transactionData.senderUsername) {
                    let sender = globalEmployees[i];

                    sender.pointsGiven = (parseInt(sender.pointsGiven) + transactionData.points);

                    sender.pointsRemaining = (parseInt(sender.pointsRemaining) - transactionData.points);
                    console.log(sender);
                    updateSender(sender);
                }
            }
            getAllEmployees();
            renderEmployeeList();
        }
    });

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

function getAllTransactions() {
    console.log('inside getAllTransactions');
    $.ajax({
        method: 'GET',
        url: '/transactions',
        dataType: 'json',

        contentType: 'application/json',
        success: function (transData) {
            displayEmployeeTransactions(transData.transactions);
        }
    });
}
//DELETE
function deleteEmployee(username) {
    let selectedEmployee = globalEmployees.filter(globalEmployee =>
        username === globalEmployee.username);
    console.log('inside deleteEmployee');
    $.ajax({
        method: 'DELETE',
        url: '/users/' + selectedEmployee[0].id,
        success: function () {
            console.log('employee deleted');
            getAllEmployees();
            renderEmployeeList();
        }
    });
}
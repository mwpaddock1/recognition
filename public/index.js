let globalEmployees;
let globalTransactions;
let loggedInUser;
let selectedIndividual;

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
    //**************************************************************************** */
    //we put this newEmployee as an argumennt in the addNewEmployee function which also gives the new employee starting points -but it should really be the serialized employee with no password
    let newEmployee = (reformattedArray.reduce(reducingFunction));
    console.log(newEmployee);

    if (newEmployee.password !== newEmployee['retype-password']) {
        alert('Passwords must match!')
    } else {
        loggedInUser = newEmployee;
        addNewEmployee(newEmployee);
        globalEmployees = getAllEmployees();
        displayEmployees(globalEmployees);
        console.log(globalEmployees);
        $('.demo-credentials').addClass('hidden');

        $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
    }
    document.getElementById("js-sign-up-form").reset();
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
    // if (loggedInUser.emailAddress === 'hr@fizzbuzz.com') {
    //     $('.delete-employee-button').removeClass('hidden')
    // }

    $('.js-logged-in-employee').append(`You are logged in as ${loggedInUser.firstName} ${loggedInUser.lastName}`);
    document.getElementById("js-login-form").reset();
});
//****************************************
//this has to be the employee that doesn't have the password in its schema.... */
function addNewEmployee(employeeData) {
    // employeeData.pointsGiven = 0;
    // employeeData.pointsReceived = 0;
    // employeeData.pointsRemaining = 100;
    console.log('inside add');
    $.ajax({
        method: 'POST',
        url: '/users',
        dataType: 'json',
        data: JSON.stringify(employeeData),
        contentType: 'application/json',
        success: function (empData) {
            console.log('employee added');
        }
    });

    // return new Promise((resolve, reject) => {
    //     let MOCK_DATA = getMockData();
    //     //also include the new employee
    //     MOCK_DATA.employees.push(employeeData);
    //     setMockData(MOCK_DATA);
    //     resolve(employeeData);
    // })
}

function loginEmployee(loggedInEmployeeEmail, loggedInEmployeePassword) {
    // let token = "thisisastring";
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
      
    let emps = [];
    $.ajax({
        method: 'GET',
        url: '/users',
        dataType: 'json',
        contentType: 'application/json',
        success: function (empData) {
                        emps = empData.users;
                        // console.log('emps:')
                        // console.log(emps);      
        }        
    });
    
    return emps;
}

function displayEmployees() {
    for (let currentEmployee = 0; currentEmployee < globalEmployees.length; currentEmployee++);
    console.log(globalEmployees.length); {
        const empInfoHTML = (
            ` <div class = "current-employee" data-email="${globalEmployees[currentEmployee].emailAddress}">
                            <h2 class = "js-last-name employee-box"> ${globalEmployees[currentEmployee].lastName}</h2>
                            <h2 class = "js-first-name employee-box"> ${globalEmployees[currentEmployee].firstName}</h2>
                            <h2 class = "js-points-received employee-box"> ${globalEmployees[currentEmployee].pointsReceived}</h2>
                            <h2 class = "js-points-given employee-box"> ${globalEmployees[currentEmployee].pointsGiven}</h2>
                            <h2 class = "js-points-remaining employee-box"> ${globalEmployees[currentEmployee].pointsRemaining}</h2>                    
                      </div>
                    `
        );
        console.log('should now have employee info');
        $('row.employee-boxes').append(empInfoHTML);
    }

    $('.current-employee').click(function (event) {
        selectAndDisplayEmployee();
        displayEmployeeTransactions();
    });

    function selectAndDisplayEmployee() {
        //get the selected employee and display his / her points

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
            selectedIndividual = {
                firstName: selectedEmployee[0].firstName,
                lastName: selectedEmployee[0].lastName,
                emailAddress: selectedEmployee[0].emailAddress,
            }
            renderIndividualEmployeeRecognition();
            let recipientEmailInput = $("#recipient");
            recipientEmailInput.val(selectedIndividual.emailAddress);
            $('.employee-page-title').append(`Recognition for ${selectedIndividual.firstName} ${ selectedIndividual.lastName}`);
            return selectedIndividual
        }
    }

    //get and sort the transactions for the selected employee
    function displayEmployeeTransactions() {
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
                            action: sortedSentTransactions[i][j].action,
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
                            action: sortedRecipientTransactions[i][j].action,
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

    function formatSenderInfo(sentTransactionInfo) {
        const sentInfoHTML = (
            `<section class ="points-given" role="region">                                
                <h2> ${sentTransactionInfo.points} points to ${sentTransactionInfo.senderFirstName} ${sentTransactionInfo.senderLastName} for:  <i>${sentTransactionInfo.action}</i><h2> 
             </section>`
        );
        $("row.points-given-box").append(sentInfoHTML);
        return sentInfoHTML;
    }

    function formatRecipientInfo(recipientTransactionInfo) {
        const recipientInfoHTML = (
            `<section class ="points-received" role="region">                                                      
               <h2> ${recipientTransactionInfo.points} points from ${recipientTransactionInfo.recipientFirstName} ${recipientTransactionInfo.recipientLastName} for: <i>${recipientTransactionInfo.action}</i><h2>                                       
             </section>`
        );
        $("row.points-received-box").append(recipientInfoHTML);
        return recipientInfoHTML;
    }
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
    //************************************************************************************** */
    //do I still use the loggedInUser?
    let newTransaction = {
        senderFirstName: loggedInUser.firstName,
        senderLastName: loggedInUser.lastName,
        senderEmailAddress: loggedInUser.emailAddress,
        goal: goal,
        points: points,
        action: action,
        recipientEmailAddress: $("#recipient").val()
    }
    console.log(action);
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
    renderEmployeeList();
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
//this function has both MOCK_DATA and TRANX_DATA  *****************************************
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
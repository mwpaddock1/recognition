const MOCK_DATA = {
    employees: [{
            lastName: "Foo",
            firstName: "Joseph",
            emailAddress: "jfoo@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0,
            pointsRemaining: 100
        },
        {
            lastName: "Bar",
            firstName: "Mary",
            emailAddress: "mbar@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0,
            pointsRemaining: 100
        },
        {
            lastName: "Staff",
            firstName: "John",
            emailAddress: "jstaff@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0,
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
    setTimeout(function(){ callbackFn(MOCK_DATA)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayEmployees(data) {
    let currentEmployee = 0;  
    for (index in data.employees) {
       $('#employeeList').append(`${data.employees[currentEmployee].lastName}`);        
    currentEmployee++;
      ;
    }
}

// this function can stay the same even when we
// are connecting to real API
 function getAndDisplayEmployees() {
     getEmployees(displayEmployees);
 }

 $(function() {
    getAndDisplayEmployees();
 })

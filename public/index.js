const MOCK_DATA = {
    employees: [{
            lastName: "Foo",
            firstName: "Joseph",
            emailAddress: "jfoo@fizzbuzz.com",
            pointsGiven: 0,
            pointsReceived: 0,
            pointsRemaining: 100,
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
            pointsGiven: 0,
            pointsReceived: 0,
            pointsRemaining: 100,
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
    setTimeout(function(){callbackFn(MOCK_DATA)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayEmployees(data) {    
    for (let currentEmployee =0; currentEmployee < data.employees.length; currentEmployee++) {
       $('#js-last-name').append(`<h2>${data.employees[currentEmployee].lastName}</h2>`);        
       $('#js-first-name').append(`<h2>${data.employees[currentEmployee].firstName}</h2>`);        
       $('#js-points-received').append(`<h2>${data.employees[currentEmployee].pointsReceived}</h2>`); $('#js-points-given').append(`<h2>${data.employees[currentEmployee].pointsGiven}</h2>`);       $('#js-points-remaining').append(`<h2>${data.employees[currentEmployee].pointsRemaining}</h2>`);
     
    }
}

// this function can stay the same even when we
// are connecting to real API
 function getAndDisplayEmployees() {
     getEmployees(displayEmployees);
 }

 $(function() {
    getAndDisplayEmployees();
 });


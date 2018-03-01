const mockData = {
    users: [
        {
            firstName: 'Henry',
            lastName: 'Bowinkle'
        }, {
            firstName: 'Angela',
            lastName: 'Flag'
        }
    ]
};


//DO NOT DO IT THIS WAY
function myApplication() {

    // Add a user
    mockData.users.push({
        firstName: 'Tony',
        lastName: 'Perkins'
    });
    
    // Get list of users
    const users = mockData.users;

        //Do something with the users
}

//DO it this way
function addNewUser(user) {
    return new Promise((resolve, reject) => {
        mockData.users.push(user);
        resolve();
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        resolve(mockData.users);
    });
}

function myApplication() {

    // Add a user
    addNewUser({
        firstName: 'Tony',
        lastName: 'Perkins'
    })
    .then(getAllUsers)
    .then((users) => {
        //Do something with the users
    });
}
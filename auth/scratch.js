//first pass at getting the endpoints set up - have to figure out variable names and where we get the inputs

//GET the list of employees
app.get('/employee-list', jwtAuth, (req, res) => {
    employee
        .find()
        .sort({
            'created': 'desc'
        })

        .then(employeeList => {
            res.json({
                employeeList: employeeList.map(
                    (employeeList) => employeeList.serialize())
            });

        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            })
        });
});
//POST a new employee
app.post('/employee-list', jwtAuth, (req, res) => {
    // console.log(req.body)
    employee
        .create({
            employee: {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                emailAddress: req.user.emailAddress
            },

        })
        .then(employeeList => res.status(201).json(employeeList.serialize()))
});

//no updates to employees....just to the transactions...so this has to be reconfigured after creating a POST and GET for the transactions
//PUT ENDPOINT
// app.put('/employee-list/:id', jwtAuth, (req, res) => {
//     PostReview
//         .findById(req.params.id)
//         .then(employeeList => {
//             if (employeeList.employee_id !== req.user.userID) {
//                 res.status(403).json({
//                     message: `${employeeList.employee_id} does not match ${req.user.userID}`
//                 });
//                 return null;
//             }
//             const updated = {};
//             const updatedFields = ["postTitle", "gameTitle", "gamePlatform", "gameScore", "gameImage", "postReview"];

//             updatedFields.forEach(field => {
//                 if (field in req.body) {
//                     updated[field] = req.body[field];
//                 }
//             });
//             return PostReview.findByIdAndUpdate(req.params.id, {
//                 $set: updated
//             }, {
//                 new: true
//             });
//         })
//         .then(updatedReview => {
//             if (updatedReview != null)
//                 return res.status(200).json(updatedReview.serialize())
//         })
//         .catch(err => res.status(500).json(err))
// });


//have to figure out if we want a DELETE - would require admin login
//DELETE ENDPOINT an employee
// app.delete('/employee-list/:id', jwtAuth, (req, res) => {
//     employee
//         .findById(req.params.id)
//         .then(review => {
//             if (employeeList.employee_id !== req.user.userID) {
//                 console.log("Ids don't match");
//                 res.status(403).json({
//                     message: `${employeeList.employee_id} does not match ${req.user.userID}`
//                 });
//                 return null;
//             } else {
//                 return empl
//                     .findByIdAndRemove(req.params.id);
//             }
//         })
//         .then(deletedReview => {
//             if (deletedReview != null)
//                 return res.sendStatus(204);
//         });
// });

// GET the list of transactions
app.get('/transactions', jwtAuth, (req, res) => {
    transaction
        .find()
        
        .then(transactions => {
            res.json({
                transactions: transactions.map(
                    (transactions) => transactions.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            })
        });
});
//POST a new transaction
app.post('/transactions', jwtAuth, (req, res) => {
    // console.log(req.body)
    transaction 
        .create({               
                points: req.user.points,
                goal: req.user.goal,
                reason: req.user.reason,
                senderEmailAddress: req.user.senderEmailAddress,
                recipientEmailAddress: req.user.recipientEmailAddress
           })
        .then(transactions => res.status(201).json(transactions.serialize()))
});

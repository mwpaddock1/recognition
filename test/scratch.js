


// //Here's the test for POST requests to /transactions.
// it('should add a transaction on POST', function() {
//     const newItem = {reason: 'helping', goal: 'Sales', points: 10, senderEmailAddress: 'jschmoe@fizzbuzz.com', recipientEmailAddress: 'tperkins@fizzbuzz.com'};
//     return chai.request(app)
//       .post('/transactions')
//       .send(newItem)
//       .then(function(res) {
//         expect(res).to.have.status(201);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('object');
//         expect(res.body).to.include.keys('id','reason', 'goal', 'points', 'senderEmailAddress', 'recipientEmailAddress');
//         expect(res.body.id).to.not.equal(null);
//         // response should be deep equal to `newItem` from above if we assign
//         // `id` to it from `res.body.id`
//         expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
//       });
//   });


// //Now let's look at our tests for PUT and DELETE. These two tests look a little bit different than the ones for GET and POST, because both require putting an id for an existing shopping list item in the URL path. Once we learn about databases, the way we'll do this is by querying the database in our test to find an id of an existing item. With the volatile, in-memory storage we've used so far, there's not a convenient way of getting the id of an existing item. Therefore, to test PUT and DELETE, we'll first make a GET request to get the id of an existing shopping list item.


// //we don't update employees, just transactions
// it('should update items on PUT', function() {
//     //do we need an ID here or not until we pull (get) some data to update?
//     const updateData = {
     
//      //these don't update, so do we reiterate ,here?
//     // emailAddress: jschmoe@fizzbuzz.com,
//     // firstName: 'Joe',
//     // lastName: 'Schmoe',
//     pointsGiven: 10,
//     pointsReceived: 0,
//     pointsRemaining: 90
//     };
//     return chai.request(app)
//       // first have to get so we have an idea of object to update
//       .get('/employees')
//       .then(function(res) {
//         updateData.id = res.body[0].id;
//         return chai.request(app)
//           .put(`/employees/${updateData.id}`)
//           .send(updateData)
//       })
//       .then(function(res) {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('object');
//         expect(res.body).to.deep.equal(updateData);
//       });
//   });



//   //we don't delete any transactions, just HR can delete an employee...
//   it('should delete items on DELETE', function() {
//     return chai.request(app)
//       // first have to get so we have an `id` of item
//       // to delete
//       .get('/employees')
//       .then(function(res) {
//         return chai.request(app)
//           .delete(`employees/${res.body[0].id}`);
//       })
//       .then(function(res) {
//         expect(res).to.have.status(204);
//       });
//   });
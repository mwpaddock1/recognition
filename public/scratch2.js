
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
                    for (let i = 0; i < Object.keys(sortedSentTransactions).length; i++) {
                        let transKeysLength = Object.keys(sortedSentTransactions).length;
                        //sortedSentTransactions is an object with 4 keys(Cost, Sales, Ideas, Service) which have arrays as the values
                        for (let j = 0; j <transKeysLength; j++) {
                           debugger
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
                    for (let i = 0; i < sortedRecipientTransactions.length; i++) {
                        
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
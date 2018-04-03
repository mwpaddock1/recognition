getAllTranx()
                .then((transactionsGet) => {
                    globalTransactions = transactionsGet;
                    let highlightedEmployeeInfo = globalTransactions.filter(globalTransaction => (globalTransaction.senderEmailAddress === selectedIndividual.emailAddress) || (globalTransaction.recipientEmailAddress === selectedIndividual.emailAddress)
                        //highlightedEmployeeInfo is an array of objects
                    )
                    let sortedTransactions = highlightedEmployeeInfo.reduce(function (allTransactions, transaction) {
                        if (transaction.goal in allTransactions) {
                            allTransactions[transaction.goal].push(transaction);
                            return allTransactions;
                        } else {
                            allTransactions[transaction.goal] = [transaction];

                            return allTransactions;
                        }
                    }, {});
                    for (i in sortedTransactions) {
                        console.log(i, sortedTransactions[i])
                        //sortedTransactions is an object with 4 keys(Cost, Sales, Ideas, Service) which have arrays as the values
                        for (j = 0; j < sortedTransactions[i].length; j++) {

                            transactionInfo = {
                                goal: sortedTransactions[i][j].goal,
                                points: sortedTransactions[i][j].points,
                                reason: sortedTransactions[i][j].reason,
                                senderEmailAddress: sortedTransactions[i][j].senderEmailAddress,
                                senderFirstName: sortedTransactions[i][j].senderFirstName,
                                senderLastName: sortedTransactions[i][j].senderLastName,
                                recipientEmailAddress: sortedTransactions[i][j].recipientEmailAddress,
                                recipientFirstName: sortedTransactions[i][j].recipientFirstName,
                                recipientLastName: sortedTransactions[i][j].recipientLastName

                            }

                            let recipientHTMLResults = formatRecipientInfo(transactionInfo);
                            let senderHTMLResults = formatSenderInfo(transactionInfo);
                        }
                    };


                });

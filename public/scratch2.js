
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
            
            
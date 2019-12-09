'use strict';

class Profile {
	constructor({username, name: {firstName, lastName}, password}) {
      this.username = username;
      this.name = {firstName, lastName};
      this.password = password;
	};

	createUser(callback) {
        return ApiConnector.createUser({
            username: this.username,
            name: this.name,
            password: this.password,
        }, (err,data)=> {
            console.log(`User ${this.username} added`);
            callback(err, data);
        });
    };

    authorizationUser(callback) {
      return ApiConnector.performLogin({
      	 username: this.username,
         password: this.password,
        }, (err,data)=>{
            console.log(`User ${this.username} authorized`);
            callback(err, data);
        });
    };

    addMoney({currency, amount}, callback) {
        return ApiConnector.addMoney({currency, amount}, (err,data)=>{
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    };

    convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {
      return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) =>{
        console.log(`Amount ${targetAmount} converted from ${fromCurrency} to ${targetCurrency}`);
        callback(err, data);
      });
    };

    transferMoney({to, amount}, callback) {
      return ApiConnector.transferMoney({to, amount}, (err, data) =>{
      	console.log(`Amount ${amount} transferred to ${to}`);
        callback(err, data);
      });
    };

 };

function getStocks(callback) {
     return ApiConnector.getStocks((err,data)=>{
        if (err) {
          console.log('Failed to get stocks info');
        } else {
          console.log('Getting Stocks info');
          callback(err, data);
        }
     });
 };


function main() {
    const Ivan = new Profile({
        username: 'ivan',
        name: {
            firstName: 'Ivan',
            lastName: 'Chernyshev'
        },
        password: 'ivanspass',
    });

    const Alena = new Profile({
        username: 'alena',
        name: {
            firstName: 'Alena',
            lastName: 'Gorina'
        },
        password: 'alenaspass',

    });


    Ivan.createUser((err,data)=> {
        if (err) {
            console.log(`Error during added Ivan`);
        } else {
            console.log(`Ivan was added`);
            Ivan.authorizationUser((err,data)=> {
                if (err) {
                    console.log(`Error during autorization Ivan`);
                } else {
                    console.log(`Ivan autorizated`);
                    Ivan.addMoney({currency: 'RUB', amount: 500000}, (err,data)=>{
                        if (err) {
                            console.log(`Error during adding money`);
                        } else {
                            console.log(`Money is added to User`);
                            getStocks((err,data)=> {
                                if (err) {
                                    console.error('Error during getting stocks info');
                                } else {
                                    const money = data[99];
                                    Ivan.convertMoney({fromCurrency: 'RUB', targetCurrency: 'NETCOIN', targetAmount: 500000 * money.RUB_NETCOIN}, (err,data)=>{
                                      if (err) {
                                        console.log('Error during convert money');
                                      } else {
                                          console.log(`Money converted`);
                                          Alena.createUser((err,data)=> {
                                            if (err) {
                                              console.log(`Error during added Alena`)
                                            } else {
                                                console.log(`Alena was added`);
                                                Ivan.transferMoney({to: 'alena', targetCurrency: 'NETCOIN', amount: 500000 * money.RUB_NETCOIN}, (err,data)=>{
                                                  if (err) {
                                                    console.log('Error during transfer money')
                                                  } else {
                                                    console.log(`Money transfered to Alena`)
                                                  }
                                                });
                                              }
                                          });
                                        }
                                    });
                                }
                            });
                        };
                    });
                }
            });
        }
    });
}

main();

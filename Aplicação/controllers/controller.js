const Account = require('../models/account'); // Chama modelo mongoose Account, que comunica com banco de dados MongoDB

// Retorna o saldo disponivel na conta do funcionario responsavel pelo cartao
exports.getValue = (req, res, next) => { 
    const cardId = req.params.id; // Guarda a String 'id' da requisicao HTTP como o identificador para achar o Account
    Account.findById(cardId)
      .then(account => {
        if (!account) {
          const error = new Error('Usuário não encontrado');
          error.statusCode = 404;
          throw error;
        }
        let currentDateString  = new Date().toISOString();
        if(account.lastRechargeDate.substr(0,10) < currentDateString.substr(0,10)){ // Compara as datas em formato String retirando o horario para que somente os dias sejam relevantes
          account.lastRechargeDate = currentDateString;
          account.value = account.initialValue;
        }
        return account.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Conta obtida com sucesso!', value: result.value });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};
  
//Atualiza a o saldo do usuario com o valor da compra subtraido 
exports.updateValue = (req, res, next) => { 
    const cardId = req.params.id;
    const purchaseValue = req.params.purchase;
    Account.findById(cardId)
      .then(account => {
        if (!account) {
          const error = new Error('Usuário não encontrado');
          error.statusCode = 404;
          throw error;
        }
        if (account.value < purchaseValue) { // Retorna um erro se nao houver saldo suficiente para a compra
          const error = new Error('Saldo Insuficiente');
          error.statusCode = 400;
          throw error;
        }
        account.value = account.value - purchaseValue;
        return account.save(); // Salva o Account com o saldo atualizado
      })
      .then(result => {
        res.status(200).json({ message: 'Valor atualizado com sucesso', value: result.value });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};
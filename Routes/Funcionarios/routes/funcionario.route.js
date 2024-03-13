const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionario.controller');

//Rota de cadastro de funcionário
router.post(
    '/cadastro',
    funcionarioController.verificarFuncionario,
    funcionarioController.registrarFuncionario
);

//Rota de Login de funcionário
router.post(
    '/login',
    funcionarioController.verificarFuncionario,
    funcionarioController.getDadosFuncionario,
    funcionarioController.login
);

//Rota de atualização de senha do funcionário
router.put(
    '/esqueciSenha',
    funcionarioController.verificarFuncionario,
    funcionarioController.atualizarSenhaFuncionario
);

module.exports = router;
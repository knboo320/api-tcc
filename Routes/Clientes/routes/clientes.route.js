const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clientes.controller');
const login = require('../middleware/login.middleware');

//Rota de cadastro de cliente
router.post(
    '/cadastro',
    login.required,
    clienteController.verificarClienteCadastro,
    clienteController.registrarCliente,
);

//Rota pegar dados do cliente
router.get(
    '/cpf/:cpf',
    login.required,
    clienteController.verificarClienteCpf,
    clienteController.getDadosCliente,
    clienteController.returnDadosCliente,
);

router.get(
    '/id/:id_cliente',
    login.required,
    clienteController.verificarClienteId,
    clienteController.getDadosCliente,
    clienteController.returnDadosCliente,
);

module.exports = router;
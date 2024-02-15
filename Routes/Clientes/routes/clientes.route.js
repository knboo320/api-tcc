const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clientes.controller');

//Rota de cadastro de cliente
router.post(
    '/cadastro',
    clienteController.verificarCliente,
    clienteController.registrarCliente,
);

//Rota pegar dados do cliente
router.get(
    '/user',
    clienteController.verificarCliente,
    clienteController.getDadosCliente,
    clienteController.returnDadosCliente,
);

module.exports = router;
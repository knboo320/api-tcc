const mysql = require('../../../mysql');
const utils = require('../../../utils');

exports.verificarCliente = async (req, res, next) => {
    try {
        const verificarCliente = await mysql.execute(
            `SELECT id_cliente FROM clientes WHERE cpf = ?;`,
            [req.body.cpf][0]
        );
        if (verificarCliente.length >= 1) {
            res.locals.id_cliente = verificarCliente[0].id_cliente;
        }
        next();
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.getDadosCliente = async (req, res, next) => {
    try {
        if (res.locals.id_cliente) {
            const dadosClientes = await mysql.execute(
                `SELECT id_cliente, 
                    nome,
                    endereco,
                    bairro,
                    complemento,
                    cpf
               FROM clientes 
              WHERE id_cliente = ?`,
                [res.locals.id_cliente]
            );
            res.locals.cliente = dadosClientes[0];
            next();
        } else {
            return res.status(404).send({ mensagem: 'Cliente não encontrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.returnDadosCliente = async (req, res, next) => {
    try {
        return res.status(200).send({
            dados_cliente: res.locals.cliente,
            mensagem: 'Dados retornados com Sucesso!'
        });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarCliente = async (req, res) => {
    try {
        if (!res.locals.id_cliente) {
            await mysql.execute(`
                INSERT INTO clientes (
                            nome,
                            endereco,
                            bairro,
                            complemento,
                            cpf
                        ) VALUES (?,?,?,?,?);`,
                [req.body.nome, req.body.endereco, req.body.bairro, req.body.complemento, req.body.cpf]
            );
            return res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
        } else {
            return res.status(409).send({ message: 'Cliente já cadastrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}
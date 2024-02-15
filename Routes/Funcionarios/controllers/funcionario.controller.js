const mysql = require('../../../mysql');
const bcrypt = require('bcrypt');
const utils = require('../../../utils');
const api_config = require('../../../utils').getApiConfig();
const jwt = require('jsonwebtoken');

exports.verificarFuncionario = async (req, res, next) => {
    try {
        console.log(req);
        const verificarFuncionario = await mysql.execute(
            `SELECT id_funcionario FROM funcionarios WHERE rg = ?;`,
            [req.body.rg][0]
        );
        if (verificarFuncionario.length >= 1) {
            res.locals.id_funcionario = verificarFuncionario[0].id_funcionario;
        }
        next();
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.returnVerificarFuncionario = async (req, res) => {
    try {
        if (!res.locals.id_funcionario) {
            return res.status(200).send({ message: 'RG não cadastrado!' });
        } else {
            return res.status(409).send({ message: 'RG já cadastrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarFuncionario = async (req, res) => {
    try {
        const imagemPaht = req.file ? utils.formatarUrl(req.file.path) : null;
        if (!res.locals.id_funcionario) {
            const hash = await bcrypt.hash(req.body.senha, 10);
            await mysql.execute(`
                INSERT INTO funcionarios (
                            nome,
                            email,
                            rg,
                            senha,
                            foto,
                            editar_senha
                        ) VALUES (?,?,?,?,?,?);`,
                [req.body.nome, req.body.email, req.body.rg, hash, imagemPaht, false]
            );
            return res.status(201).send({ message: 'Funcionário Cadastrado com Sucesso!' });
        } else {
            return res.status(409).send({ message: 'Funcionário já cadastrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.getDadosFuncionario = async (req, res, next) => {
    try {
        if (res.locals.id_funcionario) {
            const dadosFuncionarios = await mysql.execute(
                `SELECT id_funcionario, 
                    nome,
                    email,
                    rg,
                    senha,
                    foto,
                    editar_senha,
                    dt_criacao
               FROM funcionarios 
              WHERE id_funcionario = ?`,
                [res.locals.id_funcionario]
            );
            res.locals.funcionario = dadosFuncionarios[0];
            res.locals.funcionario.imagem_url = utils.formatarUrl(res.locals.funcionario.imagem_url);
            next();
        } else {
            return res.status(404).send({ mensagem: 'Funcionário não encontrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.login = async (req, res) => {
    if (res.locals.funcionario.length < 1) {
        return res.status(401).send({ message: 'Funcionário não cadastrado' });
    }
    try {
        const match = await bcrypt.compare(req.body.senha, res.locals.funcionario.senha)
        if (match) {
            const token = jwt.sign({
                email: res.locals.funcionario.email,
                id_funcionario: res.locals.funcionario.id_funcionario,
                nome: res.locals.funcionario.nome,
                rg: res.locals.funcionario.rg,
            }, api_config.jwt_key);
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                token: token,
                email: res.locals.funcionario.email,
                id_funcionario: res.locals.funcionario.id_funcionario,
                nome: res.locals.funcionario.nome,
                rg: res.locals.funcionario.rg,
            });
        } else {
            return res.status(401).send({ message: 'Falha na autenticação' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.atualizarSenhaFuncionario = async (req, res, next) => {
    try {
        if (res.locals.id_funcionario) {
            const hash = await bcrypt.hash(req.body.senha, 10);
            const resultado = await mysql.execute(`
                UPDATE funcionarios 
                SET senha        = ?,
                    editar_senha = ?
                WHERE rg    = ?;
            `, [hash, true, req.body.rg]);
            return res.status(200).send({
                message: 'Atualizado com sucesso',
                resultado: resultado
            });
        } else {
            return res.status(409).send({ message: 'Funcionário não cadastrado!' });
        }

        
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

//Rotas não utilizadas até o momento
exports.returnDadosFuncionario = async (req, res, next) => {
    try {
        return res.status(200).send({
            dados_funcionario: res.locals.funcionario,
            mensagem: 'Dados retornados com Sucesso!'
        });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}
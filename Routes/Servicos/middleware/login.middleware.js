const jwt = require('jsonwebtoken');
const api_config = require('../../../utils').getApiConfig();

exports.optional = (req, res, next) => {
    res.locals.id_funcionario = 0;
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, api_config.jwt_key);
        req.userData = decoded;
        res.locals.id_funcionario = req.userData.id_funcionario;
        next();
    } catch (error) { next(); }
};

exports.required = async (req, res, next) => {
    res.locals.id_funcionario = 0;
    
    try {
        const token = await req.headers.authorization.split(" ")[1];
        const decoded = await jwt.verify(token, api_config.jwt_key);
        req.userData = decoded;
        res.locals.id_funcionario = req.userData.id_funcionario;
        next();
    } catch (error) {
        return res.status(401).send({
            message: 'Funcionário não autenticado.'
        });
    }
};
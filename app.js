const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');

// Routes-controllers
const funcionariosRoutes = require('./Routes/Funcionarios/routes/funcionario.route');
const clientesRoutes = require('./Routes/Clientes/routes/clientes.route');
const servicosRoutes = require('./Routes/Servicos/routes/servicos.route');
const emailRoutes = require('./Routes/Email/routes/email.route');

app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Rotas
app.use('/assets', express.static('./assets'));
app.use('/funcionarios', funcionariosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/servicos', servicosRoutes);
app.use('/email', emailRoutes);

//Erros
app.use((req, res, next) => {
    const error = new Error('Not found...');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
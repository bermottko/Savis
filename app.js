// Módulos principais
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');


// Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
//const usuarioRoutes = require('./routes/usuarioRoutes');
//const motoristaRoutes = require('./routes/motoristaRoutes');

// Inicializa app
const app = express();
const PORT = process.env.PORT || 3001;

// Configura EJS e layouts
app.set('view engine', 'ejs');
app.set('layout', './layouts/layoutInicial');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Arquivos estáticos (imagens, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));

// Rotas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
//app.use('/usuario', usuarioRoutes);
//app.use('/motorista', motoristaRoutes);


// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

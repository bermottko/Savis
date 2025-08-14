// Módulos principais
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// Inicializa app
const app = express();
const PORT = process.env.PORT || 3001;

// Sessão
const mysqlOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Be#99493544',
  database: 'SAVISdb',
};

const sessionStore = new MySQLStore(mysqlOptions);

app.use(session({
  key: 'cookie',      
  secret: 'seu_segredo',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,  // 2 horas
  },
}));

// Rotas
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const motoristaRoutes = require('./routes/motoristaRoutes');

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
app.use('/usuario', usuarioRoutes);
app.use('/motorista', motoristaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

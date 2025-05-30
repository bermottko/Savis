(async () => {
    const db = require('./db');
    const Usuarios = require('./Usuarios');
    const Endereco = require('./Endereco');
    
    Usuarios.belongsTo(Endereco, { foreignKey: 'enderecoID' });
    Endereco.hasMany(Usuarios, { foreignKey: 'enderecoID' });

    await db.sequelize.sync();
})();
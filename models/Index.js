(async () => {
    const db = require('./db');
    const Usuarios = require('./Usuarios');
    const Endereco = require('./Endereco');
    const Genero = require('./Genero');
    
      // Um usuário PERTENCE a um endereço através da chave estrangeira enderecoID
    // Ou seja: na tabela usuarios, existe o campo enderecoID que aponta para endereco.cod
    Usuarios.belongsTo(Endereco, { foreignKey: 'enderecoID' });

    // Um endereço PODE TER MUITOS usuários associados
    // Ou seja: o mesmo endereço pode ser usado por várias pessoas
    Endereco.hasMany(Usuarios, { foreignKey: 'enderecoID' });

    // Um usuário PERTENCE a um gênero através da chave estrangeira generoID
    // Ou seja: na tabela usuarios, existe o campo generoID que aponta para genero.cod
    Usuarios.belongsTo(Genero, { foreignKey: 'generoID' });

    // Um gênero PODE TER MUITOS usuários associados
    // Exemplo: "Masculino" pode ser o gênero de vários usuários
    Genero.hasMany(Usuarios, { foreignKey: 'generoID' });

    await db.sequelize.sync();
})();
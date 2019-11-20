module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    // Configura o sequelize para adicionar sempre colunas
    // created_at e updated_at no BD
    timestamps: true,

    // Configura o sequelize para criar tabelas no modelo Underscore e não no camelcase
    underscored: true,

    // Configura o sequelize para criar as colunas no modelo Underscore e não no camelcase
    underscoredAll: true,
  },
};

require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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

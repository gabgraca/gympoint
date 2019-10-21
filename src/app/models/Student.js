import Sequelize, { Model } from 'sequelize';

// Model da tabela users

class Student extends Model {
  /*
  no Sequelize todo model deve ter o método init recebendo obj sequelize
  chamar o método super.init passando a estrutura do model como primeiro
  objeto e o sequelize como segundo objeto
  */
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.INTEGER,
        altura: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Student;

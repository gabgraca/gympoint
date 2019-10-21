import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// Model da tabela users

class User extends Model {
  /*
  no Sequelize todo model deve ter o método init recebendo obj sequelize
  chamar o método super.init passando a estrutura do model como primeiro
  objeto e o sequelize como segundo objeto
  */
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;

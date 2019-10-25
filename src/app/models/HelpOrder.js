import Sequelize, { Model } from 'sequelize';

class HelpOrder extends Model {
  /*
  no Sequelize todo model deve ter o método init recebendo obj sequelize
  chamar o método super.init passando a estrutura do model como primeiro
  objeto e o sequelize como segundo objeto
  */
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
  }
}

export default HelpOrder;

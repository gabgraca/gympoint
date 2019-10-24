import Sequelize, { Model } from 'sequelize';
import { addMonths } from 'date-fns';

// Model da tabela users

class Enrollment extends Model {
  /*
  no Sequelize todo model deve ter o método init recebendo obj sequelize
  chamar o método super.init passando a estrutura do model como primeiro
  objeto e o sequelize como segundo objeto
  */
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
        canceled_at: Sequelize.DATE,
        plan_duration: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async enrollment => {
      // Chech if the virtual field plan_duration is not empty
      // when we updates the row, this field comes empty
      if (enrollment.plan_duration) {
        enrollment.end_date = addMonths(
          enrollment.start_date,
          enrollment.plan_duration
        );
      }
    });

    return this;
  }
}

export default Enrollment;

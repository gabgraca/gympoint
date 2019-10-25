import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../models/Checkin';
import Enrollment from '../models/Enrollment';

class CheckinController {
  async store(req, res) {
    /**
     * Check if the student exists
     */
    /**
     * Check if the student exists
     */
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    /**
     * Check if the student is enrolled
     */
    const isEnrolled = await Enrollment.findOne({
      where: {
        student_id,
        canceled_at: null,
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() },
      },
    });

    if (!isEnrolled) {
      return res.status(401).json({ error: 'Student is not enrolled.' });
    }

    /**
     * Check the amount of checkins
     * in the last 7 days
     */
    // const data = new Date();
    // const dataAnterior = subDays(data, 7);
    const checkinAmount = await Checkin.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });

    if (checkinAmount === 5) {
      return res.status(401).json({ error: 'Checkin maximum amount reached.' });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    /**
     * Check if the student exists
     */
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.findAll({ where: { student_id } });

    return res.json(checkins);
  }
}

export default new CheckinController();

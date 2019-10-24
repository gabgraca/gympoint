import * as Yup from 'yup';
import { Op } from 'sequelize';
import { addMonths, parseISO } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async store(req, res) {
    // Declara o schema do body da requisição
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    // Check the body schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    const { plan_id } = req.params;

    /**
     * Check if the gym plan exists
     */
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    /**
     * Check if the student exists
     */
    const { student_id, start_date } = req.body;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    /**
     * Check if the student is already enrolled in another plan
     * in a valid date
     */
    const checkIsEnrolled = await Enrollment.findOne({
      where: {
        student_id,
        end_date: {
          [Op.lt]: new Date(),
        },
      },
    });
    if (checkIsEnrolled) {
      return res.status(401).json({ error: 'Student is already enrolled' });
    }

    /**
     * Creates a Enrollment
     */
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      plan_duration: plan.duration, // the end date calculation is done in model hook
      price: plan.price * plan.duration,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    /**
     * Enrollment updates will generate a history
     * the actual enrollment will be cancelled and
     * a new one will be created
     */
    // Declara o schema do body da requisição
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.date().required(),
      start_date: Yup.date().required(),
    });

    // Check the body schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    /**
     * Check if the Enrollment exists
     */
    const { enrollment_id } = req.params;

    const enrollment = await Enrollment.findByPk(enrollment_id);

    if (!enrollment) {
      return res.status(401).json({ error: 'Enrollment not found' });
    }

    /**
     * Check if the gym plan exists
     */
    const { plan_id } = req.body;
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    /**
     * Check if the student exists
     */
    const { student_id, start_date } = req.body;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    // Cancel the actual enrollment
    enrollment.canceled_at = new Date();
    await enrollment.save();

    // Creates a new enrollment
    const newEnrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      plan_duration: plan.duration, // the end date calculation is done in model hook
      price: plan.price * plan.duration,
    });

    return res.json(newEnrollment);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll();
    return res.json(enrollments);
  }

  async delete(req, res) {
    /**
     * Check if the Enrollment exists
     */
    const { enrollment_id } = req.params;

    const enrollment = await Enrollment.findByPk(enrollment_id);

    if (!enrollment) {
      return res.status(401).json({ error: 'Enrollment not found' });
    }

    enrollment.canceled_at = new Date();

    await enrollment.save();
    return res.json(enrollment);
  }
}
export default new EnrollmentController();

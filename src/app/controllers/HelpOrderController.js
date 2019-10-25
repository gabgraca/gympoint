import Student from '../models/Student';
import Help_Order from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    /**
     * Check if the student exists
     */
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const { question } = req.body;

    const help_order = await Help_Order.create({
      student_id,
      question,
    });

    return res.json(help_order);
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

    const helpOrders = await Help_Order.findAll({
      where: {
        student_id,
      },
      include: [
        {
          model: Student,
          attributes: ['nome', 'email'],
        },
      ],
    });
    return res.json(helpOrders);
  }
}
export default new HelpOrderController();

import Student from '../models/Student';

class StudentSessionController {
  /**
   * Retorna um único aluno
   */
  async show(req, res) {
    const { email } = req.params;

    const student = await Student.findOne({ where: { email } });

    return res.json(student);
  }
}

export default new StudentSessionController();

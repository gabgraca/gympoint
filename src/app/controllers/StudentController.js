import * as Yup from 'yup'; // Lib para validar o schema das chamadas JSON
import Student from '../models/Student';

/*
Possíveis métodos para um controller
index(){}  //Listagem de alunos
show(){}   //Exibe um único aluno
store(){}  //Cadastrar aluno
update(){} //Alterar aluno
delete(){} //Remover aluno
*/

class StudentController {
  /**
   * Listagem de alunos
   */
  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }

  /**
   * Retorna um único aluno
   */
  async show(req, res) {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    return res.json(student);
  }

  /**
   * Deleta um aluno
   */
  async delete(req, res) {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    await student.destroy();

    return res.json(student);
  }

  /*
  Método: Criar aluno
   */
  async store(req, res) {
    // Valida o schema da requisição
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    // Verifica se já não existe aluno com o e-mail cadastrado
    const { email } = req.body;
    const student = await Student.findOne({ where: { email } });

    if (student) {
      return res.status(401).json({ error: 'Student email already exists.' });
    }

    // Cadastra o aluno
    const { id, nome } = await Student.create(req.body);

    if (id) {
      return res.json({
        id,
        nome,
        email,
      });
    }
    return res.status(400).json({ message: 'Create User Error' });
  }

  /*
  Método: Atualizar alunos
   */
  async update(req, res) {
    // Valida o schema da requisição
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    // Leitura do aluno que será alterado
    const student = await Student.findByPk(req.body.id);

    const { email } = req.body;
    // Verifica se houve alteração de e-mail
    if (student.email !== email) {
      const studentExists = await Student.findOne({ where: { email } });
      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists' });
      }
    }

    const updatedStudent = await student.update(req.body);
    return res.json(updatedStudent);
  }
}

export default new StudentController();

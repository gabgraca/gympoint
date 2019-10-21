// Classe controller de sessões
// O método store() será é responsável por criar uma sessão e retornar um
// token para a aplicação front end
import jwt from 'jsonwebtoken'; // Lib JWT para geração de token
import * as Yup from 'yup'; // Lib para validar o schema das chamadas JSON
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // Declara o schema do body da requisição
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    // Verifica se o schema está ok
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }
    // Separa o email e o password no body
    const { email, password } = req.body;

    // Encontra o usuário no BD através do e-mail recebido no body
    const user = await User.findOne({ where: { email } });

    // Verifica se o usuário foi encontrado
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // Verifica se o password informado está correto
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // Cria o token para retornar no JSON
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

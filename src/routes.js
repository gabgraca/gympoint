// Rotas da aplicação

import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/users', (req, res) => {
  return res.json({ message: 'hello world' });
});

// Rota para criação de sessões (Login do usuário)
routes.post('/sessions', SessionController.store);

// Middleware para validar o token de todas as requisições abaixo
routes.use(authMiddleware);

// Qualquer requisição abaixo terá o token validado pelo middleware
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

export default routes;

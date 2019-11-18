// Rotas da aplicação

import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderAnswerController from './app/controllers/HelpOrderAnswerController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/users', (req, res) => {
  return res.json({ message: 'hello world' });
});

// Rota para criação de sessões (Login do usuário)
routes.post('/sessions', SessionController.store);

// Routes related to Checkins
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

// Routes related to help orders
routes.post('/students/:student_id/help-orders', HelpOrderController.store);
routes.get('/students/:student_id/help-orders', HelpOrderController.index);
routes.post(
  '/help-orders/:help_order_id/answer',
  HelpOrderAnswerController.store
);

// Middleware para validar o token de todas as requisições abaixo
routes.use(authMiddleware);

/**
 * Qualquer requisição abaixo terá o token validado pelo middleware
 */

// Routes related to Gym Students
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.get('/students', StudentController.index);
routes.get('/students/:studentId', StudentController.show);
routes.delete('/students/:studentId', StudentController.delete);

// Routes related to Gym Plans
routes.post('/plans', PlanController.store);
routes.put('/plans', PlanController.update);
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.delete('/plans/:id', PlanController.delete);

// Routes related to Gym Enrollments
routes.post('/enrollments/:plan_id', EnrollmentController.store);
routes.put('/enrollments/:enrollment_id', EnrollmentController.update);
routes.get('/enrollments', EnrollmentController.index);
routes.delete('/enrollments/:enrollment_id', EnrollmentController.delete);

export default routes;

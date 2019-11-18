import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async show(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id, {
      attributes: ['title', 'duration', 'price'],
    });
    return res.json(plan);
  }

  async store(req, res) {
    /**
     * Valida o eschema da requisição
     */
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    /**
     * Verifica se já não existe plano com o mesmo
     * titulo
     */

    const alreadyExists = await Plan.findOne({
      where: { title: req.body.title, canceled_at: null },
    });
    if (alreadyExists) {
      return res.status(401).json({ error: 'Plan title already exists' });
    }

    const { id, title } = await Plan.create(req.body);

    return res.json({
      id,
      title,
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async update(req, res) {
    /**
     * Valida o eschema da requisição
     */
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    /**
     * Faz a leitura do plano através do id
     */
    const plan = await Plan.findByPk(req.body.id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    const updatedPlan = await plan.update(req.body);

    return res.json(updatedPlan);
  }

  async delete(req, res) {
    /**
     * Faz a leitura do plano pelo ID
     */
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    // Estou realizando a remoção total do registro
    // verificar se existe a possibilidade de criar um campo
    // canceled_at e atualizar o registro em vez
    // de deletar
    plan.canceled_at = new Date();
    await plan.save();

    return res.json(plan);
  }
}

export default new PlanController();

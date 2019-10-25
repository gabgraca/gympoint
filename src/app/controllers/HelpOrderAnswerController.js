import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import HelpOrderAnswerMail from '../Jobs/HelpOrderAnswerMail';

class HelpOrderAnswerController {
  async store(req, res) {
    /**
     * Check if the Help_Order existis
     */

    const helpOrder = await HelpOrder.findByPk(req.params.help_order_id, {
      include: [
        {
          model: Student,
          attributes: ['nome', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(401).json({ error: 'Help Order does not exists' });
    }

    /**
     * Update the help order with the answer
     */
    helpOrder.answer = req.body.answer;
    helpOrder.answer_at = new Date();
    await helpOrder.save();

    /**
     * Sends an email to the student
     */
    await Queue.add(HelpOrderAnswerMail.key, { helpOrder });

    return res.json(helpOrder);
  }
}
export default new HelpOrderAnswerController();

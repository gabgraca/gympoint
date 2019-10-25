import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;
    await Mail.sendMail({
      to: `${helpOrder.Student.nome} <${helpOrder.Student.email}>`,
      subject: 'Respota do pedido de auxílio ',
      template: 'helpOrderAnswer',
      context: {
        student: helpOrder.Student.nome,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: format(
          parseISO(helpOrder.answer_at),
          "'dia' dd 'de' MMMM', às' H:mm'h'", // dia 22 de Junho, às 08:40h
          { locale: pt }
        ),
      },
    });
  }
}
export default new HelpOrderAnswerMail();

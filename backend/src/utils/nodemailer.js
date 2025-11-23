const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreo = async (destinatario, asunto, contenido) => {
  try {
    const msg = {
      to: destinatario,
      from: 'sender@example.com', // Email de prueba de SendGrid (funciona sin verificación)
      subject: asunto,
      html: contenido,
    };

    const result = await sgMail.send(msg);
    console.log('Correo enviado exitosamente');
    return result;
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
};

module.exports = { enviarCorreo };

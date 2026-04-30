const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreo = async (destinatario, asunto, contenidoHtml, imagenBase64 = null) => {
  try {
    let html;

    if (imagenBase64) {
      html = `
        <div style="font-family:Arial,sans-serif;padding:10px;">
          <img src="${imagenBase64}" style="max-width:100%;height:auto;display:block;border:1px solid #ddd;" alt="${asunto}">
        </div>`;
    } else {
      html = contenidoHtml;
    }

    const msg = {
      to: destinatario,
      from: process.env.SENDGRID_FROM_EMAIL || 'sender@example.com',
      subject: asunto,
      html,
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

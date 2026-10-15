const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreo = async (destinatario, asunto, contenidoHtml, imagenBase64 = null) => {
  try {
    let html;
    const attachments = [];

    if (imagenBase64) {
      // Extraer base64 puro
      const base64Data = imagenBase64.replace(/^data:image\/[^;]+;base64,/, '');
      
      html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="margin:0;padding:20px 0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #dcdfe6;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <tr>
              <td align="center" style="padding:0;margin:0;line-height:0;">
                <img src="cid:afiche_institucional" style="display:block;width:100%;max-width:680px;height:auto;border:0;outline:none;" alt="${asunto}">
              </td>
            </tr>
          </table>
        </body>
        </html>`;

      attachments.push({
        content: base64Data,
        filename: 'afiche_institucional.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'afiche_institucional',
      });
    } else {
      html = contenidoHtml;
    }

    const msg = {
      to: destinatario,
      from: process.env.SENDGRID_FROM_EMAIL || 'sender@example.com',
      subject: asunto,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
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

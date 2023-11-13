const nodemailer = require ("nodemailer")
const {mail} = require ("../config/config.js")

class MailSender{
    
    constructor(){ 
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
               user: mail.GMAIL_ADDRESS,
               pass: mail.GMAIL_PWD
            }
        })
    }

    async send(to,resetLink) {
        const subject = "Recuperación de Contraseña";
        const body = `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${resetLink}">Restablecer Contraseña</a></p>`;
    
        const response = await this.transporter.sendMail({
          from: "no-reply@coder.com",
          subject: subject,
          to: mail.GMAIL_ADDRESS,
          html: body,
        });
    
        console.log(response);
    }
}

module.exports = new MailSender ()
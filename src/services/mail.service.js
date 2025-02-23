import nodeMailer from 'nodemailer';
import {CONFIG} from '../config/config.js';

class MailService{
    constructor(){
        console.log(CONFIG.MAIL);
    
        this.transporter = nodeMailer.createTransport({
            host: CONFIG.MAIL.HOST,
            port: CONFIG.MAIL.PORT,
            secure: false,
            auth: {
                user: CONFIG.MAIL.USER,
                pass: CONFIG.MAIL.PASSWORD,
            },
        });
    
    }

    
    async getMessageTemplate({ type, email, token}){
        let body = `<h1> Bienvenido ${email} a CoderSteam </h1><br>`;

        switch(type){
            case 'welcome':
                body += `<p>Gracias por registrarte en CoderSteam</p>`;
                break;
            case 'activation':
                body += `<p>Para activar tu cuenta haz click en el siguiente enlace</p>`;
                body += `<a href="${CONFIG.CLIENT_ORIGIN}/activate/${email}">Activar cuenta</a>`;
                break; 
            case 'resetPassword':
                body+= `<p>Para restablecer tu contraseña haz click en el siguiente enlace</p>`;	
                body+= `<a href="${CONFIG.CLIENT_ORIGIN}/reset-password/${token}">Restablecer contraseña</a>`;
                body+= `<p>Si no solicitaste restablecer tu contraseña, ignora este mensaje</p>`;
                body+= `<p>El enlace expirará en 1 hora</p>`;
                break;
    }
    body += `<a href="${CONFIG.CLIENT_ORIGIN}/activate/${email}">Activar cuenta</a>`;
    return body;
    }

    async sendMail ({ to, subject, type, token}){
        try{
            const html = await this.getMessageTemplate({type, email: to, token});
            const info = await this.transporter.sendMail({
                from: CONFIG.MAIL.USER,
                to,
                subject,
                html,
            });
        console.log(info);
        }catch(error){
            console.error(error);
        }
    }
}

export const mailService = new MailService();
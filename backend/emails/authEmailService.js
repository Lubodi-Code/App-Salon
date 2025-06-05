import {createTransport} from '../config/nodemailer.js';

export async function sendEmailVerification({email, name, token}) {

    //EMAIL_HOST = sandbox.smtp.mailtrap.io

    const transport = createTransport(
       process.env.EMAIL_HOST,
       process.env.EMAIL_PORT,
         process.env.EMAIL_USER,
            process.env.EMAIL_PASS
    );
    // Enviar el correo electrónico
    const info = await transport.sendMail({
        from: "AppSalon <cuentas@appsalon.com>",
        to: email,
        subject: "Verifica tu cuenta",
        text: "Para verificar tu cuenta haz click en el siguiente enlace",
        html: `
            <h1>Hola ${name}, Verifica tu cuenta</h1>
            <p>Para verificar tu cuenta haz click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Verificar cuenta</a>
            <p>Si no has creado esta cuenta, puedes ignorar este mensaje.</p>
        `,
    });
   
}


export async function sendEmailPasswordReset({email, name, token}) {

    //EMAIL_HOST = sandbox.smtp.mailtrap.io

    const transport = createTransport(
       process.env.EMAIL_HOST,
       process.env.EMAIL_PORT,
         process.env.EMAIL_USER,
            process.env.EMAIL_PASS
    );
    // Enviar el correo electrónico 
    const info = await transport.sendMail({
        from: "AppSalon <cuentas@appsalon.com>",
        to: email,
        subject: "Restablece tu contraseña",
        text: "Para restablecer tu contraseña haz click en el siguiente enlace",
        html: `
            <h1>Hola ${name}, Restablece tu contraseña</h1>
            <p>Para restablecer tu contraseña haz click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/reset-password/${token}">Restablecer contraseña</a>
            <p>Si no has creado esta cuenta, puedes ignorar este mensaje.</p>
        `,
    });
   
}
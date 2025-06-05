import { createTransport } from '../config/nodemailer.js';
import { format } from 'date-fns';
import index from '../utils/index.js';

export async function sendEmailNewAppointment(date, time) {
    const transport = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    );

    // Formatear la fecha
    const formattedDate = index.formatDate(date);

    // Enviar el correo electrónico
    const info = await transport.sendMail({
        from: "AppSalon <cuentas@appsalon.com>",
        to: 'admin@appsalon.com',
        subject: "AppSalon - Nueva Cita",
        text: "Tienes una nueva cita",
        html: `
            <h1>Hola, tienes una nueva cita</h1>
            <p>Fecha: ${formattedDate}</p>
            <p>Hora: ${time}</p>
        `,
    });
}

export async function sendEmailUpdateAppointment(date, time) {
    const transport = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    );

    // Formatear la fecha
    const formattedDate = index.formatDate(date);
    // Enviar el correo electrónico
    const info = await transport.sendMail({
        from: "AppSalon <cuentas@appsalon.com>",
        to: 'admin@appsalon.com',
        subject: "AppSalon - Actualización de cita",
        text: "Se ha actualizado la cita",
        html: `
            <h1>Hola, se ha actualizado la cita</h1>
            <p>Fecha: ${formattedDate}</p>
            <p>Hora: ${time}</p>
        `,
    });
}

export async function sendEmailCancelAppointment(date, time) {
    const transport = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    );

    // Formatear la fecha
    const formattedDate = index.formatDate(date, time);
    // Enviar el correo electrónico
    const info = await transport.sendMail({
        from: "AppSalon <cuentas@appsalon.com>",
        to: 'admin@appsalon.com',
        subject: "AppSalon - Cancelación de cita",
        text: "Se ha cancelado una cita",
        html: `
            <h1>Hola, se ha cancelado una cita</h1>
            <p>Fecha: ${formattedDate}</p>
            <p>Hora: ${time}</p>
        `,
    });
}
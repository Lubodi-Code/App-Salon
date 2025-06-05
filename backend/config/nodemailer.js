// Looking to send emails in production? Check out our Email API/SMTP product!

import nodemailer from "nodemailer";

export function createTransport(host, port, user, pass) {
    return nodemailer.createTransport({
        host,
        port,
        auth: {
          user,
          pass
        }
      });
}
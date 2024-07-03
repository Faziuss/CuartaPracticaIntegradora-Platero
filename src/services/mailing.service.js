import nodemailer from "nodemailer"
import { mailing } from "../config/config.js";

const transport = nodemailer.createTransport({
  service: mailing.service,
  port: mailing.port,
  auth: mailing.auth,
});

class MailingService {
  async sendPasswordResetMail(user, destinationMail, passwordResetToken) {
    await transport.sendMail({
      from: `Node service <${mailing.auth.user}>`,
      to: destinationMail,
      subject: `Password reset`,
      html: `
            <div>
                <h1>Click aquí para resetear tu contraseña</h1>
                <a href="http://localhost:8080/change-password/${passwordResetToken}">Reset password</a>
            </div>
        `,
    });
  }
  async sendDeletedAccountMail(name, destinationMail){

    await transport.sendMail({
        from: `Node service <${mailing.auth.user}>`,
        to: destinationMail,
        subject: `Account Deletion`,
        html: `
            <div>
                <h1>Hola ${name}</h1>
                <h1>Tu cuenta ha sido eliminada por inactividad</h1>
            </div>
        `
    })
}

async sendDeletedPremiumMail(destinationMail, productName){
  await transport.sendMail({
    from: `Node service <${mailing.auth.user}>`,
    to: destinationMail,
    subject: `Product Deletion`,
    html: `
        <div>
            <h1>Hola</h1>
            <h1>Tu producto ${productName} ha sido removido por un Admin</h1>
        </div>
    `
})
}
}

export default MailingService
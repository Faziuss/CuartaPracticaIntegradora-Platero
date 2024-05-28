const nodemailer = require("nodemailer");
const { mailing } = require("../config/config");

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
                <a href="http://localhost:8080/api/sessions/changePassword/${passwordResetToken}">Reset password</a>
            </div>
        `,
    });
  }
}

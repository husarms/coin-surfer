import * as SendGridMail from "@sendgrid/mail";
import Secrets from "../config/secrets";

SendGridMail.setApiKey(Secrets.SendGridConfiguration.apiKey);

export function sendEmail (subject: string, body: string) {
    const email = {
        from: Secrets.Email.fromAddress,
        to: Secrets.Email.toAddress,
        subject,
        text: body,
    };

    SendGridMail
        .send(email)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
};


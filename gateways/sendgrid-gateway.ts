import * as SendGridMail from "@sendgrid/mail";
import Configuration from "../config";

SendGridMail.setApiKey(Configuration.SendGrid.apiKey);

export function sendEmail (subject: string, body: string) {
    const email = {
        from: Configuration.SendGrid.fromAddress,
        to: Configuration.SendGrid.toAddress,
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


import sgMail from "@sendgrid/mail";

export enum TemplateId {
    OtpCode = "d-f684340cc32b4a21a84c70998558c5f2",
    ForgotPassword = "d-8ef33ec7459d49d9a4d106aced568011",
}

export const sendEmail = async (
    receiverEmail: string,
    templateId: TemplateId,
    dynamicTemplateData: any,
    attachments?: any,
): Promise<void> => {
    const senderEmail = "antrikshmahajan5@gmail.com";
        try {
        const msg = {
            to: receiverEmail,
            from: senderEmail,
            templateId,
            dynamicTemplateData,
            attachments
        };

        const ress = await sgMail.send(msg);
    } catch (err) {
        throw new Error(err);
    }
};

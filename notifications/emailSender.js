const {createTransport}= require('nodemailer');
const logger= require('../middlewares/logguer/logguer');
const dotenv = require ('dotenv');
const htmlNewUserTemplate = require('../notifications/htmltemplates/newUser')

dotenv.config({path: './../.env' });


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
});

const emailOptions = (emailSubject, htmlNewUserTemplate) => {
    return {
        from: process.env.EMAIL_ACCOUNT,
        to: ["deangelo.willms46@ethereal.email"],
        subject: emailSubject,
        html: htmlNewUserTemplate
    }
}


const sendGmail = async (subject, htmlNewUserTemplate) =>{
    try {
        const mailOptions = emailOptions(
            subject,
            htmlNewUserTemplate
        );
        
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent`)
    } catch (error) {
        logger.error(error);
    }
}

module.exports = { sendGmail}


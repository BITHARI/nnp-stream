
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import https from 'https';

interface EmailConfig {
    emailHost: string;
    emailHostUser: string;
    emailHostPassword: string;
    entity: string;
}

/**
 * Options for sending an email
 * @type {SendEmailOptions}
 * @property {string} subject - The subject of the email
 * @property {string} message - The body of the email
 * @property {string[]} destinateurs - An array of email addresses to send the email to
 * @property {string} [fileAttach] - The path to a file to attach to the email
 */
interface SendEmailOptions {
    subject: string;
    message: string;
    destinateurs: string[];
    fileAttach?: string;
}

class EmailService {
    private config: EmailConfig;
    private apiUrl = process.env.EMAIL_API_URL;
    private axiosInstance;

    constructor(config: EmailConfig) {
        this.config = config;

        // Create axios instance with SSL configuration
        this.axiosInstance = axios.create({
            timeout: 30000,
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            // Accept self-signed certificates
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            // Ignore SSL certificate errors
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            }
        });
        this.axiosInstance.interceptors.request.use((config) => {
            console.log(`🔄 Sending email via: ${this.apiUrl}`);
            return config;
        });

        // Add response interceptor for better error handling
        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log(`✅ Email sent successfully: ${response.status}`);
                return response;
            },
            (error) => {
                if (error.response) {
                    console.error(`❌ Email API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    console.error(`❌ No response from email API: ${error.message}`);
                } else {
                    console.error(`❌ Email request setup error: ${error.message}`);
                }
                return Promise.reject(error);
            }
        );
    }

    async sendEmail(options: SendEmailOptions): Promise<any> {
        try {
            const formData = new FormData();

            // Add configuration fields
            formData.append('email_host', this.config.emailHost);
            formData.append('email_host_user', this.config.emailHostUser);
            formData.append('email_host_password', this.config.emailHostPassword);
            formData.append('entity', this.config.entity);

            // Add email content
            formData.append('subject', options.subject);
            formData.append('message', options.message);
            formData.append('destinateurs', options.destinateurs.join(','));

            // Add file attachment if provided
            if (options.fileAttach && fs.existsSync(options.fileAttach)) {
                const fileName = path.basename(options.fileAttach);
                formData.append('file_attach', fs.createReadStream(options.fileAttach), {
                    filename: fileName
                });
            }

            console.log(`📧 Sending email to: ${options.destinateurs.join(', ')}`);
            console.log(`📝 Subject: ${options.subject}`);

            const response: AxiosResponse = await this.axiosInstance.post(
                this.apiUrl || '',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                    },
                }
            );

            console.log('✅ Email API Response:', response.data);
            return response.data;

        } catch (error: any) {
            console.error('❌ Email sending failed:', error.message);

            if (error.response) {
                // API responded with error status
                throw new Error(`Email API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // No response received
                throw new Error(`Email API unreachable: ${error.message}`);
            } else if (error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
                // SSL certificate issue (shouldn't happen with our config, but just in case)
                throw new Error('SSL certificate error - check email API configuration');
            } else {
                // Other errors
                throw new Error(`Email sending failed: ${error.message}`);
            }
        }
    }

    async sendAccountCreationEmail(name: string, email: string, password: string): Promise<void> {

        const message = `Bonjour ${name},<br/><br/>

Vous adresse email "${email}" a été utilisée pour vous inscrire sur notre plateforme.<br/><br/>

Pour accéder à votre compte, veuillez utiliser le mot de passe :
<b>${password}</b><br/>

Si vous n'avez pas demandé de compte, vous pouvez ignorer cet email.<br/><br/>

Cordialement,<br/>
L'équipe ${this.config.entity}`;

        await this.sendEmail({
            subject: 'Création de votre compte',
            message,
            destinateurs: [email]
        });
    }

    async sendVerificationEmail(email: string, token: string, userName: string): Promise<void> {

        const message = `Bonjour ${userName},<br/><br/>

Merci de vous être inscrit sur notre plateforme.<br/><br/>

Pour activer votre compte, veuillez cliquer sur le code suivant :
<b>${token}</b><br/>

Il expire dans 24 heures.<br/><br/>

Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.<br/><br/>

Cordialement,<br/>
L'équipe ${this.config.entity}`;

        await this.sendEmail({
            subject: 'Vérification de votre adresse email',
            message,
            destinateurs: [email]
        });
    }

    async sendPasswordResetEmail(email: string, token: string, userName: string): Promise<void> {

        const message = `Bonjour ${userName},<br/><br/>

Vous avez demandé une réinitialisation de votre mot de passe.<br/><br/>

Pour réinitialiser votre mot de passe, veuillez utiliser le code de vérification suivant :
<b>${token}</b><br/>

Il expire dans 15 minutes.<br/><br/>

Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.<br/><br/>

Cordialement,<br/>
L'équipe ${this.config.entity}`;

        await this.sendEmail({
            subject: 'Réinitialisation de votre mot de passe',
            message,
            destinateurs: [email]
        });
    }

    async sendPasswordToEmail(email: string, password: string, userName: string): Promise<void> {
        const message = `Bonjour ${userName},<br/><br/>

Vous recevez ce message parce que vous êtes inscrit sur notre plateforme.<br/>
Veuillez utiliser le mot de passe suivant pour vous confirmer votre inscription: <b>${password}</b><br/><br/>

Cordialement,<br/>
L'équipe ${this.config.entity}`;

        await this.sendEmail({
            subject: 'Votre mot de passe',
            message,
            destinateurs: [email]
        });
    }

    async sendEnrollmentSuccessEmail(email: string, userName: string, course: { name: string, startDate: string | null, endDate: string | null }): Promise<void> {
        const message = `Bonjour ${userName},<br/><br/>

Votre inscription au cours <b>${course.name}</b> a bien été enregistrée.<br/><br/>
${course.startDate && course.endDate && `Merci de vous rendre disponible entre le ${course.startDate} et le ${course.endDate} pour le suivre.<br/><br/>`}
${course.startDate && !course.endDate && `Le cours débute le ${course.startDate}.<br/><br/>`}
${!course.startDate && course.endDate && `Le cours prend fin le ${course.endDate}.<br/><br/>`}
Cordialement,<br/>
L'équipe ${this.config.entity}`;
        await this.sendEmail({
            subject: 'Inscription au cours réussie',
            message,
            destinateurs: [email]
        });
    }
}

export const emailService = new EmailService({
    emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
    emailHostUser: process.env.EMAIL_HOST_USER || '',
    emailHostPassword: process.env.EMAIL_HOST_PASSWORD || '',
    entity: process.env.EMAIL_ENTITY || '',
});
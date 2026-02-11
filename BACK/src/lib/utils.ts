import { emailService } from "./emailService.js";

export async function sendVerificationEmail(name: string, email: string, token: string) {
    try {
        await emailService.sendVerificationEmail(email, token, name);
        console.log(`Verification email sent to: ${email}`);
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
    }
}

export async function sendAccountCreationEmail(name: string, email: string, password: string) {
    try {
        await emailService.sendAccountCreationEmail(name, email, password);
        console.log(`Verification email sent to: ${email}`);
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
    }
}

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/

export async function sendResetPasswordEmail(email: string, token: string, name: string) {
    try {
        await emailService.sendPasswordResetEmail(email, token, name);
        console.log(`Reset password email sent to: ${email}`);
    } catch (error) {
        console.error('Failed to send reset password email:', error);
        throw error;
    }
}

export async function sendPasswordToEmail(email: string, password: string, name: string) {
    try {
        await emailService.sendPasswordToEmail(email, password, name);
        console.log(`Password sent to: ${email}`);
    } catch (error) {
        console.error('Failed to send password:', error);
        throw error;
    }
}

export async function sendEnrollmentSuccessEmail(email: string, name: string, course: { name: string, startDate: string | null, endDate: string | null }) {
    try {
        await emailService.sendEnrollmentSuccessEmail(email, name, course);
        console.log(`Success enrollment email sent to: ${email}`);
    } catch (error) {
        console.error('Failed to send success enrollment email:', error);
        throw error;
    }
}
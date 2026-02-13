import api from "./api";

export async function sendMessage(data: { name: string, email: string, message: string }) {
    return await api.post('/contact/send-message', data)
}
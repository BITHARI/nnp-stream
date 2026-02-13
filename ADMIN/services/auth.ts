import { AxiosResponse } from "axios";
import api, { mutationRequestHeaders } from "./api";

export async function getAuth() {
    return await api.get('/authentication', {
        headers: mutationRequestHeaders({})
    })
}

export async function signOut() {
    return await api.get('/authentication/sign-out', {
        headers: mutationRequestHeaders({})
    })
}

export async function signIn(data: { email: string, password: string }): Promise<AxiosResponse<{ token: string }>> {
    return await api.post('/authentication/sign-in', data)
}

export async function signUp(data: { name: string, email: string, password: string }) {
    return await api.post('/authentication/sign-up', data)
}

export async function verifyEmail(data: { token: string, email: string }): Promise<AxiosResponse<{ session: { token: string } }>> {
    return await api.post('/authentication/verify-email', { email: data.email }, {
        headers: mutationRequestHeaders({}),
        params: { token: data.token }
    })
}

export async function resetPassword(data: { email: string }) {
    return await api.post('/authentication/reset-password', { email: data.email }, {
        headers: mutationRequestHeaders({}),
    })
}

export async function setNewPassword(data: { token: string, email: string, newPassword: string }) {
    return await api.post('/authentication/set-new-password', { email: data.email, newPassword: data.newPassword }, {
        headers: mutationRequestHeaders({}),
        params: { token: data.token }
    })
}
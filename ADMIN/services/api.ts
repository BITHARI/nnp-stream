import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const api = axios.create({
    baseURL: BASE_URL + '/api',
    withCredentials: true
})

export const mutationRequestHeaders = ({ type = 'json' }: { type?: 'json' | 'form-data' }) => {
    return {
        'Content-Type': type === 'json' ? 'application/json' : type === 'form-data' && 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('nnp-stream-token')}`
    }
}

export const getAuthHeaders = () => {
    const token = localStorage.getItem('nnp-stream-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export type ApiError = {
    error: string,
    message: string
}

export default api
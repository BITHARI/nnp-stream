import api, { mutationRequestHeaders } from "./api";

export async function getDashCardData() {
    return await api.get('/dashboard/admin/cards', {
        headers: mutationRequestHeaders({})
    })
}

export async function getEnrollmentsChartData() {
    return await api.get('/dashboard/admin/enrollments', {
        headers: mutationRequestHeaders({})
    })
}
import api, { getAuthHeaders } from "./api";
import { Category, CreateCategoryData, CreateSeriesData, PaginationParams, PaginationResponse, Series, UpdateSeriesData } from "./types";

export async function getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
}

export async function createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post<Category>('/categories', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function getSeries(
    params?: PaginationParams
): Promise<{ series: Series[]; pagination: PaginationResponse }> {
    const response = await api.get<{ series: Series[]; pagination: PaginationResponse }>(
        '/series',
        { params }
    );
    return response.data;
}

export async function getSeriesById(id: number): Promise<Series> {
    const response = await api.get<Series>(`/series/${id}`);
    return response.data;
}

export async function getSeriesBySlug(slug: string): Promise<Series> {
    const response = await api.get<Series>(`/series/slug/${slug}`);
    return response.data;
}

export async function createSeries(data: CreateSeriesData): Promise<Series> {
    const response = await api.post<Series>('/series', data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function updateSeries(id: number, data: UpdateSeriesData): Promise<Series> {
    const response = await api.patch<Series>(`/series/${id}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export async function deleteSeries(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/series/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}
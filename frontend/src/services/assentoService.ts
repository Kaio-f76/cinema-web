import api from "./api"
import type { Assento } from "../types/Assento"

const assentoService = {
    async listarPorSala(salaId: string): Promise<Assento[]> {
        const response = await api.get<Assento[]>(`/assentos/sala/${salaId}`)
        return response.data
    },

    async buscarPorId(id: string): Promise<Assento> {
        const response = await api.get<Assento>(`/assentos/${id}`)
        return response.data
    },

    async criar(assento: Assento): Promise<Assento> {
        const response = await api.post<Assento>("/assentos", assento)
        return response.data
    },

    async atualizar(id: string, assento: Assento): Promise<Assento> {
        const response = await api.put<Assento>(`/assentos/${id}`, assento)
        return response.data
    },

    async excluir(id: string): Promise<void> {
        await api.delete(`/assentos/${id}`)
    }
}

export default assentoService

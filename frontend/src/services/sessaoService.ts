import api from "./api"
import type { Sessao } from "../types/Sessao"
import type { AssentoStatus } from "../types/Assento"

const sessaoService = {
    async listar(): Promise<Sessao[]> {
        const response = await api.get<Sessao[]>("/sessoes")
        return response.data
    },

    async buscarPorId(id: string): Promise<Sessao> {
        const response = await api.get<Sessao>(`/sessoes/${id}`)
        return response.data
    },

    async buscarPorFilme(filmeId: string): Promise<Sessao[]> {
        const response = await api.get<Sessao[]>(`/sessoes/filme/${filmeId}`)
        return response.data
    },

    async buscarPorSala(salaId: string): Promise<Sessao[]> {
        const response = await api.get<Sessao[]>(`/sessoes/sala/${salaId}`)
        return response.data
    },

    async listarAssentos(sessaoId: string): Promise<AssentoStatus[]> {
        const response = await api.get<AssentoStatus[]>(`/sessoes/${sessaoId}/assentos`)
        return response.data
    },

    async criar(sessao: Sessao): Promise<Sessao> {
        const response = await api.post<Sessao>("/sessoes", sessao)
        return response.data
    },

    async atualizar(id: string, sessao: Sessao): Promise<Sessao> {
        const response = await api.put<Sessao>(`/sessoes/${id}`, sessao)
        return response.data
    },

    async excluir(id: string): Promise<void> {
        await api.delete(`/sessoes/${id}`)
    }
}

export default sessaoService

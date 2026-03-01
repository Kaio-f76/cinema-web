import api from "./api"
import type { Ingresso, CompraIngresso } from "../types/Ingresso"

const ingressoService = {
    async comprar(compra: CompraIngresso): Promise<Ingresso[]> {
        const response = await api.post<Ingresso[]>("/ingressos/comprar", compra)
        return response.data
    },

    async listar(): Promise<Ingresso[]> {
        const response = await api.get<Ingresso[]>("/ingressos")
        return response.data
    },

    async buscarPorId(id: string): Promise<Ingresso> {
        const response = await api.get<Ingresso>(`/ingressos/${id}`)
        return response.data
    },

    async buscarPorUsuario(usuarioId: string): Promise<Ingresso[]> {
        const response = await api.get<Ingresso[]>(`/ingressos/usuario/${usuarioId}`)
        return response.data
    },

    async buscarPorSessao(sessaoId: string): Promise<Ingresso[]> {
        const response = await api.get<Ingresso[]>(`/ingressos/sessao/${sessaoId}`)
        return response.data
    }
}

export default ingressoService

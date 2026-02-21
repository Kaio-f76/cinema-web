import api from "./api";
import { Sala } from "../types/Sala";

const salaService = {
    async listar(): Promise<Sala[]> {
        const response = await api.get<Sala[]>("/salas");
        console.log("Resposta do backend (listar):", response.data);
        return response.data;
    },

    async buscarPorId(id: string): Promise<Sala> {
        const response = await api.get<Sala>(`/salas/${id}`);
        console.log("Resposta do backend (buscarPorId):", response.data);
        return response.data;
    },

    async buscarPorNome(nome: string): Promise<Sala> {
        const response = await api.get<Sala>(`/salas/nome/${nome}`);
        return response.data;
    },

    async criar(sala: Sala, usuarioId: string): Promise<Sala> {
        const response = await api.post<Sala>(`/salas?usuarioId=${usuarioId}`, sala);
        return response.data;
    },

    async atualizar(id: string, sala: Sala, usuarioId: string): Promise<Sala> {
        const response = await api.put<Sala>(`/salas/${id}/${usuarioId}`, sala);
        return response.data;
    },

    async excluir(id: string, usuarioId: string): Promise<void> {
        await api.delete(`/salas/${id}/${usuarioId}`);
    }
};

export default salaService;

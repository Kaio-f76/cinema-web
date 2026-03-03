import api from "./api";
import { Usuario } from "../types/Usuario";

const usuarioService = {
    async criarConta(usuario: Usuario): Promise<Usuario> {
        const response = await api.post<Usuario>("/usuarios/cadastro", usuario);
        return response.data;
    },

    async login(email: string, senha: string): Promise<Usuario> {
        const response = await api.post<Usuario>(
            `/usuarios/login`, { email, senha });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post("/usuarios/logout");
    },

    async getUsuario(): Promise<Usuario> {
        const response = await api.get<Usuario>("/usuarios/me")
        return response.data
    },

    async atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario> {
        const response = await api.put<Usuario>(`/usuarios/${id}`, dados)
        return response.data
    },

    async excluir(id: string): Promise<void> {
        await api.delete(`/usuarios/${id}`)
    },
};

export default usuarioService;

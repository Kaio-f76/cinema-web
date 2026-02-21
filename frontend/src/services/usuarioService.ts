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
    }

};

export default usuarioService;

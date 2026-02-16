import api from "./api";
import { Usuario } from "../types/Usuario";

const usuarioService = {
    async criarConta(usuario: Usuario): Promise<Usuario> {
        const response = await api.post<Usuario>("/usuarios/cadastro", usuario);
        return response.data;
    },

    async login(email: string, senha: string): Promise<Usuario> {
        const response = await api.post<Usuario>(`/usuarios/login?email=${email}&senha=${senha}`);
        return response.data;
    }
};

export default usuarioService;

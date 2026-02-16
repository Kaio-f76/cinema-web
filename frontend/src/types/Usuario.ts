export interface Usuario {
    id?: string;
    nome: string;
    email: string;
    senha: string;
    tipoUsuario?: "CLIENTE" | "ADMINISTRADOR" | "VISITANTE";
    saldo?: number;
}

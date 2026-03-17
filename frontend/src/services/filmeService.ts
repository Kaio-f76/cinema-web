import api from "./api"
import type { Filme } from "../types/Filme"

// URL base para buscar as imagens que o Spring Boot vai servir
const UPLOADS_URL = "http://localhost:8080/uploads/"

const stripCamposLocais = (filme: Partial<Filme>): Record<string, unknown> => {
    const { sessoes, id, ...rest } = filme as any
    return rest
}

// Nova função para anexar o caminho completo da imagem vindo do banco
const formatarUrlImagem = (filme: Filme): Filme => {
    if (filme.imagemUrl && !filme.imagemUrl.startsWith('http')) {
        filme.imagemUrl = `${UPLOADS_URL}${filme.imagemUrl}`
    }
    return filme
}

const filmeService = {
    async listar(): Promise<Filme[]> {
        const response = await api.get<Filme[]>("/filmes")
        return response.data.map(formatarUrlImagem)
    },

    async buscarPorId(id: string): Promise<Filme> {
        const response = await api.get<Filme>(`/filmes/${id}`)
        return formatarUrlImagem(response.data)
    },

    async buscarPorNome(nome: string): Promise<Filme> {
        const response = await api.get<Filme>(`/filmes/nome/${nome}`)
        return formatarUrlImagem(response.data)
    },

    async buscarPorGenero(genero: string): Promise<Filme[]> {
        const response = await api.get<Filme[]>(`/filmes/genero/${genero}`)
        return response.data.map(formatarUrlImagem)
    },

    // Novo método para enviar o arquivo físico para o backend
    async uploadImagem(id: string, arquivo: File): Promise<void> {
        const formData = new FormData()
        formData.append('file', arquivo)
        await api.post(`/filmes/${id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    async criar(filme: Filme, arquivoImagem?: File): Promise<Filme> {
        const payload = stripCamposLocais(filme)
        try {
            // 1. Cria o filme no MySQL
            const response = await api.post<Filme>("/filmes", payload)
            const criado = response.data

            // 2. Se tiver imagem, faz o upload logo em seguida
            if (arquivoImagem && criado.id) {
                await this.uploadImagem(criado.id, arquivoImagem)
            }

            return formatarUrlImagem(criado)
        } catch (err: any) {
            console.error('Erro ao criar filme:', err.response?.data)
            throw err
        }
    },

    async atualizar(id: string, filme: Partial<Filme>, arquivoImagem?: File): Promise<Filme> {
        // 1. Atualiza os dados textuais
        const response = await api.put<Filme>(`/filmes/${id}`, stripCamposLocais(filme))

        // 2. Se enviou uma nova imagem, atualiza o arquivo
        if (arquivoImagem) {
            await this.uploadImagem(id, arquivoImagem)
        }

        return formatarUrlImagem(response.data)
    },

    async excluir(id: string): Promise<void> {
        await api.delete(`/filmes/${id}`)
    }
}

export default filmeService
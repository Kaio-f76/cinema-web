import { ref } from 'vue'
import filmeService from '../services/filmeService'
import type { Filme } from '../types/Filme'

const filmes = ref<Filme[]>([])
const filmeAtual = ref<Filme | null>(null)
const loading = ref(false)
const erro = ref<string | null>(null)

export function useFilme() {
    const listarFilmes = async () => {
        loading.value = true
        erro.value = null
        try {
            filmes.value = await filmeService.listar()
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao listar filmes'
            filmes.value = []
        } finally {
            loading.value = false
        }
    }

    // Adicionado parâmetro arquivoImagem (opcional)
    const criarFilme = async (filme: Filme, arquivoImagem?: File) => {
        loading.value = true
        erro.value = null
        try {
            // Repassa o filme e o arquivo para o service
            const novoFilme = await filmeService.criar(filme, arquivoImagem)
            filmes.value.push(novoFilme)
            return novoFilme
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao criar filme'
            throw e
        } finally {
            loading.value = false
        }
    }

    const atualizarFilme = async (id: string, filme: Partial<Filme>, arquivoImagem?: File) => {
        loading.value = true
        try {
            const atualizado = await filmeService.atualizar(id, filme, arquivoImagem)

            // Encontra o filme na lista e substitui pelo objeto "fresco" vindo do backend
            const index = filmes.value.findIndex(f => f.id === id)
            if (index !== -1) {
                filmes.value[index] = { ...atualizado }
            }
            return atualizado // IMPORTANTE: retornar o objeto aqui
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao atualizar'
            throw e
        } finally {
            loading.value = false
        }
    }

    const excluirFilme = async (id: string) => {
        loading.value = true
        erro.value = null
        try {
            await filmeService.excluir(id)
            filmes.value = filmes.value.filter(f => f.id !== id)
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao excluir filme'
            throw e
        } finally {
            loading.value = false
        }
    }

    const limparErro = () => { erro.value = null }

    return {
        filmes,
        filmeAtual,
        loading,
        erro,
        listarFilmes,
        criarFilme,
        atualizarFilme,
        excluirFilme,
        limparErro
    }
}
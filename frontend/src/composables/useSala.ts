import { ref } from 'vue'
import salaService from '../services/salaService'
import { Sala } from '../types/Sala'

const salas = ref<Sala[]>([])
const salaAtual = ref<Sala | null>(null)
const loading = ref(false)
const erro = ref<string | null>(null)

export function useSala() {
    const listarSalas = async () => {
        loading.value = true
        erro.value = null
        try {
            salas.value = await salaService.listar()
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao listar salas'
            salas.value = []
        } finally {
            loading.value = false
        }
    }

    const buscarPorId = async (id: string) => {
        loading.value = true
        erro.value = null
        try {
            salaAtual.value = await salaService.buscarPorId(id)
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Sala não encontrada'
            salaAtual.value = null
        } finally {
            loading.value = false
        }
    }

    const buscarPorNome = async (nome: string) => {
        loading.value = true
        erro.value = null
        try {
            salaAtual.value = await salaService.buscarPorNome(nome)
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Sala não encontrada'
            salaAtual.value = null
        } finally {
            loading.value = false
        }
    }

    const criarSala = async (sala: Sala, usuarioId: string) => {
        loading.value = true
        erro.value = null
        try {
            const novaSala = await salaService.criar(sala, usuarioId)
            salas.value.push(novaSala)
            return novaSala
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao criar sala'
            throw e
        } finally {
            loading.value = false
        }
    }

    const atualizarSala = async (id: string, sala: Sala, usuarioId: string) => {
        loading.value = true
        erro.value = null
        try {
            const salaAtualizada = await salaService.atualizar(id, sala, usuarioId)
            const index = salas.value.findIndex(s => s.id === id)
            if (index !== -1) {
                salas.value[index] = salaAtualizada
            }
            return salaAtualizada
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao atualizar sala'
            throw e
        } finally {
            loading.value = false
        }
    }

    const excluirSala = async (id: string, usuarioId: string) => {
        loading.value = true
        erro.value = null
        try {
            await salaService.excluir(id, usuarioId)
            salas.value = salas.value.filter(s => s.id !== id)
        } catch (e: any) {
            erro.value = e.response?.data?.message || 'Erro ao excluir sala'
            throw e
        } finally {
            loading.value = false
        }
    }

    const limparSalaAtual = () => {
        salaAtual.value = null
    }

    const limparErro = () => {
        erro.value = null
    }

    return {
        salas,
        salaAtual,
        loading,
        erro,
        listarSalas,
        buscarPorId,
        buscarPorNome,
        criarSala,
        atualizarSala,
        excluirSala,
        limparSalaAtual,
        limparErro
    }
}

import { ref, watch } from 'vue'
import usuarioService from '../services/usuarioService'

const STORAGE_KEY = 'cinemamax_usuario'

// Restaura do localStorage ao inicializar
function carregarDoStorage(): any {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        localStorage.removeItem(STORAGE_KEY)
        return null
    }
}

const usuario = ref<any>(carregarDoStorage())

// Persiste automaticamente no localStorage sempre que o usuário mudar
watch(usuario, (novoValor) => {
    if (novoValor) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novoValor))
    } else {
        localStorage.removeItem(STORAGE_KEY)
    }
}, { deep: true })

export function useUsuario() {
    const setUsuario = (u: any) => { usuario.value = u }

    const clearUsuario = () => {
        usuario.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    const fetchUsuario = async () => {
        try {
            usuario.value = await usuarioService.getUsuario()
        } catch {
            usuario.value = null
        }
    }

    return { usuario, setUsuario, clearUsuario, fetchUsuario }
}

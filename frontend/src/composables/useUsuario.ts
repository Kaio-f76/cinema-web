import { ref } from 'vue'
import usuarioService from '../services/usuarioService'

const usuario = ref<any>(null)

export function useUsuario() {
    const setUsuario = (u: any) => usuario.value = u
    const clearUsuario = () => usuario.value = null

    const fetchUsuario = async () => {
        try {
            usuario.value = await usuarioService.getUsuario()
        } catch {
            usuario.value = null
        }
    }

    return { usuario, setUsuario, clearUsuario, fetchUsuario }
}

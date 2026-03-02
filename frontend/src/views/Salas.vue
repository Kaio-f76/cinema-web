<template>
  <div class="max-w-7xl mx-auto">

    <!-- Header -->
    <div class="flex items-start justify-between mb-2">
      <div>
        <h2 class="text-3xl font-bold" style="font-family: 'Poppins', sans-serif;">
          Gerenciamento de Salas
        </h2>
        <p class="text-[#A8AAAD] text-sm mt-1">{{ salas.length }} salas cadastradas</p>
      </div>

      <button
        v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'"
        @click="abrirModal()"
        class="flex items-center gap-2 bg-[#2FA36A] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
      >
        <Plus class="w-4 h-4" />
        Criar Sala
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block w-8 h-8 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A8AAAD] mt-4">Carregando salas...</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-6 mt-6">
      {{ erro }}
      <button @click="limparErro" class="ml-4 underline">Fechar</button>
    </div>

    <!-- Tabela de Salas -->
    <div v-if="!loading && salas.length > 0" class="mt-8 overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-[#252829]">
            <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-3 px-4">Sala</th>
            <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-3 px-4"></th>
            <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-3 px-4">Capacidade</th>
            <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-3 px-4">Configuração</th>
            <th class="text-left text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-3 px-4">Status</th>
            <th class="text-right text-xs text-[#A8AAAD] font-medium uppercase tracking-wider py-3 px-4" v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(sala, index) in salas"
            :key="sala.id"
            class="border-b border-[#252829]/50 hover:bg-[#131516] transition"
          >
            <!-- Número + Nome -->
            <td class="py-4 px-4">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-[#2FA36A]/20 text-[#2FA36A] flex items-center justify-center text-sm font-bold">
                  {{ index + 1 }}
                </span>
                <span class="font-semibold">{{ sala.nome }}</span>
              </div>
            </td>

            <!-- Tipo badge -->
            <td class="py-4 px-4">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30">
                2D
              </span>
            </td>

            <!-- Capacidade -->
            <td class="py-4 px-4 text-[#A8AAAD]">
              {{ sala.numAssentos ?? 0 }} lugares
            </td>

            <!-- Configuração -->
            <td class="py-4 px-4 text-[#A8AAAD]">
              {{ calcularConfig(sala.numAssentos).fileiras }} fileiras × {{ calcularConfig(sala.numAssentos).porFileira }} assentos
            </td>

            <!-- Status -->
            <td class="py-4 px-4">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#2FA36A]/20 text-[#2FA36A] border border-[#2FA36A]/30">
                Ativo
              </span>
            </td>

            <!-- Ações -->
            <td class="py-4 px-4" v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'">
              <div class="flex justify-end gap-2">
                <button
                  @click="abrirModal(sala)"
                  class="p-2 bg-[#1A1C1E] border border-[#252829] rounded-lg hover:bg-[#252829] transition"
                  title="Editar"
                >
                  <Pencil class="w-4 h-4 text-[#A8AAAD]" />
                </button>
                <button
                  @click="confirmarExclusao(sala)"
                  class="p-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg hover:bg-[#EF4444]/20 transition"
                  title="Excluir"
                >
                  <Trash2 class="w-4 h-4 text-[#EF4444]" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vazio -->
    <div v-if="!loading && salas.length === 0 && !erro" class="text-center py-20">
      <DoorOpen class="w-16 h-16 text-[#252829] mx-auto mb-4" />
      <p class="text-[#A8AAAD]">Nenhuma sala cadastrada.</p>
    </div>

    <!-- ==================== MODAL CRIAR/EDITAR ==================== -->
    <div
      v-if="modalAberto"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="fecharModal"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-8 w-full max-w-md">
        <h3 class="text-xl font-bold mb-6" style="font-family: 'Poppins', sans-serif;">
          {{ editando ? 'Editar Sala' : 'Nova Sala' }}
        </h3>

        <div v-if="carregandoSala" class="text-center py-6">
          <div class="inline-block w-6 h-6 border-3 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-[#A8AAAD] mt-2 text-sm">Carregando dados...</p>
        </div>

        <form v-else @submit.prevent="salvarSala" class="flex flex-col gap-4">
          <div>
            <label class="text-xs text-[#A8AAAD] mb-1 block">Nome da Sala</label>
            <input
              v-model="formNome"
              type="text"
              placeholder="Ex: Sala 1"
              required
              class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
            />
          </div>

          <div>
            <label class="text-xs text-[#A8AAAD] mb-1 block">Número de Assentos</label>
            <input
              v-model.number="formNumAssentos"
              type="number"
              placeholder="Ex: 100"
              min="1"
              class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
            />
          </div>

          <div class="flex gap-4 mt-4">
            <button
              type="submit"
              :disabled="salvando"
              class="flex-1 bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] transition disabled:opacity-50"
            >
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              type="button"
              @click="fecharModal"
              class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== MODAL EXCLUSÃO ==================== -->
    <div
      v-if="modalExclusao"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="cancelarExclusao"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-8 w-full max-w-md text-center">
        <Trash2 class="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2" style="font-family: 'Poppins', sans-serif;">Excluir Sala</h3>
        <p class="text-[#A8AAAD] mb-6">
          Tem certeza que deseja excluir a sala <strong class="text-white">{{ salaParaExcluir?.nome }}</strong>?
        </p>
        <div class="flex gap-4">
          <button
            @click="executarExclusao"
            :disabled="salvando"
            class="flex-1 bg-[#EF4444] py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            {{ salvando ? 'Excluindo...' : 'Excluir' }}
          </button>
          <button
            @click="cancelarExclusao"
            class="flex-1 bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, Pencil, Trash2, DoorOpen } from 'lucide-vue-next'
import { useSala } from '../composables/useSala'
import { useUsuario } from '../composables/useUsuario'
import salaService from '../services/salaService'
import type { Sala } from '../types/Sala'

const { salas, loading, erro, listarSalas, criarSala, atualizarSala, excluirSala, limparErro } = useSala()
const { usuario } = useUsuario()

const modalAberto = ref(false)
const modalExclusao = ref(false)
const editando = ref(false)
const salvando = ref(false)
const carregandoSala = ref(false)
const formNome = ref('')
const formNumAssentos = ref<number | undefined>(undefined)
const salaEditando = ref<Sala | null>(null)
const salaParaExcluir = ref<Sala | null>(null)

onMounted(() => {
  listarSalas()
})

const calcularConfig = (numAssentos?: number) => {
  if (!numAssentos || numAssentos <= 0) return { fileiras: 0, porFileira: 0 }
  const porFileira = 10
  const fileiras = Math.ceil(numAssentos / porFileira)
  return { fileiras, porFileira: Math.min(porFileira, numAssentos) }
}

const abrirModal = async (sala?: Sala) => {
  if (sala && sala.id) {
    editando.value = true
    carregandoSala.value = true
    modalAberto.value = true
    try {
      const salaCompleta = await salaService.buscarPorId(sala.id)
      salaEditando.value = salaCompleta
      formNome.value = salaCompleta.nome
      formNumAssentos.value = salaCompleta.numAssentos
    } catch (e) {
      console.error('Erro ao buscar sala:', e)
      fecharModal()
    } finally {
      carregandoSala.value = false
    }
  } else {
    editando.value = false
    salaEditando.value = null
    formNome.value = ''
    formNumAssentos.value = undefined
    modalAberto.value = true
  }
}

const fecharModal = () => {
  modalAberto.value = false
  editando.value = false
  salaEditando.value = null
  formNome.value = ''
  formNumAssentos.value = undefined
}

const salvarSala = async () => {
  if (!usuario.value?.id) return

  salvando.value = true
  try {
    const salaData: Sala = {
      nome: formNome.value,
      numAssentos: formNumAssentos.value
    }
    if (editando.value && salaEditando.value?.id) {
      await atualizarSala(salaEditando.value.id, salaData, usuario.value.id)
    } else {
      await criarSala(salaData, usuario.value.id)
    }
    fecharModal()
  } catch (e) {
    // erro já tratado no composable
  } finally {
    salvando.value = false
  }
}

const confirmarExclusao = (sala: Sala) => {
  salaParaExcluir.value = sala
  modalExclusao.value = true
}

const cancelarExclusao = () => {
  salaParaExcluir.value = null
  modalExclusao.value = false
}

const executarExclusao = async () => {
  if (!usuario.value?.id || !salaParaExcluir.value?.id) return

  salvando.value = true
  try {
    await excluirSala(salaParaExcluir.value.id, usuario.value.id)
    cancelarExclusao()
  } catch (e) {
    // erro já tratado no composable
  } finally {
    salvando.value = false
  }
}
</script>

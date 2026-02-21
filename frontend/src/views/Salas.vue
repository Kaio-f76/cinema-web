<template>
  <div class="max-w-4xl mx-auto">
    
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold" style="font-family: 'Poppins', sans-serif;">
        🎭 Gerenciamento de Salas
      </h2>

      <button
        v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'"
        @click="abrirModal()"
        class="flex items-center gap-2 bg-[#2FA36A] px-5 py-2 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
      >
        <Plus class="w-4 h-4" />
        Nova Sala
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-[#A8AAAD]">Carregando salas...</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-6">
      {{ erro }}
      <button @click="limparErro" class="ml-4 underline">Fechar</button>
    </div>

    <!-- Lista de Salas -->
    <div v-if="!loading && salas.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="sala in salas"
        :key="sala.id"
        class="bg-[#131516] border border-[#252829] rounded-xl p-6 hover:bg-[#1A1C1E] transition"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <DoorOpen class="w-6 h-6 text-[#2FA36A] flex-shrink-0" />
            <h3 class="text-lg font-semibold truncate">{{ sala.nome }}</h3>
          </div>
          
          <div v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'" class="flex gap-2 flex-shrink-0">
            <button
              @click="abrirModal(sala)"
              class="p-2 bg-[#1A1C1E] border border-[#252829] rounded-lg hover:bg-[#252829] transition"
              title="Editar"
            >
              <Pencil class="w-4 h-4 text-[#A8AAAD]" />
            </button>
            <button
              @click="confirmarExclusao(sala)"
              class="p-2 bg-[#EF4444]/20 border border-[#EF4444] rounded-lg hover:bg-[#EF4444]/40 transition"
              title="Excluir"
            >
              <Trash2 class="w-4 h-4 text-[#EF4444]" />
            </button>
          </div>
        </div>
        <div class="mt-3 text-sm text-[#A8AAAD] flex gap-4">
          <span>Cadeiras: {{ sala.numAssentos ?? '-' }}</span>
          <span>Sessões: {{ sala.sessoes?.length ?? 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Lista Vazia -->
    <div v-if="!loading && salas.length === 0" class="text-center py-10">
      <DoorOpen class="w-16 h-16 text-[#252829] mx-auto mb-4" />
      <p class="text-[#A8AAAD]">Nenhuma sala cadastrada.</p>
    </div>

    <!-- Modal Criar/Editar -->
    <div
      v-if="modalAberto"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="fecharModal"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-xl p-8 w-full max-w-md shadow-xl">
        <h3 class="text-xl font-bold mb-6" style="font-family: 'Poppins', sans-serif;">
          {{ editando ? 'Editar Sala' : 'Nova Sala' }}
        </h3>

        <!-- Loading ao buscar sala -->
        <div v-if="carregandoSala" class="text-center py-6">
          <p class="text-[#A8AAAD]">Carregando dados...</p>
        </div>

        <form v-else @submit.prevent="salvarSala" class="flex flex-col gap-4">
          <input
            v-model="formNome"
            type="text"
            placeholder="Nome da Sala"
            required
            class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
          />

          <input
            v-model.number="formNumAssentos"
            type="number"
            placeholder="Número de Assentos"
            min="1"
            class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
          />

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

    <!-- Modal Confirmação Exclusão -->
    <div
      v-if="modalExclusao"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="cancelarExclusao"
    >
      <div class="bg-[#131516] border border-[#252829] rounded-xl p-8 w-full max-w-md shadow-xl text-center">
        <Trash2 class="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2" style="font-family: 'Poppins', sans-serif;">
          Excluir Sala
        </h3>
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

<template>
  <div class="max-w-3xl mx-auto">

    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold" style="font-family: 'Poppins', sans-serif;">
        Minha Conta
      </h2>
      <p class="text-[#A8AAAD] text-sm mt-1">Gerencie suas informações pessoais</p>
    </div>

    <!-- Erro global -->
    <div v-if="erro" class="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
      <span>{{ erro }}</span>
      <button @click="erro = ''" class="underline text-sm">Fechar</button>
    </div>

    <!-- Sucesso -->
    <div v-if="sucesso" class="bg-[#2FA36A]/20 border border-[#2FA36A] text-[#2FA36A] px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
      <span>{{ sucesso }}</span>
      <button @click="sucesso = ''" class="underline text-sm">Fechar</button>
    </div>

    <!-- Card do perfil -->
    <div class="bg-[#131516] border border-[#252829] rounded-2xl overflow-hidden mb-6">

      <!-- Banner com avatar -->
      <div class="h-28 bg-gradient-to-r from-[#2FA36A]/30 to-[#3b82f6]/30 relative">
        <div class="absolute -bottom-10 left-6">
          <div class="w-20 h-20 rounded-2xl bg-[#2FA36A] flex items-center justify-center text-3xl font-bold border-4 border-[#131516]">
            {{ iniciais }}
          </div>
        </div>
      </div>

      <div class="pt-14 px-6 pb-6">
        <div class="flex items-center gap-3 mb-1">
          <h3 class="text-xl font-bold">{{ usuario?.nome }}</h3>
          <span
            class="px-3 py-0.5 rounded-full text-xs font-semibold border"
            :class="usuario?.tipoUsuario === 'ADMINISTRADOR'
              ? 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30'
              : 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30'"
          >
            {{ usuario?.tipoUsuario }}
          </span>
        </div>
        <p class="text-[#A8AAAD] text-sm">{{ usuario?.email }}</p>
      </div>
    </div>

    <!-- Saldo -->
    <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 mb-6">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-xl bg-[#2FA36A]/20 flex items-center justify-center">
          <Wallet class="w-5 h-5 text-[#2FA36A]" />
        </div>
        <span class="text-sm text-[#A8AAAD]">Saldo disponível</span>
      </div>
      <p class="text-3xl font-bold">
        R$ {{ (usuario?.saldo ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
      </p>
    </div>

    <!-- Editar informações -->
    <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 mb-6">
      <div class="flex items-center gap-2 mb-5">
        <Pencil class="w-5 h-5 text-[#2FA36A]" />
        <h3 class="font-semibold text-lg">Editar Informações</h3>
      </div>

      <form @submit.prevent="salvarAlteracoes" class="space-y-4">
        <!-- Nome -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Nome</label>
          <input
            v-model="form.nome"
            type="text"
            placeholder="Seu nome"
            class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-2.5 text-sm focus:border-[#2FA36A] focus:outline-none transition placeholder:text-[#555]"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-2.5 text-sm focus:border-[#2FA36A] focus:outline-none transition placeholder:text-[#555]"
          />
        </div>

        <!-- Senha -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Nova Senha <span class="text-[#555]">(deixe em branco para manter a atual)</span></label>
          <div class="relative">
            <input
              v-model="form.senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-2.5 pr-10 text-sm focus:border-[#2FA36A] focus:outline-none transition placeholder:text-[#555]"
            />
            <button
              type="button"
              @click="mostrarSenha = !mostrarSenha"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8AAAD] hover:text-white transition"
            >
              <EyeOff v-if="mostrarSenha" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Saldo (editar) -->
        <div>
          <label class="text-xs text-[#A8AAAD] mb-1 block">Saldo (R$)</label>
          <input
            v-model.number="form.saldo"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="w-full bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-2.5 text-sm focus:border-[#2FA36A] focus:outline-none transition placeholder:text-[#555]"
          />
        </div>

        <button
          type="submit"
          :disabled="salvando"
          class="flex items-center gap-2 bg-[#2FA36A] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#3BB77C] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save class="w-4 h-4" />
          {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </form>
    </div>

    <!-- Zona de perigo -->
    <div class="bg-[#131516] border border-[#EF4444]/30 rounded-2xl p-6">
      <div class="flex items-center gap-2 mb-3">
        <AlertTriangle class="w-5 h-5 text-[#EF4444]" />
        <h3 class="font-semibold text-lg text-[#EF4444]">Zona de Perigo</h3>
      </div>
      <p class="text-sm text-[#A8AAAD] mb-4">
        Ao excluir sua conta, todos os seus dados serão removidos permanentemente. Essa ação não pode ser desfeita.
      </p>
      <button
        @click="modalExclusao = true"
        class="flex items-center gap-2 bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#EF4444]/25 transition"
      >
        <Trash2 class="w-4 h-4" />
        Excluir Minha Conta
      </button>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div v-if="modalExclusao" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="modalExclusao = false">
      <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 w-full max-w-md">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-[#EF4444]/20 flex items-center justify-center">
            <AlertTriangle class="w-6 h-6 text-[#EF4444]" />
          </div>
          <div>
            <h3 class="font-bold text-lg">Excluir Conta</h3>
            <p class="text-sm text-[#A8AAAD]">Essa ação é irreversível</p>
          </div>
        </div>

        <p class="text-sm text-[#A8AAAD] mb-6">
          Tem certeza de que deseja excluir permanentemente a conta
          <strong class="text-white">{{ usuario?.email }}</strong>?
          Todos os seus ingressos e dados serão perdidos.
        </p>

        <div class="flex gap-3">
          <button
            @click="modalExclusao = false"
            class="flex-1 bg-[#1A1C1E] border border-[#252829] py-2.5 rounded-lg hover:bg-[#252829] transition font-semibold"
          >
            Cancelar
          </button>
          <button
            @click="excluirConta"
            :disabled="excluindo"
            class="flex-1 bg-[#EF4444] py-2.5 rounded-lg hover:bg-red-600 transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ excluindo ? 'Excluindo...' : 'Sim, excluir' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Wallet, Pencil, Save, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-vue-next'
import { useUsuario } from '../composables/useUsuario'
import usuarioService from '../services/usuarioService'

const router = useRouter()
const { usuario, setUsuario, clearUsuario } = useUsuario()

const form = ref({
  nome: '',
  email: '',
  senha: '',
  saldo: 0,
})
const mostrarSenha = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const modalExclusao = ref(false)
const erro = ref('')
const sucesso = ref('')

const iniciais = computed(() => {
  const nome = usuario.value?.nome || ''
  const partes = nome.trim().split(/\s+/)
  if (partes.length >= 2) return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
  return nome.slice(0, 2).toUpperCase()
})

onMounted(() => {
  if (usuario.value) {
    form.value.nome = usuario.value.nome || ''
    form.value.email = usuario.value.email || ''
    form.value.saldo = usuario.value.saldo ?? 0
    form.value.senha = ''
  }
})

const salvarAlteracoes = async () => {
  if (!usuario.value?.id) return

  salvando.value = true
  erro.value = ''
  sucesso.value = ''

  try {
    const payload: Record<string, unknown> = {
      nome: form.value.nome,
      email: form.value.email,
      saldo: form.value.saldo,
    }
    if (form.value.senha.trim()) {
      payload.senha = form.value.senha
    }

    const atualizado = await usuarioService.atualizar(usuario.value.id, payload as any)
    setUsuario(atualizado)
    form.value.senha = ''
    sucesso.value = 'Dados atualizados com sucesso!'
  } catch (e: any) {
    erro.value = e.response?.data?.message || e.response?.data || 'Erro ao atualizar dados'
  } finally {
    salvando.value = false
  }
}

const excluirConta = async () => {
  if (!usuario.value?.id) return

  excluindo.value = true
  erro.value = ''

  try {
    await usuarioService.excluir(usuario.value.id)
    clearUsuario()
    await usuarioService.logout()
    router.push('/')
  } catch (e: any) {
    erro.value = e.response?.data?.message || e.response?.data || 'Erro ao excluir conta'
    modalExclusao.value = false
  } finally {
    excluindo.value = false
  }
}
</script>

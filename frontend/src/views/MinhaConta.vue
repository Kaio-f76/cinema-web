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

    <!-- Meus Ingressos -->
    <div class="bg-[#131516] border border-[#252829] rounded-2xl p-6 mb-6">
      <div class="flex items-center gap-2 mb-5">
        <Ticket class="w-5 h-5 text-[#2FA36A]" />
        <h3 class="font-semibold text-lg">Meus Ingressos</h3>
      </div>

      <div v-if="carregandoIngressos" class="text-center py-8">
        <div class="inline-block w-6 h-6 border-3 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[#A8AAAD] mt-2 text-sm">Carregando ingressos...</p>
      </div>

      <div v-else-if="ingressosEnriquecidos.length === 0" class="text-center py-8">
        <Ticket class="w-12 h-12 text-[#252829] mx-auto mb-3" />
        <p class="text-[#A8AAAD] text-sm">Você ainda não comprou nenhum ingresso.</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="ing in ingressosEnriquecidos"
          :key="ing.id"
          class="bg-[#0D0F10] border border-[#252829] rounded-xl p-4 flex items-center gap-4 hover:border-[#2FA36A]/40 transition"
        >
          <!-- Poster mini -->
          <div class="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              v-if="ing.imagemUrl"
              :src="`/filmes/${ing.imagemUrl}`"
              :alt="ing.nomeFilme"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
              <Film class="w-5 h-5 text-white/20" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-sm truncate">{{ ing.nomeFilme || 'Filme' }}</h4>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#A8AAAD]">
              <span v-if="ing.dataSessao" class="flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                {{ ing.dataSessao }}
              </span>
              <span v-if="ing.horario" class="flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {{ ing.horario }}
              </span>
              <span v-if="ing.salaNome" class="flex items-center gap-1">
                <Monitor class="w-3 h-3" />
                {{ ing.salaNome }}
              </span>
              <span v-if="ing.assentoLabel" class="flex items-center gap-1 font-semibold text-white">
                <Armchair class="w-3 h-3 text-[#2FA36A]" />
                {{ ing.assentoLabel }}
              </span>
            </div>
            <div class="flex items-center gap-3 mt-1.5">
              <span v-if="ing.tipoIngresso" class="text-xs px-2 py-0.5 rounded-full bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                {{ ing.tipoIngresso }}
              </span>
              <span v-if="ing.dataCompra" class="text-xs text-[#555]">Comprado em {{ ing.dataCompra }}</span>
            </div>
          </div>

          <!-- Valor -->
          <div class="text-right flex-shrink-0">
            <p class="text-[#2FA36A] font-bold text-sm">R$ {{ (ing.valorI ?? 0).toFixed(2) }}</p>
            <p v-if="ing.valorDesconto" class="text-[#A8AAAD] text-xs line-through">R$ {{ ((ing.valorI ?? 0) + ing.valorDesconto).toFixed(2) }}</p>
          </div>
        </div>
      </div>
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
import { Wallet, Pencil, Save, Eye, EyeOff, Trash2, AlertTriangle, Ticket, Film, Calendar, Clock, Monitor, Armchair } from 'lucide-vue-next'
import { useUsuario } from '../composables/useUsuario'
import usuarioService from '../services/usuarioService'
import ingressoService from '../services/ingressoService'
import sessaoService from '../services/sessaoService'
import { apiDateToBr } from '../utils/date-utils'

const router = useRouter()
const { usuario, setUsuario, clearUsuario } = useUsuario()

const form = ref({
  nome: '',
  email: '',
  senha: '',
})
const mostrarSenha = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const modalExclusao = ref(false)
const erro = ref('')
const sucesso = ref('')

// Ingressos enriquecidos
interface IngressoEnriquecido {
  id?: string
  nomeFilme?: string
  imagemUrl?: string
  dataSessao?: string
  horario?: string
  salaNome?: string
  assentoLabel?: string
  tipoIngresso?: string
  valorI?: number
  valorDesconto?: number
  dataCompra?: string
}

const carregandoIngressos = ref(false)
const ingressosEnriquecidos = ref<IngressoEnriquecido[]>([])

const iniciais = computed(() => {
  const nome = usuario.value?.nome || ''
  const partes = nome.trim().split(/\s+/)
  if (partes.length >= 2) return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
  return nome.slice(0, 2).toUpperCase()
})

const carregarIngressos = async () => {
  if (!usuario.value?.id) return
  carregandoIngressos.value = true
  try {
    const ingressos = await ingressoService.buscarPorUsuario(usuario.value.id)

    // Buscar sessões únicas
    const sessaoIds = [...new Set(ingressos.map(i => i.sessaoId).filter(Boolean))] as string[]
    const sessaoMap = new Map<string, { nomeFilme?: string; imagemUrl?: string; data?: string; horario?: string; salaNome?: string; assentosMap: Map<string, string> }>()

    await Promise.all(
      sessaoIds.map(async (sId) => {
        try {
          const sessao = await sessaoService.buscarPorId(sId)
          const assentosMap = new Map<string, string>()
          // Buscar assentos da sessão para mapear assentoSessaoId → label
          try {
            const assentos = await sessaoService.listarAssentos(sId)
            assentos.forEach(a => {
              assentosMap.set(a.id, `${a.fila}${a.numero}`)
            })
          } catch { /* ignore */ }
          sessaoMap.set(sId, {
            nomeFilme: sessao.filme?.nome,
            imagemUrl: sessao.filme?.imagemUrl,
            data: sessao.data,
            horario: sessao.horarioFilme,
            salaNome: sessao.sala?.nome,
            assentosMap,
          })
        } catch { /* ignore */ }
      })
    )

    ingressosEnriquecidos.value = ingressos.map(ing => {
      const info = ing.sessaoId ? sessaoMap.get(ing.sessaoId) : undefined
      return {
        id: ing.id,
        nomeFilme: info?.nomeFilme,
        imagemUrl: info?.imagemUrl,
        dataSessao: info?.data ? apiDateToBr(info.data) : undefined,
        horario: info?.horario,
        salaNome: info?.salaNome,
        assentoLabel: ing.assentoSessaoId && info?.assentosMap ? info.assentosMap.get(ing.assentoSessaoId) : undefined,
        tipoIngresso: ing.tipoIngresso,
        valorI: ing.valorI,
        valorDesconto: ing.valorDesconto,
        dataCompra: ing.dataCompra ? apiDateToBr(ing.dataCompra) : undefined,
      }
    })
  } catch (e) {
    console.error('Erro ao carregar ingressos:', e)
  } finally {
    carregandoIngressos.value = false
  }
}

onMounted(() => {
  if (usuario.value) {
    form.value.nome = usuario.value.nome || ''
    form.value.email = usuario.value.email || ''
    form.value.senha = ''
  }
  carregarIngressos()
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

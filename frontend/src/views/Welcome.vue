<template>
  <div>
    <div class="relative w-full h-screen overflow-hidden select-none bg-black">
      
      <div v-if="carregandoInicial" class="absolute inset-0 z-50 flex items-center justify-center bg-black">
        <div class="inline-block w-10 h-10 border-4 border-[#2FA36A] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="filmesExibidos.length > 0">
        <transition :name="transicao" mode="out-in">
          <div
            :key="filmeAtualIndex"
            class="absolute inset-0 bg-cover bg-center transition-all duration-700"
            :style="{ backgroundImage: `url('${filmeAtual.poster}')` }"
          ></div>
        </transition>

        <div class="absolute inset-0 bg-black/50"></div>

        <div class="relative z-10 flex items-center justify-between h-full px-16">
          <button
            @click="anteriorFilme"
            class="text-5xl text-white hover:text-[#2FA36A] transition-transform transform active:scale-90"
          >
            &#10094;
          </button>

          <transition :name="transicao" mode="out-in">
            <div
              :key="filmeAtualIndex"
              class="flex flex-col justify-center gap-4 max-w-3xl w-full text-left text-white bg-black/30 px-10 py-8 rounded-2xl transform transition-transform duration-500"
            >
              <div class="flex items-center gap-2 w-max bg-[#2FA36A]/30 border border-[#2FA36A] rounded-lg px-3 py-1 text-sm font-semibold text-[#2FA36A]">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.152c.969 0 1.371 1.24.588 1.81l-3.36 2.443a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.538 1.118l-3.36-2.443a1 1 0 00-1.176 0l-3.36 2.443c-.783.57-1.838-.197-1.538-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.073 9.382c-.783-.57-.38-1.81.588-1.81h4.152a1 1 0 00.95-.69l1.286-3.955z" />
                </svg>
                Em destaque
              </div>

              <h2 class="text-3xl font-bold uppercase">{{ filmeAtual.nome }}</h2>

              <div class="flex items-center gap-4 text-sm text-[#A8AAAD]">
                <div class="flex items-center gap-1">
                  <div 
                    class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white"
                    :style="{ backgroundColor: getClassificacaoColor(filmeAtual.classificacao) }"
                  >
                    {{ filmeAtual.classificacao || 'L' }}
                  </div>
                </div>
                <span>•</span>
                <div>{{ filmeAtual.duracao }}min</div>
              </div>

              <p class="text-sm max-h-[4.5rem] overflow-hidden text-gray-200">
                {{ filmeAtual.descricao }}
              </p>

              <div class="flex gap-2 flex-wrap">
                <span
                  v-for="genero in filmeAtual.generos"
                  :key="genero"
                  class="text-xs text-white border border-white/40 rounded-lg px-2 py-1 bg-white/5"
                >
                  {{ genero }}
                </span>
              </div>

              <div class="flex gap-4 mt-4">
                <router-link
                  :to="usuario ? '/filmes' : '/login'"
                  class="flex items-center gap-2 bg-[#2FA36A] border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-[#3BB77C] transition-transform transform active:scale-95"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4l12 8-12 8z"/>
                  </svg>
                  Comprar Ingresso
                </router-link>

                <router-link
                  :to="usuario ? `/filmes` : '/login'"
                  class="bg-gray-600/50 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-transform transform active:scale-95"
                >
                  Saiba mais
                </router-link>
              </div>
            </div>
          </transition>

          <button
            @click="proximoFilme"
            class="text-5xl text-white hover:text-[#2FA36A] transition-transform transform active:scale-90"
          >
            &#10095;
          </button>
        </div>

        <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div
            v-for="(f, index) in filmesExibidos"
            :key="index"
            class="w-8 h-1 rounded-full border border-white/30 transition-colors duration-500 cursor-pointer"
            :class="filmeAtualIndex === index ? 'bg-[#2FA36A]' : 'bg-black/50'"
            @click="filmeAtualIndex = index"
          ></div>
        </div>
      </template>

      <div v-else class="absolute inset-0 z-20 flex items-center justify-center">
        <p class="text-[#A8AAAD] text-lg">Nenhum filme cadastrado no momento.</p>
      </div>
    </div>

    <section v-if="!carregandoInicial && filmes.length > 0" class="max-w-7xl mx-auto px-6 py-10">
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-0.5" style="font-family: 'Poppins', sans-serif;">
          Confira os filmes em cartaz
        </h2>
        <p class="text-sm text-[#A8AAAD]">Escolha seu filme favorito e garanta seu ingresso</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        <router-link
          v-for="filme in filmes"
          :key="filme.id"
          :to="usuario ? `/filmes` : '/login'"
          class="group cursor-pointer block film-card"
        >
          <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-2 shadow-md group-hover:shadow-xl group-hover:shadow-[#2FA36A]/20 transition-all duration-300">
            <img
              v-if="filme.imagemUrl"
              :src="filme.imagemUrl"
              :alt="filme.nome"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="absolute inset-0 bg-gray-800"></div>

            <div
              class="absolute top-2 left-2 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shadow-sm text-white"
              :style="{ backgroundColor: getClassificacaoColor(filme.classificacao) }"
            >
              {{ filme.classificacao || 'L' }}
            </div>

            <div class="absolute inset-0 bg-[#2FA36A]/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <span class="bg-[#2FA36A] px-3 py-1.5 rounded-md text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 shadow-lg text-white">
                Ver Detalhes
              </span>
            </div>
          </div>

          <h3 class="font-semibold text-xs truncate group-hover:text-[#2FA36A] transition-colors duration-200">{{ filme.nome }}</h3>
          <p class="text-[10px] text-[#A8AAAD] mt-0.5 truncate">{{ filme.genero }}</p>
          <p class="text-[#2FA36A] font-bold text-xs mt-0.5">R$ {{ (filme.valorFilme ?? 0).toFixed(2) }}</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsuario } from '../composables/useUsuario'
import { useFilme } from '../composables/useFilme'

const { usuario } = useUsuario()
const { filmes, listarFilmes } = useFilme()

const filmeAtualIndex = ref(0)
const transicao = ref('slide-left')
const carregandoInicial = ref(true)

const filmesExibidos = computed(() => {
  return filmes.value.slice(0, 5)
})

const filmeAtual = computed(() => {
  const f = filmesExibidos.value[filmeAtualIndex.value]
  if (!f) return { nome: '', poster: '', generos: [], duracao: 0, classificacao: '', descricao: '' }
  return {
    ...f,
    poster: f.imagemUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1920&auto=format&fit=crop',
    generos: f.genero ? f.genero.split(',').map(g => g.trim()) : []
  }
})

const proximoFilme = () => {
  if (filmesExibidos.value.length === 0) return
  transicao.value = 'slide-left'
  filmeAtualIndex.value = (filmeAtualIndex.value + 1) % filmesExibidos.value.length
}

const anteriorFilme = () => {
  if (filmesExibidos.value.length === 0) return
  transicao.value = 'slide-right'
  filmeAtualIndex.value = (filmeAtualIndex.value - 1 + filmesExibidos.value.length) % filmesExibidos.value.length
}

onMounted(async () => {
  carregandoInicial.value = true
  await listarFilmes() // Aguarda a resposta da API
  carregandoInicial.value = false // Libera a renderização
})

const getClassificacaoColor = (classificacao?: string): string => {
  const cores: Record<string, string> = {
    'L': '#16a34a', '10': '#3b82f6', '12': '#f59e0b', '14': '#f97316', '16': '#ef4444', '18': '#7c3aed',
  }
  return cores[classificacao || ''] || '#6b7280'
}
</script>

<style scoped>
.slide-left-enter-active, .slide-right-enter-active,
.slide-left-leave-active, .slide-right-leave-active {
  transition: all 0.6s ease-in-out;
}
.slide-left-enter-from { transform: translateX(50px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-50px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-50px); opacity: 0; }
.slide-right-leave-to { transform: translateX(50px); opacity: 0; }
button:active { transform: scale(0.95); }
</style>
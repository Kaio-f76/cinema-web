<template>
  <div class="relative w-full h-screen overflow-hidden select-none">

    <!-- FUNDO IMAGEM DO FILME -->
    <transition :name="transicao" mode="out-in">
      <div
        :key="filmeAtualIndex"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url('${filmeAtual.poster}')` }"
      ></div>
    </transition>

    <!-- SOBREPOSIÇÃO ESCURA -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- CONTEÚDO DO FILME -->
    <div
      class="relative z-10 flex items-center justify-between h-full px-16"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd"
    >

      <!-- SETA ESQUERDA -->
      <button
        @click="anteriorFilme"
        class="text-5xl text-white hover:text-[#2FA36A] transition-transform transform active:scale-90"
      >
        &#10094;
      </button>

      <!-- CARD DO FILME -->
      <transition :name="transicao" mode="out-in">
        <div
          :key="filmeAtualIndex"
          class="flex flex-col justify-center gap-4 max-w-xl text-left text-white bg-black/30 p-6 rounded-2xl transform transition-transform duration-500"
        >
          <!-- EM DESTAQUE -->
          <div class="flex items-center gap-2 w-max bg-[#2FA36A]/30 border border-[#2FA36A] rounded-lg px-3 py-1 text-sm font-semibold text-[#2FA36A]">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.152c.969 0 1.371 1.24.588 1.81l-3.36 2.443a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.538 1.118l-3.36-2.443a1 1 0 00-1.176 0l-3.36 2.443c-.783.57-1.838-.197-1.538-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.073 9.382c-.783-.57-.38-1.81.588-1.81h4.152a1 1 0 00.95-.69l1.286-3.955z"
              />
            </svg>
            Em destaque
          </div>

          <!-- NOME DO FILME -->
          <h2 class="text-3xl font-bold uppercase">{{ filmeAtual.nome }}</h2>

          <!-- CLASSIFICAÇÃO E DURAÇÃO -->
          <div class="flex items-center gap-4 text-sm text-[#A8AAAD]">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4 text-[#2FA36A]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.152c.969 0 1.371 1.24.588 1.81l-3.36 2.443a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.538 1.118l-3.36-2.443a1 1 0 00-1.176 0l-3.36 2.443c-.783.57-1.838-.197-1.538-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.073 9.382c-.783-.57-.38-1.81.588-1.81h4.152a1 1 0 00.95-.69l1.286-3.955z"
                />
              </svg>
              {{ filmeAtual.classificacao }}
            </div>
            <span>•</span>
            <div>{{ filmeAtual.duracao }}min</div>
          </div>

          <!-- RESUMO -->
          <p class="text-sm max-h-[4.5rem] overflow-hidden">
            {{ filmeAtual.resumo }}
          </p>

          <!-- GÊNEROS -->
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="genero in filmeAtual.generos"
              :key="genero"
              class="text-xs text-white border border-white rounded-lg px-2 py-1"
            >
              {{ genero }}
            </span>
          </div>

          <!-- BOTÕES -->
          <div class="flex gap-4 mt-4">
            <!-- Comprar Ingresso -->
            <button
              class="flex items-center gap-2 bg-[#2FA36A] border border-white text-white px-4 py-2 rounded-lg hover:bg-[#3BB77C] transition-transform transform active:scale-95"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4l12 8-12 8z"/>
              </svg>
              Comprar Ingresso
            </button>

            <!-- Saiba Mais -->
            <button
              class="bg-gray-600 border border-white text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-transform transform active:scale-95"
            >
              Saiba mais
            </button>
          </div>

        </div>
      </transition>

      <!-- SETA DIREITA -->
      <button
        @click="proximoFilme"
        class="text-5xl text-white hover:text-[#2FA36A] transition-transform transform active:scale-90"
      >
        &#10095;
      </button>

    </div>

    <!-- BARRINHAS DE PROGRESSO -->
    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
      <div
        v-for="(f, index) in filmes"
        :key="index"
        class="w-8 h-1 rounded-full border border-white transition-colors duration-500"
        :class="filmeAtualIndex === index ? 'bg-[#2FA36A]' : 'bg-black'"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsuario } from '../composables/useUsuario'

const { usuario } = useUsuario()

// Filmes fake
const filmes = ref([
  {
    nome: 'Matrix Resurrections',
    classificacao: '8.5',
    duracao: 152,
    resumo:
      'Neo retorna para um mundo que mistura realidade e ilusão, enfrentando novos desafios e inimigos poderosos.',
    generos: ['Ação', 'Ficção Científica'],
    poster: 'https://picsum.photos/1920/1080?random=1'
  },
  {
    nome: 'Duna',
    classificacao: '8.2',
    duracao: 155,
    resumo:
      'Paul Atreides luta para proteger o futuro de sua família e seu planeta em um conflito intergaláctico épico.',
    generos: ['Aventura', 'Ficção Científica', 'Drama'],
    poster: 'https://picsum.photos/1920/1080?random=2'
  },
  {
    nome: 'O Poderoso Chefão',
    classificacao: '9.2',
    duracao: 175,
    resumo:
      'A saga da família Corleone enquanto eles navegam no mundo do crime e do poder em Nova York.',
    generos: ['Crime', 'Drama'],
    poster: 'https://picsum.photos/1920/1080?random=3'
  }
])

const filmeAtualIndex = ref(0)
const filmeAtual = ref(filmes.value[filmeAtualIndex.value])
const transicao = ref('slide-left')

// Navegação
const proximoFilme = () => {
  transicao.value = 'slide-left'
  filmeAtualIndex.value = (filmeAtualIndex.value + 1) % filmes.value.length
  filmeAtual.value = filmes.value[filmeAtualIndex.value]
}

const anteriorFilme = () => {
  transicao.value = 'slide-right'
  filmeAtualIndex.value = (filmeAtualIndex.value - 1 + filmes.value.length) % filmes.value.length
  filmeAtual.value = filmes.value[filmeAtualIndex.value]
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-enter-active,
.slide-right-enter-active {
  transition: all 0.6s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Botões e setas com animação de clique */
button {
  cursor: pointer;
}
button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-in-out;
}
button:hover {
  transition: transform 0.2s ease-in-out;
}
</style>

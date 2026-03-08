export const GENEROS = [
  'Ação',
  'Aventura',
  'Comédia',
  'Drama',
  'Suspense',
  'Terror',
  'Ficção Científica',
  'Fantasia',
  'Documentário',
  'Policial',
  'Romance',
  'Animação',
  'Musical',
] as const

export type Genero = (typeof GENEROS)[number]

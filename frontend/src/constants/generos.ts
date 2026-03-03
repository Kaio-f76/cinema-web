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
] as const

export type Genero = (typeof GENEROS)[number]

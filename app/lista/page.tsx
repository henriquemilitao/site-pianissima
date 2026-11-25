// /lista — lista de presença da recepção do recital (check-in de alunos e convidados).
// Página escondida: sem link no site nem no telão e fora do Google; só acessa quem tem a URL.

import type { Metadata } from 'next'
import Image from 'next/image'
import { evento } from '../confra2026/programa'
import { familias, totalPessoas } from './convidados'
import { ListaPresenca } from './lista-presenca'

export const metadata: Metadata = {
  title: 'Lista de presença | Pianíssima',
  // Nomes de alunos (muitos menores) e convidados: fora do Google
  robots: { index: false, follow: false },
}

export default function ListaPage() {
  return (
    <main className="min-h-screen bg-[#f6f2eb] text-[#292827]">
      {/* Cabeçalho baixo de propósito: com o teclado aberto, o espaço vai para os resultados */}
      <header className="mx-auto max-w-3xl px-5 pb-4 pt-5 sm:px-8">
        <div className="flex items-center gap-3">
          <Image src="/logopianissima.jpg" alt="Pianíssima" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover" priority />
          <div className="min-w-0">
            <h1 className="font-serif text-[1.7rem] leading-none tracking-[-0.02em]">Lista de presença</h1>
            <p className="mt-1 truncate font-serif text-sm italic text-[#b8863e]">{evento.nome} · {evento.tema}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#6f685f]">Busque o nome e toque em quem chegou.</p>
      </header>

      <ListaPresenca familias={familias} total={totalPessoas} />
    </main>
  )
}

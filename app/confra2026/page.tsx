// /confra2026 — programa online do recital (substitui o programa impresso).
// Página estática: o HTML sai pronto do servidor; só a busca/atalhos rodam no navegador (program-list.tsx).

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, ListMusic } from 'lucide-react'
import { ProgramList } from './program-list'
import { evento, programa, totalApresentacoes } from './programa'

export const metadata: Metadata = {
  metadataBase: new URL('https://pianissima.com.br'),
  title: `${evento.nome} · Programa | Pianíssima`,
  description: `Programa do recital ${evento.nome} — ${evento.tema}. Ordem das apresentações, alunos e músicas.`,
  // Lista com nomes de alunos (muitos menores): acessível pelo link, mas fora do Google
  robots: { index: false, follow: false },
  openGraph: {
    title: `${evento.nome} — ${evento.tema}`,
    description: 'Confira a ordem das apresentações, alunos e músicas.',
    images: ['/logopianissima.jpg'],
  },
}

export default function Confra2026Page() {
  return (
    <main className="min-h-screen bg-[#f6f2eb] text-[#292827]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 pt-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Ir para o site da Pianíssima">
          <Image src="/logopianissima.jpg" alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" priority />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">Pianíssima</span>
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6f685f] hover:text-[#b8863e]">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Site
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-5 pb-6 pt-8 sm:px-8 sm:pt-12">
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#b8863e]">
          <span className="h-px w-8 bg-[#b8863e]" /> Pianíssima apresenta
        </p>
        <h1 className="font-serif text-[2.6rem] leading-[1.02] tracking-[-0.03em] sm:text-6xl">
          {evento.nome.replace(' 2026', '')} <span className="text-[#b8863e]">2026</span>
        </h1>
        <p className="mt-2 font-serif text-2xl italic text-[#b8863e] sm:text-3xl">{evento.tema}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6f685f]">
          <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#b8863e]" aria-hidden /> {evento.data}</span>
          <span className="inline-flex items-center gap-2"><ListMusic className="h-4 w-4 text-[#b8863e]" aria-hidden /> {totalApresentacoes} apresentações</span>
        </div>
      </section>

      <ProgramList programa={programa} />

      <footer className="border-t border-[#e3dacf] px-5 py-10 text-center sm:px-8">
        <p className="font-serif text-2xl">Obrigado pela presença!</p>
        <p className="mt-2 text-sm text-[#7b7268]">Parabéns a todos os alunos.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full border border-[#cfc4b5] px-5 py-2.5 text-sm font-semibold text-[#5e574f] hover:border-[#b8863e] hover:text-[#b8863e]">
          Conheça a Pianíssima
        </Link>
      </footer>
    </main>
  )
}

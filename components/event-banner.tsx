// Faixa no topo da home que leva ao programa do recital (/confra2026).
// Temporária: depois do evento, basta remover <EventBanner /> de app/page.tsx (e o link "Recital 2026" do menu).

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { evento } from '@/app/confra2026/programa'

export function EventBanner() {
  return (
    <Link href="/confra2026" className="group relative z-20 block bg-[#292827] text-[#f8f4ed] transition-colors hover:bg-[#1f1e1d]">
      <span className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-5 py-3 text-xs sm:gap-3 sm:px-8 sm:text-sm lg:px-12">
        {/* ponto pulsando = evento acontecendo (sem animação para quem prefere movimento reduzido) */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#d7a95e] opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d7a95e]" />
        </span>
        <span className="truncate font-semibold">{evento.nome}</span>
        <span className="hidden text-[#bdb5ab] sm:inline">· {evento.tema}</span>
        <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#d7a95e]">
          Ver programa <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  )
}

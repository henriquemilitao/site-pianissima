'use client'

// Lista interativa do programa: busca por aluno/música, atalhos por bloco e destaque do bloco visível.
// É o único trecho client-side da página; o resto é renderizado no servidor (HTML estático).

import { useEffect, useMemo, useRef, useState } from 'react'
import { Drum, Guitar, Piano, Search, Sparkles, X, type LucideIcon } from 'lucide-react'
import type { Apresentacao, Bloco } from './programa'

const icones: Record<Bloco['tipo'], LucideIcon> = { piano: Piano, violao: Guitar, banda: Drum, final: Sparkles }

// Rótulo curto do atalho (ex.: "Piano 1")
const rotulo = (b: Bloco) => (b.parte ? `${b.titulo} ${b.parte.replace('Parte ', '')}` : b.titulo)
const dois = (n: number) => String(n).padStart(2, '0')
// Busca sem acento e sem diferenciar maiúsculas: "agatha" encontra "Ágatha"
const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const textoBusca = (a: Apresentacao) =>
  normalizar([...a.alunos, a.musica ?? '', a.artista ?? '', ...(a.acompanhamento ?? []).map((m) => m.nome)].join(' '))

export function ProgramList({ programa }: { programa: Bloco[] }) {
  const [busca, setBusca] = useState('')
  const [ativo, setAtivo] = useState(programa[0]?.id)
  const atalhosRef = useRef<HTMLDivElement>(null)

  // Filtra mantendo a ordem; blocos sem resultado somem
  const termo = normalizar(busca.trim())
  const blocos = useMemo(
    () => programa
      .map((b) => ({ ...b, apresentacoes: termo ? b.apresentacoes.filter((a) => textoBusca(a).includes(termo)) : b.apresentacoes }))
      .filter((b) => b.apresentacoes.length > 0),
    [programa, termo],
  )
  const resultados = blocos.reduce((t, b) => t + b.apresentacoes.length, 0)

  // Marca o atalho do bloco que está na tela (orientação durante o recital)
  useEffect(() => {
    const secoes = programa.map((b) => document.getElementById(b.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visivel) setAtivo(visivel.target.id)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    secoes.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [programa, blocos])

  // Mantém o atalho ativo visível na barra horizontal (sem rolar a página)
  useEffect(() => {
    const barra = atalhosRef.current
    const chip = barra?.querySelector<HTMLElement>(`[data-id="${ativo}"]`)
    if (barra && chip) barra.scrollTo({ left: chip.offsetLeft - 20, behavior: 'smooth' })
  }, [ativo])

  return (
    <>
      {/* Barra fixa: busca + atalhos dos blocos */}
      <div className="sticky top-0 z-20 border-b border-[#e3dacf] bg-[#f6f2eb]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f6f2eb]/80">
        <div className="mx-auto max-w-3xl px-5 pb-3 pt-3 sm:px-8">
          <label htmlFor="busca" className="sr-only">Buscar aluno ou música</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f877d]" aria-hidden />
            <input
              id="busca"
              type="search"
              inputMode="search"
              autoComplete="off"
              placeholder="Buscar aluno ou música"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-11 w-full rounded-full border border-[#ded3c5] bg-[#faf7f2] pl-11 pr-11 text-base text-[#292827] outline-none transition-colors placeholder:text-[#a39a8f] focus:border-[#b8863e] focus:ring-2 focus:ring-[#b8863e]/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {busca && (
              <button type="button" onClick={() => setBusca('')} aria-label="Limpar busca"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6f685f] hover:bg-[#efe9df]">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav aria-label="Blocos do programa">
            <div ref={atalhosRef} className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
              {programa.map((b) => {
                const Icone = icones[b.tipo]
                const selecionado = ativo === b.id
                return (
                  <a key={b.id} href={`#${b.id}`} data-id={b.id} aria-current={selecionado ? 'true' : undefined}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      selecionado ? 'border-[#292827] bg-[#292827] text-[#f8f4ed]' : 'border-[#ded3c5] bg-[#faf7f2] text-[#5e574f] hover:border-[#b8863e] hover:text-[#b8863e]'}`}>
                    <Icone className={`h-3.5 w-3.5 ${selecionado ? 'text-[#d7a95e]' : 'text-[#b8863e]'}`} aria-hidden />
                    {rotulo(b)}
                  </a>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8">
        {termo && (
          <p className="mb-2 text-sm text-[#7b7268]" aria-live="polite">
            {resultados === 0 ? 'Nenhuma apresentação encontrada.' : `${resultados} ${resultados === 1 ? 'apresentação encontrada' : 'apresentações encontradas'}`}
          </p>
        )}
        {resultados === 0 && (
          <button type="button" onClick={() => setBusca('')} className="mt-2 rounded-full border border-[#cfc4b5] px-5 py-2.5 text-sm font-semibold text-[#5e574f] hover:border-[#b8863e] hover:text-[#b8863e]">
            Ver programa completo
          </button>
        )}

        {blocos.map((b) => (b.tipo === 'final' ? <Final key={b.id} bloco={b} /> : <BlocoLista key={b.id} bloco={b} />))}
      </div>
    </>
  )
}

function CabecalhoBloco({ bloco }: { bloco: Bloco }) {
  const Icone = icones[bloco.tipo]
  const faixas = bloco.apresentacoes.map((a) => a.faixa)
  const intervalo = faixas.length > 1 ? `Faixas ${dois(faixas[0])}–${dois(faixas[faixas.length - 1])}` : `Faixa ${dois(faixas[0])}`
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[#292827] pb-3">
      <h2 id={`${bloco.id}-titulo`} className="flex items-center gap-3 font-serif text-[1.75rem] leading-none tracking-[-0.02em] text-[#292827]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b8863e]/12 text-[#b8863e]"><Icone className="h-[18px] w-[18px]" aria-hidden /></span>
        <span>{bloco.titulo}{bloco.parte && <em className="font-normal text-[#b8863e]"> {bloco.parte.toLowerCase()}</em>}</span>
      </h2>
      <span className="shrink-0 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f877d]">{intervalo}</span>
    </div>
  )
}

function BlocoLista({ bloco }: { bloco: Bloco }) {
  return (
    <section id={bloco.id} aria-labelledby={`${bloco.id}-titulo`} className="scroll-mt-32 pt-8">
      <CabecalhoBloco bloco={bloco} />
      <ol className="divide-y divide-[#e3dacf]">
        {bloco.apresentacoes.map((a) => (
          <li key={a.faixa} className="flex gap-4 py-4">
            <span className="w-7 shrink-0 pt-0.5 font-serif text-lg leading-none tabular-nums text-[#b8863e]" aria-label={`Faixa ${a.faixa}`}>{dois(a.faixa)}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-snug text-[#292827]">{a.alunos.join(' & ')}</p>
              {a.musica
                ? <p className="mt-1 font-serif text-[17px] leading-snug text-[#514b44]">{a.musica}{a.artista && <span className="font-sans text-[13px] text-[#8f877d]"> · {a.artista}</span>}</p>
                : <p className="mt-1 font-serif text-[15px] italic text-[#a39a8f]">Música a definir</p>}
              {a.acompanhamento && (
                <p className="mt-2 text-xs leading-relaxed text-[#8f877d]">
                  <span className="font-semibold uppercase tracking-[0.12em] text-[#a39a8f]">Banda </span>
                  {a.acompanhamento.map((m) => `${m.instrumento}: ${m.nome}`).join(' · ')}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

// Encerramento em destaque (cartão escuro, mesma linguagem das seções escuras da home)
function Final({ bloco }: { bloco: Bloco }) {
  const a = bloco.apresentacoes[0]
  return (
    <section id={bloco.id} aria-labelledby="final-titulo" className="scroll-mt-32 pt-10">
      <div className="rounded-[1.5rem] bg-[#292827] p-6 text-[#f8f4ed] sm:p-8">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d7a95e]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Faixa {dois(a.faixa)} · Grande final
        </p>
        <h2 id="final-titulo" className="mt-4 font-serif text-3xl leading-tight tracking-[-0.02em]">{a.musica}</h2>
        {a.artista && <p className="mt-1 text-sm text-[#bdb5ab]">{a.artista}</p>}
        <p className="mt-6 border-t border-white/15 pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#bdb5ab]">{a.alunos[0]}</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
          {a.acompanhamento?.map((m) => (
            <div key={m.instrumento} className="contents">
              <dt className="text-[#d7a95e]">{m.instrumento}</dt>
              <dd className="text-[#f8f4ed]">{m.nome}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

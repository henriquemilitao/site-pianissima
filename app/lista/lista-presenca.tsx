'use client'

// Check-in da recepção: busca aluno ou convidado, marca quem chegou com um toque e mostra a contagem.
// Avulsos (quem chega na hora) entram pelo cartão do aluno. Estado e sincronização: use-sincronizacao.ts.

import { useMemo, useRef, useState, type ReactNode } from 'react'
import { Check, CheckCheck, Pencil, Plus, Search, Undo2, X } from 'lucide-react'
import { normalizar, STATUS, type Familia, type Pessoa, type Status } from './convidados'
import { FormAvulso } from './form-avulso'
import { useSincronizacao, type Avulsos, type Marcas, type Modo } from './use-sincronizacao'

const CORES_STATUS: Record<Status, string> = {
  pago: 'bg-[#e6f0e9] text-[#2f7a4b]',
  depois: 'bg-[#fdebd8] text-[#b45309]',
  cortesia: 'bg-[#f3e9d6] text-[#8a6424]',
}
const hora = (ms: number) => new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
const novoId = () => `avulso-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

// Junta os avulsos no fim dos convidados do cartão onde foram adicionados, na ordem em que chegaram
function comAvulsos(familias: Familia[], avulsos: Avulsos): Familia[] {
  const porCartao = new Map<string, Pessoa[]>()
  for (const [id, a] of Object.entries(avulsos).sort(([, x], [, y]) => x.criadoEm - y.criadoEm)) {
    const pessoas = porCartao.get(a.familia) ?? []
    pessoas.push({ id, nome: a.nome, titular: false, busca: normalizar(a.nome), status: a.status, avulso: true })
    porCartao.set(a.familia, pessoas)
  }
  return familias.map((f) => (porCartao.has(f.id) ? { ...f, pessoas: [...f.pessoas, ...porCartao.get(f.id)!] } : f))
}

export function ListaPresenca({ familias: lista }: { familias: Familia[] }) {
  const { marcas, avulsos, pronto, modo, online, pendentes, mudar, zerar } = useSincronizacao()
  const [busca, setBusca] = useState('')
  const [desfazer, setDesfazer] = useState<string[] | null>(null) // ids do último "Marcar todos"
  const [form, setForm] = useState<{ familia: Familia; id?: string } | null>(null) // sem id = adicionar avulso
  const topoBarraRef = useRef<HTMLDivElement>(null)

  const familias = useMemo(() => comAvulsos(lista, avulsos), [lista, avulsos])
  const total = familias.reduce((t, f) => t + f.pessoas.length, 0)
  const chegaram = familias.reduce((t, f) => t + f.pessoas.filter((p) => marcas[p.id]).length, 0)

  // Todas as palavras digitadas precisam estar no nome da mesma pessoa; cartões em que o titular bate vêm primeiro
  const termos = normalizar(busca).split(/\s+/).filter(Boolean)
  const buscando = termos.length > 0
  const encontrou = (p: Pessoa) => buscando && termos.every((t) => p.busca.includes(t))
  const titularBate = (f: Familia) => f.pessoas.some((p) => p.titular && encontrou(p))
  const visiveis = buscando
    ? [...familias.filter(titularBate), ...familias.filter((f) => !titularBate(f) && f.pessoas.some(encontrou))]
    : familias

  const alternar = (id: string) => mudar({ marcas: { [id]: marcas[id] ? null : Date.now() } })

  const marcarTodos = (f: Familia) => {
    const agora = Date.now()
    const ids = f.pessoas.filter((p) => !marcas[p.id]).map((p) => p.id)
    mudar({ marcas: Object.fromEntries(ids.map((id) => [id, agora])) })
    setDesfazer(ids)
  }

  const desfazerUltimo = () => {
    mudar({ marcas: Object.fromEntries((desfazer ?? []).map((id) => [id, null])) })
    setDesfazer(null)
  }

  // Avulso novo já entra como "chegou"; na edição só muda nome e pagamento
  const salvarAvulso = (dados: { nome: string; status: Status }) => {
    if (!form) return
    if (form.id) {
      const atual = avulsos[form.id]
      if (atual) mudar({ avulsos: { [form.id]: { ...atual, ...dados } } })
    } else {
      const id = novoId()
      const agora = Date.now()
      mudar({ avulsos: { [id]: { ...dados, familia: form.familia.id, criadoEm: agora } }, marcas: { [id]: agora } })
    }
    setForm(null)
  }

  const removerAvulso = () => {
    if (!form?.id || !window.confirm(`Remover ${avulsos[form.id]?.nome ?? 'este avulso'} da lista?`)) return
    mudar({ avulsos: { [form.id]: null }, marcas: { [form.id]: null } })
    setForm(null)
  }

  // Ao focar a busca, tira o cabeçalho da tela para sobrar espaço aos resultados com o teclado aberto
  const subirBarra = () => {
    const topo = topoBarraRef.current?.getBoundingClientRect().top ?? 0
    if (topo > 0) window.scrollBy({ top: topo })
  }

  const buscar = (texto: string) => {
    setBusca(texto)
    setDesfazer(null) // o "Desfazer" vale só para o cartão que estava na tela
  }

  // Para depois dos testes. No modo compartilhado apaga de todos os aparelhos, por isso pede confirmação digitada.
  const confirmarZerar = async () => {
    if (modo === 'compartilhado') {
      const resposta = window.prompt('Isso apaga as marcações e os avulsos de TODOS os aparelhos. Digite ZERAR para confirmar.')
      if (resposta?.trim().toUpperCase() !== 'ZERAR') return
    } else if (!window.confirm('Apagar as marcações e os avulsos deste aparelho?')) {
      return
    }
    try {
      await zerar()
      setDesfazer(null)
    } catch {
      window.alert('Sem conexão. Tente de novo.')
    }
  }

  return (
    <>
      <p className="mx-auto max-w-3xl px-5 pb-4 text-sm text-[#6f685f] sm:px-8">{total} pessoas · busque e toque em quem chegou.</p>

      {/* Barra fixa: contagem + busca */}
      <div ref={topoBarraRef} />
      <div className="sticky top-0 z-20 border-b border-[#e3dacf] bg-[#f6f2eb]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f6f2eb]/80">
        <div className="mx-auto max-w-3xl px-5 pb-3 pt-3 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="flex items-baseline gap-5">
              <Contador valor={chegaram} rotulo="chegaram" pronto={pronto} cor="text-[#2f7a4b]" />
              <Contador valor={total - chegaram} rotulo="faltam" pronto={pronto} />
            </p>
            <StatusConexao modo={modo} online={online} pendentes={pendentes} />
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e3dacf]" role="progressbar" aria-label="Chegaram"
            aria-valuemin={0} aria-valuemax={total} aria-valuenow={chegaram}>
            <div className="h-full rounded-full bg-[#2f7a4b] transition-[width] duration-300" style={{ width: `${(chegaram / total) * 100}%` }} />
          </div>

          <label htmlFor="busca" className="sr-only">Buscar aluno ou convidado</label>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f877d]" aria-hidden />
            <input
              id="busca"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Buscar aluno ou convidado"
              value={busca}
              onChange={(e) => buscar(e.target.value)}
              onFocus={subirBarra}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} // fecha o teclado para ver o cartão inteiro
              className="h-11 w-full rounded-full border border-[#ded3c5] bg-[#faf7f2] pl-11 pr-12 text-base text-[#292827] outline-none transition-colors placeholder:text-[#a39a8f] focus:border-[#b8863e] focus:ring-2 focus:ring-[#b8863e]/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {busca && (
              <button type="button" onClick={() => buscar('')} aria-label="Limpar busca"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6f685f] hover:bg-[#efe9df]">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* min-h: mesmo com poucos resultados dá para rolar o cabeçalho para fora da tela */}
      <div className="mx-auto min-h-svh max-w-3xl px-5 pb-24 pt-5 sm:px-8">
        {buscando && visiveis.length === 0 && (
          <div className="rounded-2xl border border-[#e8cf9f] bg-[#fbf3e4] p-5" aria-live="polite">
            <p className="font-semibold text-[#292827]">Ninguém com “{busca.trim()}” na lista</p>
            <p className="mt-1 text-sm leading-relaxed text-[#6f685f]">
              Tente outra grafia ou busque o aluno e use “Adicionar avulso” no cartão dele.
            </p>
            <button type="button" onClick={() => buscar('')}
              className="mt-4 rounded-full border border-[#cfc4b5] bg-white px-5 py-2.5 text-sm font-semibold text-[#5e574f] hover:border-[#b8863e] hover:text-[#b8863e]">
              Limpar busca
            </button>
          </div>
        )}

        <ul className="space-y-4">
          {visiveis.map((f) => (
            <CartaoFamilia
              key={f.id}
              familia={f}
              marcas={marcas}
              destacar={encontrou}
              onAlternar={alternar}
              onMarcarTodos={() => marcarTodos(f)}
              onAdicionar={() => setForm({ familia: f })}
              onEditar={(id) => setForm({ familia: f, id })}
            />
          ))}
        </ul>

        {!buscando && (
          <footer className="mt-12 border-t border-[#e3dacf] pt-6 text-center">
            <p className="text-xs text-[#8f877d]">
              {modo === 'compartilhado'
                ? 'As marcações aparecem em todos os aparelhos com esta página aberta.'
                : 'As marcações ficam salvas neste aparelho.'}
            </p>
            <button type="button" onClick={confirmarZerar}
              className="mt-3 rounded-full border border-[#ded3c5] px-4 py-2 text-xs font-semibold text-[#8f877d] hover:border-[#b4483c] hover:text-[#b4483c]">
              Zerar marcações e avulsos
            </button>
          </footer>
        )}
      </div>

      {/* Rede de segurança para o "Marcar todos" */}
      {desfazer && (
        <div className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex justify-center px-4">
          <div role="status" className="flex items-center gap-4 rounded-full bg-[#292827] py-2 pl-5 pr-2 text-sm text-[#f8f4ed] shadow-lg shadow-black/20">
            {desfazer.length} {desfazer.length === 1 ? 'pessoa marcada' : 'pessoas marcadas'}
            <button type="button" onClick={desfazerUltimo}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 font-semibold text-[#d7a95e] hover:bg-white/15">
              <Undo2 className="h-4 w-4" aria-hidden /> Desfazer
            </button>
          </div>
        </div>
      )}

      {form && (
        <FormAvulso
          key={form.id ?? `novo-${form.familia.id}`}
          titular={form.familia.pessoas.filter((p) => p.titular).map((p) => p.nome).join(' e ')}
          inicial={form.id ? avulsos[form.id] : undefined}
          onSalvar={salvarAvulso}
          onRemover={form.id ? removerAvulso : undefined}
          onFechar={() => setForm(null)}
        />
      )}
    </>
  )
}

function Contador({ valor, rotulo, pronto, cor = 'text-[#292827]' }: { valor: number; rotulo: string; pronto: boolean; cor?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <strong className={`font-serif text-[1.75rem] leading-none tabular-nums ${cor}`}>{pronto ? valor : '–'}</strong>
      <span className="text-sm text-[#6f685f]">{rotulo}</span>
    </span>
  )
}

// Indicador discreto: mostra se a lista está sincronizando entre aparelhos ou só salva neste
function StatusConexao({ modo, online, pendentes }: { modo: Modo; online: boolean; pendentes: number }) {
  const [cor, texto] =
    modo === 'local' ? ['bg-[#a39a8f]', 'Só neste aparelho']
    : !online ? ['bg-[#c2410c]', pendentes ? `Sem conexão (${pendentes})` : 'Sem conexão']
    : modo === 'compartilhado' ? ['bg-[#2f7a4b]', 'Sincronizado']
    : ['bg-[#a39a8f]', 'Conectando…']
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#6f685f]">
      <span className={`h-2 w-2 rounded-full ${cor}`} aria-hidden /> {texto}
    </span>
  )
}

type CartaoProps = {
  familia: Familia
  marcas: Marcas
  destacar: (p: Pessoa) => boolean
  onAlternar: (id: string) => void
  onMarcarTodos: () => void
  onAdicionar: () => void
  onEditar: (id: string) => void
}

// Um cartão por aluno (ou irmãos, ou professor): titulares no topo, convidados e avulsos abaixo
function CartaoFamilia({ familia, marcas, destacar, onAlternar, onMarcarTodos, onAdicionar, onEditar }: CartaoProps) {
  const titulares = familia.pessoas.filter((p) => p.titular)
  const convidados = familia.pessoas.filter((p) => !p.titular)
  const todosChegaram = familia.pessoas.every((p) => marcas[p.id])
  const linha = (p: Pessoa) => (
    <Linha key={p.id} pessoa={p} chegou={marcas[p.id]} destaque={destacar(p)} onAlternar={() => onAlternar(p.id)}
      onEditar={p.avulso ? () => onEditar(p.id) : undefined} />
  )

  return (
    <li className="overflow-hidden rounded-2xl border border-[#e3dacf] bg-[#fffdf9] shadow-[0_1px_2px_rgba(41,40,39,0.04)]">
      <ul className="divide-y divide-[#f0e9df]">{titulares.map(linha)}</ul>
      <div className="flex min-h-11 items-center justify-between gap-3 border-y border-[#efe7dc] bg-[#faf7f2] py-1.5 pl-4 pr-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f877d]">Convidados ({convidados.length})</span>
        {convidados.length > 0 && (todosChegaram ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2f7a4b]">
            <CheckCheck className="h-4 w-4" aria-hidden /> Todos chegaram
          </span>
        ) : (
          <button type="button" onClick={onMarcarTodos}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#cfc4b5] bg-white px-3 py-1.5 text-xs font-semibold text-[#5e574f] hover:border-[#2f7a4b] hover:text-[#2f7a4b] active:bg-[#eef5f0]">
            <CheckCheck className="h-4 w-4" aria-hidden /> Marcar todos
          </button>
        ))}
      </div>
      <ul className="divide-y divide-[#f0e9df]">
        {convidados.map(linha)}
        <li>
          <button type="button" onClick={onAdicionar}
            className="flex min-h-[52px] w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-[#8a6424] hover:bg-[#faf7f2] active:bg-[#f3ede4]">
            <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#d9c7a4]">
              <Plus className="h-4 w-4" />
            </span>
            Adicionar avulso
          </button>
        </li>
      </ul>
    </li>
  )
}

function Etiqueta({ className, children }: { className: string; children: ReactNode }) {
  // inline-block: não herda o risco do nome de quem já chegou
  return <span className={`ml-2 inline-block rounded-full px-2 py-0.5 align-middle font-sans text-[11px] font-semibold ${className}`}>{children}</span>
}

type LinhaProps = { pessoa: Pessoa; chegou?: number; destaque: boolean; onAlternar: () => void; onEditar?: () => void }

// Linha inteira é o alvo do toque (marca/desmarca e mostra o horário); avulsos têm um lápis para editar
function Linha({ pessoa, chegou, destaque, onAlternar, onEditar }: LinhaProps) {
  return (
    <li className={`flex items-stretch ${destaque ? 'bg-[#b8863e]/10' : ''}`}>
      <button type="button" role="checkbox" aria-checked={Boolean(chegou)} onClick={onAlternar}
        className="flex min-h-[52px] min-w-0 flex-1 items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-[#efe9df]">
        <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          chegou ? 'border-[#2f7a4b] bg-[#2f7a4b] text-white' : 'border-[#cfc4b5] bg-white'}`}>
          {chegou && <Check className="h-4 w-4" strokeWidth={3} />}
        </span>
        <span className={`min-w-0 flex-1 leading-snug ${pessoa.titular ? 'font-serif text-[18px]' : 'text-[15px]'} ${
          chegou ? 'text-[#8f877d] line-through decoration-[#2f7a4b]/50' : 'text-[#292827]'}`}>
          {pessoa.nome}
          {pessoa.obs && <Etiqueta className="bg-[#efe9df] text-[#6f685f]">{pessoa.obs}</Etiqueta>}
          {pessoa.status && <Etiqueta className={CORES_STATUS[pessoa.status]}>{STATUS[pessoa.status]}</Etiqueta>}
          {pessoa.avulso && <Etiqueta className="border border-dashed border-[#cfc4b5] text-[#8f877d]">avulso</Etiqueta>}
        </span>
        {chegou && <span className="shrink-0 text-xs tabular-nums text-[#8f877d]">{hora(chegou)}</span>}
      </button>
      {onEditar && (
        <button type="button" onClick={onEditar} aria-label={`Editar ${pessoa.nome}`}
          className="flex w-11 shrink-0 items-center justify-center text-[#8f877d] hover:text-[#292827] active:bg-[#efe9df]">
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </li>
  )
}

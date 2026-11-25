'use client'

// Check-in da recepção: busca aluno ou convidado, marca quem chegou com um toque e mostra a contagem.
// Com o Redis configurado (app/api/lista), as marcações sincronizam entre aparelhos a cada 3 s; sem ele,
// ficam só neste aparelho. O que for marcado sem internet espera numa fila e é enviado quando a conexão volta.

import { useEffect, useRef, useState } from 'react'
import { Check, CheckCheck, Search, Undo2, X } from 'lucide-react'
import { normalizar, type Familia, type Pessoa } from './convidados'

const CHAVE = 'pianissima:lista-confra2026' // cópia local das marcações
const CHAVE_FILA = 'pianissima:lista-confra2026:fila' // mudanças ainda não enviadas ao servidor
const INTERVALO = 3000 // ms entre sincronizações

type Marcas = Record<string, number> // id da pessoa → horário de chegada (ms)
type Mudancas = Record<string, number | null> // null = desmarcar
type Modo = 'conectando' | 'local' | 'compartilhado'

const ler = <T,>(chave: string, padrao: T): T => {
  try {
    return (JSON.parse(localStorage.getItem(chave) ?? 'null') as T) ?? padrao
  } catch {
    return padrao
  }
}
const gravar = (chave: string, valor: unknown) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // Armazenamento indisponível: segue funcionando só em memória
  }
}
const aplicar = (base: Marcas, mudancas: Mudancas): Marcas => {
  const novo = { ...base }
  for (const [id, ts] of Object.entries(mudancas)) {
    if (ts === null) delete novo[id]
    else novo[id] = ts
  }
  return novo
}
const hora = (ms: number) => new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export function ListaPresenca({ familias, total }: { familias: Familia[]; total: number }) {
  const [marcas, setMarcas] = useState<Marcas>({})
  const [pronto, setPronto] = useState(false) // só grava depois de ler o que já estava salvo
  const [modo, setModo] = useState<Modo>('conectando')
  const [online, setOnline] = useState(true) // a última conversa com o servidor deu certo
  const [pendentes, setPendentes] = useState(0) // mudanças na fila esperando conexão
  const [busca, setBusca] = useState('')
  const [desfazer, setDesfazer] = useState<string[] | null>(null) // ids do último "Marcar todos"
  const fila = useRef<Mudancas>({})
  const sincronizar = useRef<() => void>(() => {})
  const topoBarraRef = useRef<HTMLDivElement>(null)

  const guardarFila = () => {
    gravar(CHAVE_FILA, fila.current)
    setPendentes(Object.keys(fila.current).length)
  }

  // Carrega a cópia local e conversa com o servidor: envia a fila e traz o que os outros aparelhos marcaram
  useEffect(() => {
    setMarcas(ler(CHAVE, {}))
    fila.current = ler(CHAVE_FILA, {})
    setPendentes(Object.keys(fila.current).length)
    setPronto(true)

    let modoAtual: Modo = 'conectando'
    let ocupado = false
    let parado = false

    const ciclo = async () => {
      if (parado || ocupado || modoAtual === 'local') return
      ocupado = true
      const envio = { ...fila.current }
      const temEnvio = Object.keys(envio).length > 0
      let deuCerto = false
      try {
        const res = await fetch('/api/lista', {
          cache: 'no-store',
          ...(temEnvio && { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mudancas: envio }) }),
        })
        if (!res.ok) throw new Error(String(res.status))
        const dados = (await res.json()) as { modo: Modo; marcas?: Marcas }
        if (parado) return
        modoAtual = dados.modo
        setModo(dados.modo)
        // Sai da fila o que foi enviado e não mudou de novo enquanto isso
        for (const [id, ts] of Object.entries(envio)) if (fila.current[id] === ts) delete fila.current[id]
        if (dados.modo === 'local') fila.current = {} // servidor sem banco: tudo fica só neste aparelho
        else setMarcas(aplicar(dados.marcas ?? {}, fila.current))
        guardarFila()
        setOnline(true)
        deuCerto = true
      } catch {
        if (!parado) setOnline(false)
      } finally {
        ocupado = false
      }
      // Entrou mudança durante o envio: manda logo, sem esperar o próximo ciclo
      if (deuCerto && Object.keys(fila.current).length) void ciclo()
    }
    sincronizar.current = () => void ciclo()

    void ciclo()
    const timer = setInterval(() => document.visibilityState === 'visible' && void ciclo(), INTERVALO)
    const aoVoltar = () => document.visibilityState === 'visible' && void ciclo()
    const outraAba = (e: StorageEvent) => e.key === CHAVE && setMarcas(ler(CHAVE, {}))
    document.addEventListener('visibilitychange', aoVoltar)
    window.addEventListener('storage', outraAba)
    return () => {
      parado = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', aoVoltar)
      window.removeEventListener('storage', outraAba)
    }
  }, [])

  useEffect(() => {
    if (pronto) gravar(CHAVE, marcas)
  }, [marcas, pronto])

  // O "Desfazer" some sozinho depois de alguns segundos
  useEffect(() => {
    if (!desfazer) return
    const t = setTimeout(() => setDesfazer(null), 6000)
    return () => clearTimeout(t)
  }, [desfazer])

  const chegaram = familias.reduce((t, f) => t + f.pessoas.filter((p) => marcas[p.id]).length, 0)

  // Todas as palavras digitadas precisam estar no nome da mesma pessoa; famílias em que o aluno bate vêm primeiro
  const termos = normalizar(busca).split(/\s+/).filter(Boolean)
  const buscando = termos.length > 0
  const encontrou = (p: Pessoa) => buscando && termos.every((t) => p.busca.includes(t))
  const alunoBate = (f: Familia) => f.pessoas.some((p) => p.aluno && encontrou(p))
  const visiveis = buscando
    ? [...familias.filter(alunoBate), ...familias.filter((f) => !alunoBate(f) && f.pessoas.some(encontrou))]
    : familias

  // Aplica na tela na hora; no modo compartilhado também entra na fila e é enviado em seguida
  const mudar = (mudancas: Mudancas) => {
    setMarcas((m) => aplicar(m, mudancas))
    if (modo === 'local') return
    Object.assign(fila.current, mudancas)
    guardarFila()
    sincronizar.current()
  }

  const alternar = (id: string) => mudar({ [id]: marcas[id] ? null : Date.now() })

  const marcarTodos = (f: Familia) => {
    const agora = Date.now()
    const ids = f.pessoas.filter((p) => !marcas[p.id]).map((p) => p.id)
    mudar(Object.fromEntries(ids.map((id) => [id, agora])))
    setDesfazer(ids)
  }

  const desfazerUltimo = () => {
    mudar(Object.fromEntries((desfazer ?? []).map((id) => [id, null])))
    setDesfazer(null)
  }

  // Ao focar a busca, tira o cabeçalho da tela para sobrar espaço aos resultados com o teclado aberto
  const subirBarra = () => {
    const topo = topoBarraRef.current?.getBoundingClientRect().top ?? 0
    if (topo > 0) window.scrollBy({ top: topo })
  }

  const buscar = (texto: string) => {
    setBusca(texto)
    setDesfazer(null) // o "Desfazer" vale só para a família que estava na tela
  }

  // Para depois dos testes. No modo compartilhado apaga de todos os aparelhos, por isso pede confirmação digitada.
  const zerar = async () => {
    if (modo === 'compartilhado') {
      const confirmacao = window.prompt('Isso apaga as marcações de TODOS os aparelhos. Digite ZERAR para confirmar.')
      if (confirmacao?.trim().toUpperCase() !== 'ZERAR') return
      try {
        const res = await fetch('/api/lista', {
          method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ zerar: true }),
        })
        if (!res.ok) throw new Error(String(res.status))
      } catch {
        window.alert('Sem conexão. Tente de novo.')
        return
      }
      fila.current = {}
      guardarFila()
    } else if (!window.confirm('Apagar todas as marcações deste aparelho?')) {
      return
    }
    setMarcas({})
    setDesfazer(null)
  }

  return (
    <>
      {/* Barra fixa: contagem + busca */}
      <div ref={topoBarraRef} />
      <div className="sticky top-0 z-20 border-b border-[#e3dacf] bg-[#f6f2eb]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f6f2eb]/80">
        <div className="mx-auto max-w-3xl px-5 pb-3 pt-3 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="flex items-baseline gap-5">
              <Contador valor={chegaram} rotulo="chegaram" pronto={pronto} cor="text-[#2f7a4b]" />
              <Contador valor={total - chegaram} rotulo="faltam" pronto={pronto} />
            </p>
            <Status modo={modo} online={online} pendentes={pendentes} />
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
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} // fecha o teclado para ver a família inteira
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
              Tente outra grafia ou o nome do aluno. Se não estiver na lista, a entrada é avulsa.
            </p>
            <button type="button" onClick={() => buscar('')}
              className="mt-4 rounded-full border border-[#cfc4b5] bg-white px-5 py-2.5 text-sm font-semibold text-[#5e574f] hover:border-[#b8863e] hover:text-[#b8863e]">
              Limpar busca
            </button>
          </div>
        )}

        <ul className="space-y-4">
          {visiveis.map((f) => (
            <CartaoFamilia key={f.id} familia={f} marcas={marcas} destacar={encontrou} onAlternar={alternar} onMarcarTodos={() => marcarTodos(f)} />
          ))}
        </ul>

        {!buscando && (
          <footer className="mt-12 border-t border-[#e3dacf] pt-6 text-center">
            <p className="text-xs text-[#8f877d]">
              {modo === 'compartilhado'
                ? 'As marcações aparecem em todos os aparelhos com esta página aberta.'
                : 'As marcações ficam salvas neste aparelho.'}
            </p>
            <button type="button" onClick={zerar}
              className="mt-3 rounded-full border border-[#ded3c5] px-4 py-2 text-xs font-semibold text-[#8f877d] hover:border-[#b4483c] hover:text-[#b4483c]">
              Zerar marcações
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
function Status({ modo, online, pendentes }: { modo: Modo; online: boolean; pendentes: number }) {
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
}

// Um cartão por aluno (ou irmãos): alunos no topo, convidados abaixo
function CartaoFamilia({ familia, marcas, destacar, onAlternar, onMarcarTodos }: CartaoProps) {
  const alunos = familia.pessoas.filter((p) => p.aluno)
  const convidados = familia.pessoas.filter((p) => !p.aluno)
  const todosChegaram = familia.pessoas.every((p) => marcas[p.id])
  const linha = (p: Pessoa) => (
    <Linha key={p.id} pessoa={p} chegou={marcas[p.id]} destaque={destacar(p)} onAlternar={() => onAlternar(p.id)} />
  )

  return (
    <li className="overflow-hidden rounded-2xl border border-[#e3dacf] bg-[#fffdf9] shadow-[0_1px_2px_rgba(41,40,39,0.04)]">
      <ul className="divide-y divide-[#f0e9df]">{alunos.map(linha)}</ul>
      {convidados.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-3 border-y border-[#efe7dc] bg-[#faf7f2] py-1.5 pl-4 pr-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f877d]">Convidados ({convidados.length})</span>
            {todosChegaram ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2f7a4b]">
                <CheckCheck className="h-4 w-4" aria-hidden /> Todos chegaram
              </span>
            ) : (
              <button type="button" onClick={onMarcarTodos}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#cfc4b5] bg-white px-3 py-1.5 text-xs font-semibold text-[#5e574f] hover:border-[#2f7a4b] hover:text-[#2f7a4b] active:bg-[#eef5f0]">
                <CheckCheck className="h-4 w-4" aria-hidden /> Marcar todos
              </button>
            )}
          </div>
          <ul className="divide-y divide-[#f0e9df]">{convidados.map(linha)}</ul>
        </>
      )}
    </li>
  )
}

// Linha inteira é o alvo do toque: marca/desmarca e mostra o horário de chegada
function Linha({ pessoa, chegou, destaque, onAlternar }: { pessoa: Pessoa; chegou?: number; destaque: boolean; onAlternar: () => void }) {
  return (
    <li>
      <button type="button" role="checkbox" aria-checked={Boolean(chegou)} onClick={onAlternar}
        className={`flex min-h-[52px] w-full items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-[#efe9df] ${destaque ? 'bg-[#b8863e]/10' : ''}`}>
        <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          chegou ? 'border-[#2f7a4b] bg-[#2f7a4b] text-white' : 'border-[#cfc4b5] bg-white'}`}>
          {chegou && <Check className="h-4 w-4" strokeWidth={3} />}
        </span>
        <span className={`min-w-0 flex-1 leading-snug ${pessoa.aluno ? 'font-serif text-[18px]' : 'text-[15px]'} ${
          chegou ? 'text-[#8f877d] line-through decoration-[#2f7a4b]/50' : 'text-[#292827]'}`}>
          {pessoa.nome}
          {pessoa.obs && (
            <span className="ml-2 inline-block rounded-full bg-[#efe9df] px-2 py-0.5 align-middle font-sans text-[11px] font-semibold text-[#6f685f]">{pessoa.obs}</span>
          )}
        </span>
        {chegou && <span className="shrink-0 text-xs tabular-nums text-[#8f877d]">{hora(chegou)}</span>}
      </button>
    </li>
  )
}

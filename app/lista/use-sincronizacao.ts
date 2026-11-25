'use client'

// Estado da lista (quem chegou + avulsos): salvo no aparelho e, com o Redis configurado (app/api/lista),
// sincronizado entre aparelhos a cada 3 s. Cada mudança entra numa fila e é enviada na hora; sem internet,
// a fila espera (inclusive se a página for recarregada) e sobe quando a conexão volta.

import { useEffect, useRef, useState } from 'react'
import type { Avulso } from './convidados'

const CHAVE = 'pianissima:lista-confra2026' // cópia local das marcações
const CHAVE_AVULSOS = 'pianissima:lista-confra2026:avulsos'
const CHAVE_FILA = 'pianissima:lista-confra2026:fila' // mudanças ainda não enviadas ao servidor
const INTERVALO = 3000 // ms entre sincronizações

export type Marcas = Record<string, number> // id da pessoa → horário de chegada (ms)
export type Avulsos = Record<string, Avulso>
export type Modo = 'conectando' | 'local' | 'compartilhado'
type Mudancas<T> = Record<string, T | null> // null = remover
export type Mudanca = { marcas?: Mudancas<number>; avulsos?: Mudancas<Avulso> }
type Fila = Required<Mudanca>

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
const aplicar = <T,>(base: Record<string, T>, mudancas: Mudancas<T>) => {
  const novo = { ...base }
  for (const [id, valor] of Object.entries(mudancas)) {
    if (valor === null) delete novo[id]
    else novo[id] = valor
  }
  return novo
}
const filaVazia = (): Fila => ({ marcas: {}, avulsos: {} })
const tamanho = (f: Fila) => Object.keys(f.marcas).length + Object.keys(f.avulsos).length
// Tira da fila o que foi enviado e não mudou de novo enquanto o envio acontecia
const baixar = <T,>(fila: Mudancas<T>, enviado: Mudancas<T>) => {
  for (const [id, valor] of Object.entries(enviado)) if (fila[id] === valor) delete fila[id]
}

export function useSincronizacao() {
  const [marcas, setMarcas] = useState<Marcas>({})
  const [avulsos, setAvulsos] = useState<Avulsos>({})
  const [pronto, setPronto] = useState(false) // só grava depois de ler o que já estava salvo
  const [modo, setModo] = useState<Modo>('conectando')
  const [online, setOnline] = useState(true) // a última conversa com o servidor deu certo
  const [pendentes, setPendentes] = useState(0) // mudanças na fila esperando conexão
  const fila = useRef<Fila>(filaVazia())
  const sincronizar = useRef<() => void>(() => {})

  const guardarFila = () => {
    gravar(CHAVE_FILA, fila.current)
    setPendentes(tamanho(fila.current))
  }

  useEffect(() => {
    setMarcas(ler(CHAVE, {}))
    setAvulsos(ler(CHAVE_AVULSOS, {}))
    const salva = ler<Partial<Fila> | null>(CHAVE_FILA, null)
    fila.current = { marcas: salva?.marcas ?? {}, avulsos: salva?.avulsos ?? {} }
    setPendentes(tamanho(fila.current))
    setPronto(true)

    let modoAtual: Modo = 'conectando'
    let ocupado = false
    let parado = false

    // Envia a fila (se houver) e traz o estado do servidor com o que ainda está na fila por cima
    const ciclo = async () => {
      if (parado || ocupado || modoAtual === 'local') return
      ocupado = true
      const envio: Fila = { marcas: { ...fila.current.marcas }, avulsos: { ...fila.current.avulsos } }
      let deuCerto = false
      try {
        const res = await fetch('/api/lista', {
          cache: 'no-store',
          ...(tamanho(envio) > 0 && {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mudancas: envio.marcas, avulsos: envio.avulsos }),
          }),
        })
        if (!res.ok) throw new Error(String(res.status))
        const dados = (await res.json()) as { modo: Modo; marcas?: Marcas; avulsos?: Avulsos }
        if (parado) return
        modoAtual = dados.modo
        setModo(dados.modo)
        baixar(fila.current.marcas, envio.marcas)
        baixar(fila.current.avulsos, envio.avulsos)
        if (dados.modo === 'local') {
          fila.current = filaVazia() // servidor sem banco: tudo fica só neste aparelho
        } else {
          setMarcas(aplicar(dados.marcas ?? {}, fila.current.marcas))
          setAvulsos(aplicar(dados.avulsos ?? {}, fila.current.avulsos))
        }
        guardarFila()
        setOnline(true)
        deuCerto = true
      } catch {
        if (!parado) setOnline(false)
      } finally {
        ocupado = false
      }
      // Entrou mudança durante o envio: manda logo, sem esperar o próximo ciclo
      if (deuCerto && tamanho(fila.current) > 0) void ciclo()
    }
    sincronizar.current = () => void ciclo()

    void ciclo()
    const timer = setInterval(() => document.visibilityState === 'visible' && void ciclo(), INTERVALO)
    const aoVoltar = () => document.visibilityState === 'visible' && void ciclo()
    const outraAba = (e: StorageEvent) => {
      if (e.key === CHAVE) setMarcas(ler(CHAVE, {}))
      if (e.key === CHAVE_AVULSOS) setAvulsos(ler(CHAVE_AVULSOS, {}))
    }
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
  useEffect(() => {
    if (pronto) gravar(CHAVE_AVULSOS, avulsos)
  }, [avulsos, pronto])

  // Aplica na tela na hora; fora do modo local também entra na fila e é enviado em seguida
  const mudar = (m: Mudanca) => {
    if (m.marcas) setMarcas((atual) => aplicar(atual, m.marcas!))
    if (m.avulsos) setAvulsos((atual) => aplicar(atual, m.avulsos!))
    if (modo === 'local') return
    Object.assign(fila.current.marcas, m.marcas)
    Object.assign(fila.current.avulsos, m.avulsos)
    guardarFila()
    sincronizar.current()
  }

  // Apaga marcações e avulsos (no modo compartilhado, de todos os aparelhos). Lança erro se estiver sem conexão.
  const zerar = async () => {
    if (modo === 'compartilhado') {
      const res = await fetch('/api/lista', {
        method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ zerar: true }),
      })
      if (!res.ok) throw new Error(String(res.status))
      fila.current = filaVazia()
      guardarFila()
    }
    setMarcas({})
    setAvulsos({})
  }

  return { marcas, avulsos, pronto, modo, online, pendentes, mudar, zerar }
}

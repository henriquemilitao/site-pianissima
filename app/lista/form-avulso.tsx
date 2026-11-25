'use client'

// Formulário de avulso (adicionar ou editar): nome + situação do pagamento.
// Fica no alto da tela para o teclado do celular não cobrir os botões.

import { useEffect, useState } from 'react'
import type { Status } from './convidados'
import { PIX } from './pix'

// Rótulos do formulário (a etiqueta na lista usa STATUS: "Pagar agora" vira "Pagou na entrada")
const OPCOES: { status: Status; rotulo: string }[] = [
  { status: 'pago', rotulo: 'Já pagou' },
  { status: 'agora', rotulo: 'Pagar agora' },
  { status: 'depois', rotulo: 'Paga depois' },
  { status: 'cortesia', rotulo: 'Cortesia' },
]
const valor = PIX.valorAvulso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type Dados = { nome: string; status: Status }
type Props = {
  titular: string // aluno (ou professor) do cartão onde o avulso entra
  inicial?: Dados // presente = edição
  onSalvar: (dados: Dados) => void
  onRemover?: () => void
  onFechar: () => void
}

export function FormAvulso({ titular, inicial, onSalvar, onRemover, onFechar }: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? '')
  const [status, setStatus] = useState<Status | null>(inicial?.status ?? null) // escolha obrigatória: mexe com dinheiro

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[#292827]/45 px-4 pb-6 pt-[8vh]" onClick={onFechar}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-avulso"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          if (nome.trim() && status) onSalvar({ nome: nome.trim(), status })
        }}
        className="mx-auto w-full max-w-md rounded-3xl bg-[#fffdf9] p-5 shadow-xl shadow-black/20"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f877d]">{inicial ? 'Editar avulso' : 'Adicionar avulso'}</p>
        <h2 id="titulo-avulso" className="mt-1 font-serif text-xl leading-tight">Convidado de {titular}</h2>

        <label htmlFor="nome-avulso" className="mt-5 block text-sm font-semibold text-[#5e574f]">Nome</label>
        <input
          id="nome-avulso"
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={80}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
          placeholder="Nome de quem chegou"
          className="mt-1.5 h-12 w-full rounded-xl border border-[#ded3c5] bg-[#faf7f2] px-4 text-base text-[#292827] outline-none placeholder:text-[#a39a8f] focus:border-[#b8863e] focus:ring-2 focus:ring-[#b8863e]/20"
        />

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-[#5e574f]">Pagamento</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {OPCOES.map((o) => (
              <button
                key={o.status}
                type="button"
                aria-pressed={status === o.status}
                onClick={() => setStatus(o.status)}
                className={`min-h-12 rounded-xl border px-2 text-sm font-semibold transition-colors ${
                  status === o.status ? 'border-[#292827] bg-[#292827] text-white' : 'border-[#ded3c5] bg-white text-[#5e574f]'}`}
              >
                {o.rotulo}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Pagar agora: QR para a pessoa ler no app do banco + dados para o organizador falar */}
        {status === 'agora' && (
          <div className="mt-4 rounded-2xl border border-[#e3dacf] bg-white p-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático, não precisa de otimização */}
            <img src={PIX.qr} alt="QR Code do Pix" width={208} height={208} className="mx-auto h-52 w-52" />
            <p className="mt-3 font-serif text-2xl">
              {valor} <span className="font-sans text-sm text-[#6f685f]">por pessoa</span>
            </p>
            <p className="mt-1 text-sm text-[#6f685f]">
              Chave Pix (celular): <strong className="whitespace-nowrap text-[#292827]">{PIX.chave}</strong>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#8f877d]">
              A pessoa lê o QR no app do banco e digita o valor. Confira o comprovante e toque em Adicionar.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2">
          {onRemover && (
            <button type="button" onClick={onRemover} className="rounded-full px-3 py-2.5 text-sm font-semibold text-[#b4483c] hover:bg-[#fbeceb]">
              Remover
            </button>
          )}
          <button type="button" onClick={onFechar} className="ml-auto rounded-full px-4 py-2.5 text-sm font-semibold text-[#6f685f] hover:bg-[#efe9df]">
            Cancelar
          </button>
          <button type="submit" disabled={!nome.trim() || !status}
            className="rounded-full bg-[#2f7a4b] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
            {inicial ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  )
}

// API da lista de presença (/lista): guarda quem chegou num Redis (Upstash, conectado pela Vercel)
// para vários aparelhos marcarem juntos. Sem Redis configurado responde { modo: 'local' } e a página
// continua salvando só no aparelho.

import { familias } from '@/app/lista/convidados'

const CHAVE = 'lista-confra2026' // hash: id da pessoa → horário de chegada (ms)
const idsValidos = new Set(familias.flatMap((f) => f.pessoas.map((p) => p.id)))

type Mudancas = Record<string, number | null> // null = desmarcar

// A integração Upstash da Vercel cria KV_REST_API_URL/TOKEN; aceita também outro prefixo ou o nome UPSTASH_*
const variavel = (nomes: string[], sufixo: string) =>
  nomes.map((n) => process.env[n]).find(Boolean) ??
  Object.entries(process.env).find(([k, v]) => v && k.endsWith(sufixo))?.[1]
const conexao = () => {
  const url = variavel(['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL'], '_REST_API_URL')
  const token = variavel(['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN'], '_REST_API_TOKEN')
  return url && token ? { url, token } : null
}

// Executa comandos em sequência pela API REST do Upstash (/pipeline) e devolve os resultados
async function redis({ url, token }: { url: string; token: string }, comandos: (string | number)[][]) {
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(comandos),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Redis respondeu ${res.status}`)
  const saida = (await res.json()) as { result?: unknown; error?: string }[]
  const falha = saida.find((r) => r.error)
  if (falha) throw new Error(falha.error)
  return saida.map((r) => r.result)
}

// HGETALL volta [id, horário, id, horário, ...]
function paraMarcas(lista: unknown) {
  const plano = Array.isArray(lista) ? (lista as string[]) : []
  const marcas: Record<string, number> = {}
  for (let i = 0; i < plano.length; i += 2) marcas[plano[i]] = Number(plano[i + 1])
  return marcas
}

const resposta = (marcas: Record<string, number>) =>
  Response.json({ modo: 'compartilhado', marcas }, { headers: { 'Cache-Control': 'no-store' } })

export async function GET() {
  const db = conexao()
  if (!db) return Response.json({ modo: 'local' })
  const [lista] = await redis(db, [['HGETALL', CHAVE]])
  return resposta(paraMarcas(lista))
}

// Corpo: { mudancas: { [id]: horário | null } } e/ou { zerar: true }. Ids fora da lista são ignorados.
export async function POST(req: Request) {
  const db = conexao()
  if (!db) return Response.json({ modo: 'local' })
  const corpo = (await req.json().catch(() => null)) as { mudancas?: Mudancas; zerar?: boolean } | null
  const mudancas = Object.entries(corpo?.mudancas && typeof corpo.mudancas === 'object' ? corpo.mudancas : {})
    .filter(([id]) => idsValidos.has(id))
  const marcar = mudancas.filter(([, ts]) => typeof ts === 'number' && Number.isFinite(ts))
  const desmarcar = mudancas.filter(([, ts]) => ts === null).map(([id]) => id)

  const comandos: (string | number)[][] = []
  if (corpo?.zerar === true) comandos.push(['DEL', CHAVE])
  if (marcar.length) comandos.push(['HSET', CHAVE, ...marcar.flatMap(([id, ts]) => [id, ts as number])])
  if (desmarcar.length) comandos.push(['HDEL', CHAVE, ...desmarcar])
  comandos.push(['HGETALL', CHAVE])

  const resultados = await redis(db, comandos)
  return resposta(paraMarcas(resultados[resultados.length - 1]))
}

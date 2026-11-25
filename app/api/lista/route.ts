// API da lista de presença (/lista): guarda quem chegou e os avulsos num Redis (Upstash, conectado pela
// Vercel) para vários aparelhos usarem juntos. Sem Redis configurado responde { modo: 'local' } e a página
// continua salvando só no aparelho.

import { familias, STATUS, type Avulso, type Status } from '@/app/lista/convidados'

const CHAVE = 'lista-confra2026' // hash: id da pessoa → horário de chegada (ms)
const CHAVE_AVULSOS = 'lista-confra2026:avulsos' // hash: id do avulso → JSON do Avulso
const idsLista = new Set(familias.flatMap((f) => f.pessoas.map((p) => p.id)))
const idsFamilias = new Set(familias.map((f) => f.id))
const ehAvulso = (id: string) => /^avulso-[a-z0-9]{4,32}$/.test(id)

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

// Valida o avulso que veio do aparelho (ou do Redis); null se não servir
function avulsoValido(dado: unknown): Avulso | null {
  if (!dado || typeof dado !== 'object') return null
  const { nome, status, familia, criadoEm } = dado as Record<string, unknown>
  if (typeof nome !== 'string' || !nome.trim() || typeof criadoEm !== 'number') return null
  if (typeof status !== 'string' || !Object.keys(STATUS).includes(status)) return null
  if (typeof familia !== 'string' || !idsFamilias.has(familia)) return null
  return { nome: nome.trim().slice(0, 80), status: status as Status, familia, criadoEm }
}

// HGETALL volta [campo, valor, campo, valor, ...]
const pares = (lista: unknown) => {
  const plano = Array.isArray(lista) ? (lista as string[]) : []
  return Array.from({ length: plano.length / 2 }, (_, i) => [plano[2 * i], plano[2 * i + 1]] as const)
}
const paraMarcas = (lista: unknown) => Object.fromEntries(pares(lista).map(([id, ts]) => [id, Number(ts)]))
const paraAvulsos = (lista: unknown) => {
  const avulsos: Record<string, Avulso> = {}
  for (const [id, json] of pares(lista)) {
    try {
      const a = avulsoValido(JSON.parse(json))
      if (a) avulsos[id] = a
    } catch {
      // registro corrompido: ignora
    }
  }
  return avulsos
}

const LEITURA = [['HGETALL', CHAVE], ['HGETALL', CHAVE_AVULSOS]]
const resposta = (r: unknown[]) =>
  Response.json(
    { modo: 'compartilhado', marcas: paraMarcas(r[r.length - 2]), avulsos: paraAvulsos(r[r.length - 1]) },
    { headers: { 'Cache-Control': 'no-store' } },
  )

export async function GET() {
  const db = conexao()
  if (!db) return Response.json({ modo: 'local' })
  return resposta(await redis(db, LEITURA))
}

// Corpo: { mudancas: { [id]: horário | null }, avulsos: { [id]: Avulso | null }, zerar?: true }.
// null remove. Ids desconhecidos e avulsos inválidos são ignorados.
export async function POST(req: Request) {
  const db = conexao()
  if (!db) return Response.json({ modo: 'local' })
  const corpo = (await req.json().catch(() => null)) as { mudancas?: unknown; avulsos?: unknown; zerar?: unknown } | null
  const itens = (v: unknown) => (v && typeof v === 'object' ? Object.entries(v as Record<string, unknown>) : [])

  const mudancas = itens(corpo?.mudancas).filter(([id]) => idsLista.has(id) || ehAvulso(id))
  const marcar = mudancas.flatMap(([id, ts]) => (typeof ts === 'number' && Number.isFinite(ts) ? [id, ts] : []))
  const desmarcar = mudancas.filter(([, ts]) => ts === null).map(([id]) => id)
  const avulsos = itens(corpo?.avulsos).filter(([id]) => ehAvulso(id))
  const salvar = avulsos.flatMap(([id, a]) => {
    const valido = avulsoValido(a)
    return valido ? [id, JSON.stringify(valido)] : []
  })
  const remover = avulsos.filter(([, a]) => a === null).map(([id]) => id)

  const comandos: (string | number)[][] = []
  if (corpo?.zerar === true) comandos.push(['DEL', CHAVE, CHAVE_AVULSOS])
  if (marcar.length) comandos.push(['HSET', CHAVE, ...marcar])
  if (desmarcar.length) comandos.push(['HDEL', CHAVE, ...desmarcar])
  if (salvar.length) comandos.push(['HSET', CHAVE_AVULSOS, ...salvar])
  if (remover.length) comandos.push(['HDEL', CHAVE_AVULSOS, ...remover])

  return resposta(await redis(db, [...comandos, ...LEITURA]))
}

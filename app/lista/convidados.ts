// Lista de presença do recital (página /lista) — fonte única dos dados.
// Para incluir ou corrigir alguém, edite só `grupos`. Alunos com o nome do programa (/confra2026).
// O nome vira a chave da marcação salva no aparelho: não repita nomes nem renomeie quem já foi marcado.
// Avulsos (quem chega na hora) não ficam aqui: são adicionados pela própria página.

// Situação do pagamento de cada convidado. Alunos e professores não pagam.
export const STATUS = { pago: 'Pago', depois: 'Paga depois', cortesia: 'Cortesia' } as const
export type Status = keyof typeof STATUS

// Convidado: só o nome (já pagou) ou com detalhes. obs: detalhe curto (ex.: "5 anos")
type Convidado = string | { nome: string; obs?: string; status?: Status }
// Titulares do cartão: alunos e/ou professores. outrasGrafias: só para a busca
type Grupo = { alunos?: string[]; professores?: string[]; convidados: Convidado[]; outrasGrafias?: string[] }

const grupos: Grupo[] = [
  {
    alunos: ['Helena Gomes Borges', 'Letícia Gomes Borges'],
    convidados: [
      'Iraci Gomes de Oliveira', 'Jackeline Gomes de Oliveira', 'Anderson Meireles Allan',
      'Allana Andressa Gomes do Nascimento Meireles', 'José Gilberto Vasques Borges', 'Géssica',
    ],
  },
  {
    alunos: ['Isabella Carolina Oliveira Pescara'],
    convidados: [
      'Paulo Alexandre Pescara', 'Camila Gabriela Oliveira Pescara', 'Regiane Silva de Oliveira Pescara',
      'Maria', 'Jaci', 'Everton Geandelly', 'Jessica',
    ],
  },
  { alunos: ['Helena Gondim dos Santos'], convidados: ['Josiane Alves Gondim dos Santos', 'Vander Paulo dos Santos'] },
  { alunos: ['Ágatha Malfer dos Santos'], convidados: ['Jorge', 'Luziana', 'Alissa'] },
  {
    alunos: ['Heloisa Tavares Souza'],
    convidados: [
      'Risoneide de Souza', 'Lucas Mário de Souza', 'Lilian Keli da Silva Tavares Souza',
      'Euzir da Silva Tavares', 'Laura Tavares Souza', 'Isaac Tavares',
    ],
  },
  { alunos: ['Eloize de Almeida Santos'], convidados: ['Wanderley Pereira dos Santos', 'Luiza Maria de Almeida Santos', 'Maria José Clarindo de Almeida'] },
  { alunos: ['Laura Araújo Damasceno de Almeida'], convidados: ['Antônia Alexandrina Damasceno de Almeida', 'Renato Damasceno de Almeida', 'Rosineia Jesus Araújo'] },
  {
    alunos: ['Lara Soares de Medeiros Pereira'],
    convidados: ['Danielly Cristine Soares de Medeiros', 'Thiago de Medeiros Pereira', 'Geralda Soares da Silva', 'Edilene Maria Medeiros'],
  },
  // Na lista das famílias veio como "Kharla"
  { alunos: ['Karlla de Almeida Dias Pereira'], outrasGrafias: ['Kharla'], convidados: ['Sionara de Almeida', 'Carlos Dias Pereira'] },
  {
    alunos: ['Lucas Yoshimitsu da Silva Ujiie'],
    convidados: [
      'Evellyn Jaqueline da Silva Ujiie', 'Igor Yoshimitsu Bambil Ujiie', 'Telma Cristina Bambil Ujiie', 'Gecival Francisco da Silva',
      'Íris Inari Bambil Ujiie Lima', 'Fábio Lima', 'Isac Jun Ujiie Lima', { nome: 'Henrique Samuel da Silva Ujiie', obs: '5 anos' },
    ],
  },
  {
    alunos: ['Luísa Salles de Oliveira', 'Matheus Lico de Oliveira'],
    convidados: [
      'Claudia Salles Regis de Oliveira', 'Emerson Domingues de Oliveira', 'Ivone Salles Regis',
      'Gisele Salles Regis', 'Cleverson Moreira', 'Leonardo Salles Moreira',
    ],
  },
  {
    alunos: ['João Pedro Rodrigues da Silva'],
    convidados: ['Virginia Pereira Rodrigues da Silva', 'Beatriz Teresinha Pereira Rodrigues da Silva', 'Avadilson Ricardo'],
  },
  { alunos: ['Sara Zamboni de Carvalho'], convidados: ['Genivaldo Guedes de Carvalho', 'Sidneia Zamboni de Carvalho', 'Samuel Zamboni de Carvalho'] },
  { alunos: ['Lara Morato Rodrigues'], convidados: ['Flávio Rodrigues de Souza', 'Karina Ferreira Morato Rodrigues'] },
  { alunos: ['Paula Moura Cacho', 'Lesley Silva Moura Cacho'], convidados: ['João Paulo Cacho'] },
  { alunos: ['Renan Dias Militão'], convidados: ['Adilson Antônio Militão', 'Henrique Dias Militão', 'Minéia Dias Militão', 'Lucy Vizotto'] },
  { alunos: ['Daniel Santos Silva'], convidados: ['Zilma dos Santos Ferreira da Silva', 'Lucio Mauro da Silva', 'Geovanna Santos Silva', 'Eduardo Santos Silva'] },
  { alunos: ['Camila Ferreira Garcia'], convidados: ['Sonia Batista Ferreira'] },
  {
    alunos: ['Felipe Cafaro de Faria'],
    convidados: [
      'Gabriela Cafaro', 'Valter Lopes', 'Mayara Cafaro', 'Caroline de Freitas', 'Marley Pereira', 'Henrique de Freitas',
      'Carlos', 'Maria Rita', 'Tereza', 'Miguel',
    ],
  },
  { alunos: ['Rafael da Silva Arruda'], convidados: ['Danielle Fabiana Bacelar Ramires Arruda'] },
  { alunos: ['Guilherme Pimenta Nantes'], convidados: ['Juliano da Silva Silveira', 'Fernanda Alves Cardoso', { nome: 'Higor Pimenta Nantes', obs: '4 anos' }] },
  { alunos: ['Fernanda Vilela Monteiro'], convidados: ['Cristiane Vilela Albino'] },
  { alunos: ['Arthur Morales Silva'], convidados: ['Antonio Carlos Mussi da Silva', 'Gabriela Morales', 'Mara Sandra Garcia'] },
  { alunos: ['Gustavo Henrique Fama da Silva'], convidados: ['Graziele de Oliveira Fama', 'Élder de Sousa Teles'] },
  { alunos: ['Maria Eduarda Silva'], convidados: ['Julia Xixa'] },
  // Professor entra para ter a contagem dele também
  { professores: ['Thiago Guimarães'], convidados: ['Laís Aquino'] },
]

// titular: aluno ou professor dono do cartão. status: só convidados. avulso: adicionado na hora pela página
export type Pessoa = { id: string; nome: string; titular: boolean; busca: string; obs?: string; status?: Status; avulso?: boolean }
export type Familia = { id: string; pessoas: Pessoa[] }
// Avulso como é salvo (no aparelho e no Redis); familia = id do cartão onde foi adicionado
export type Avulso = { nome: string; status: Status; familia: string; criadoEm: number }

// Busca sem acento e sem diferenciar maiúsculas: "agatha" encontra "Ágatha"
export const normalizar = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const chave = (nome: string) => normalizar(nome).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const pessoa = (nome: string, titular: boolean, extra: Partial<Pessoa> = {}, outrasGrafias = ''): Pessoa =>
  ({ id: chave(nome), nome, titular, busca: normalizar(`${nome} ${outrasGrafias}`), ...extra })

// Em ordem alfabética pelo titular; em cada cartão, titulares primeiro e depois convidados (todos pagos, salvo indicação)
export const familias: Familia[] = grupos
  .map((g) => {
    const grafias = g.outrasGrafias?.join(' ')
    const pessoas = [
      ...(g.alunos ?? []).map((nome) => pessoa(nome, true, {}, grafias)),
      ...(g.professores ?? []).map((nome) => pessoa(nome, true, { obs: 'professor' }, grafias)),
      ...g.convidados.map((c) => {
        const { nome, obs, status = 'pago' }: Exclude<Convidado, string> = typeof c === 'string' ? { nome: c } : c
        return pessoa(nome, false, { obs, status })
      }),
    ]
    return { id: pessoas[0].id, pessoas }
  })
  .sort((a, b) => a.pessoas[0].nome.localeCompare(b.pessoas[0].nome, 'pt-BR'))

export const totalPessoas = familias.reduce((total, f) => total + f.pessoas.length, 0)

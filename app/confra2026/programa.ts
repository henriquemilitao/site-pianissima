// Programa da Confraternização Musical 2026 — "Playlist ao vivo".
// Fonte única dos dados da página /confra2026: para corrigir um nome ou música, edite só este arquivo.

export type Acompanhante = { instrumento: string; nome: string }

export type Musica = { titulo: string; artista?: string }

export type Apresentacao = {
  faixa: number
  alunos: string[] // mais de um nome = apresentação em grupo
  musicas: Musica[] // na ordem em que serão tocadas; vazio = música ainda não definida
  acompanhamento?: Acompanhante[] // músicos de apoio (bandas)
}

export type Bloco = {
  id: string // âncora usada na navegação (#piano-1)
  titulo: string
  parte?: string
  tipo: 'piano' | 'violao' | 'banda' | 'final'
  apresentacoes: Apresentacao[]
}

export const evento = {
  nome: 'Confraternização Musical 2026',
  tema: 'Playlist ao vivo',
  data: 'Quarta-feira, 25 de novembro de 2026',
}

export const programa: Bloco[] = [
  {
    id: 'piano-1', titulo: 'Piano', parte: 'Parte 1', tipo: 'piano',
    apresentacoes: [
      { faixa: 1, alunos: ['Maria Eduarda Silva'], musicas: [{ titulo: 'Improviso sobre Fá# / Peça a 4 mãos' }] },
      { faixa: 2, alunos: ['Paula Moura Cacho'], musicas: [{ titulo: 'Mercado Persa', artista: 'Bastien' }] },
      { faixa: 3, alunos: ['Lara Morato Rodrigues'], musicas: [{ titulo: 'Medley Oh! Alice e Polícias e Ladrões', artista: 'Bastien' }] },
      { faixa: 4, alunos: ['Eloise de Almeida Santos'], musicas: [{ titulo: 'Tema da Família Addams', artista: 'Vic Mizzy' }] },
      { faixa: 5, alunos: ['Helena Gondim dos Santos'], musicas: [{ titulo: 'Prelúdio em Lá Menor', artista: 'Bastien' }] },
      { faixa: 6, alunos: ['Lucas Yoshimitsu da Silva Ujiie'], musicas: [{ titulo: 'Tema de Pokémon', artista: 'John Siegler' }] },
      { faixa: 7, alunos: ['Camila Ferreira Garcia'], musicas: [{ titulo: 'Je Te Laisserai des Mots', artista: 'Patrick Watson' }] },
      { faixa: 8, alunos: ['Heloisa Tavares Souza'], musicas: [{ titulo: 'Put Your Head on My Shoulder', artista: 'Paul Anka' }] },
      { faixa: 9, alunos: ['Daniel Santos Silva'], musicas: [{ titulo: 'Depois do Universo', artista: 'Giulia Be' }] },
    ],
  },
  {
    id: 'violoes', titulo: 'Violões', tipo: 'violao',
    apresentacoes: [
      { faixa: 10, alunos: ['Guilherme Pimenta Nantes'], musicas: [
        { titulo: 'Campainha', artista: 'Ricardo Novais' },
        { titulo: 'Medley Marcha Soldado / O Sapo Não Lava o Pé', artista: 'Folclore Brasileiro' },
      ] },
      { faixa: 11, alunos: ['Lesley Silva Moura Cacho'], musicas: [{ titulo: 'Tocando em Frente', artista: 'Almir Sater' }] },
      { faixa: 12, alunos: ['Arthur Morales Silva'], musicas: [{ titulo: 'Dona Maria', artista: 'Thiago Brava' }] },
      { faixa: 13, alunos: ['Renan Dias Militão'], musicas: [{ titulo: 'Insane', artista: 'Black Gryph0n' }] },
      { faixa: 14, alunos: ['Felipe Cafaro de Faria'], musicas: [{ titulo: 'Fico Assim Sem Você', artista: 'Adriana Calcanhotto' }] },
      { faixa: 15, alunos: ['Gustavo Henrique Fama da Silva'], musicas: [{ titulo: 'Só os Loucos Sabem', artista: 'Charlie Brown Jr.' }] },
      { faixa: 16, alunos: ['Fernanda Vilela Monteiro'], musicas: [{ titulo: 'O Autor da Vida', artista: 'Pedro Valença (Vocal Livre)' }] },
      { faixa: 17, alunos: ['Rafael da Silva Arruda'], musicas: [{ titulo: 'Wave', artista: 'Tom Jobim' }] },
    ],
  },
  {
    id: 'bandas-1', titulo: 'Bandas', parte: 'Parte 1', tipo: 'banda',
    apresentacoes: [
      { faixa: 18, alunos: ['João Pedro Rodrigues da Silva'], musicas: [{ titulo: 'Nothing Else Matters', artista: 'Metallica' }],
        acompanhamento: [{ instrumento: 'Baixo', nome: 'Henrique' }, { instrumento: 'Bateria', nome: 'Thiago' }] },
      { faixa: 19, alunos: ['Matheus Lico de Oliveira'], musicas: [{ titulo: "Don't Cry", artista: "Guns N' Roses" }] },
      { faixa: 20, alunos: ['Lara Soares de Medeiros Pereira'], musicas: [{ titulo: 'Ovelhinha', artista: 'Isadora Pompeu' }],
        acompanhamento: [{ instrumento: 'Violão', nome: 'Thiago' }] },
    ],
  },
  {
    id: 'piano-2', titulo: 'Piano', parte: 'Parte 2', tipo: 'piano',
    apresentacoes: [
      { faixa: 21, alunos: ['Helena Gomes Borges'], musicas: [{ titulo: 'Aleluia', artista: 'Leonard Cohen' }] },
      { faixa: 22, alunos: ['Luísa Salles de Oliveira'], musicas: [{ titulo: 'Ele Vai Agir', artista: 'Sullivan Dutra (Adoradores)' }] },
      { faixa: 23, alunos: ['Isabella Carolina Oliveira Pescara'], musicas: [{ titulo: "Bella's Lullaby", artista: 'Carter Burwell' }] },
      { faixa: 24, alunos: ['Karlla de Almeida Dias Pereira'], musicas: [{ titulo: 'Ballade pour Adeline', artista: 'Paul de Senneville' }] },
      { faixa: 25, alunos: ['Letícia Gomes Borges'], musicas: [{ titulo: 'Golfinho Azul', artista: 'Stephen Schlacks' }] },
      { faixa: 26, alunos: ['Ágatha Malfer dos Santos'], musicas: [{ titulo: 'The Amazing Digital Circus', artista: 'Gooseworx' }] },
      { faixa: 27, alunos: ['Renan Dias Militão'], musicas: [{ titulo: 'Super Mario World – Overworld Theme', artista: 'Koji Kondo' }] },
    ],
  },
  {
    id: 'bandas-2', titulo: 'Bandas', parte: 'Parte 2', tipo: 'banda',
    apresentacoes: [
      { faixa: 28, alunos: ['Laura Araújo Damasceno de Almeida'], musicas: [{ titulo: 'Menino da Porteira', artista: 'Sérgio Reis' }],
        acompanhamento: [{ instrumento: 'Violão', nome: 'Rafael' }, { instrumento: 'Bateria', nome: 'Thiago' }, { instrumento: 'Baixo', nome: 'Henrique' }] },
      { faixa: 29, alunos: ['Sara Zamboni de Carvalho'], musicas: [{ titulo: 'The Winner Takes It All', artista: 'ABBA' }],
        acompanhamento: [{ instrumento: 'Bateria', nome: 'Renan' }, { instrumento: 'Baixo', nome: 'Thiago' }, { instrumento: 'Violão', nome: 'Henrique' }] },
    ],
  },
  {
    id: 'final', titulo: 'Grande final', tipo: 'final',
    apresentacoes: [
      { faixa: 30, alunos: ['Banda de Encerramento'], musicas: [{ titulo: 'Férias Sua Linda', artista: 'Ministério Kinesis' }],
        acompanhamento: [
          { instrumento: 'Violões', nome: 'Gustavo, Rafael e Felipe' },
          { instrumento: 'Bateria', nome: 'Renan' },
          { instrumento: 'Baixo', nome: 'Henrique' },
          { instrumento: 'Cajón', nome: 'Matheus' },
          { instrumento: 'Piano', nome: 'Thiago' },
        ] },
    ],
  },
]

export const totalApresentacoes = programa.reduce((total, bloco) => total + bloco.apresentacoes.length, 0)

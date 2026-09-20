import Image from 'next/image'
import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Waves,
} from 'lucide-react'
import { GalleryCarousel, PhotoCarousel, heroPhotos } from '@/components/photo-carousel'
import { VideoShowcase } from '@/components/video-showcase'

const logoUrl = '/logopianissima.jpg'
const whatsappUrl = 'https://wa.me/5567981047995?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20as%20aulas%20da%20Pian%C3%ADssima.'

const instruments = [
  { title: 'Piano', text: 'Técnica, repertório e expressão.' },
  { title: 'Violão', text: 'Acompanhamento e repertório.' },
  { title: 'Bateria', text: 'Ritmo, coordenação e energia.' },
]

const benefits = [
  { title: 'No seu ritmo', text: 'Aulas individuais e um plano que respeita o seu momento.' },
  { title: 'Olhar dedicado', text: 'Acompanhamento atento para cada instrumento e evolução.' },
  { title: 'Espaço para evoluir', text: 'Um lugar confortável para começar, recomeçar e continuar.' },
]

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f2eb] text-[#292827]">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Pianíssima - início">
          <Image src={logoUrl} alt="Logo Pianíssima" width={52} height={52} className="h-12 w-12 rounded-full object-cover" priority />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.28em] text-[#292827] sm:block">Pianíssima<br /><span className="font-normal tracking-[0.22em] text-[#8f877d]">Aqui tem música</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-[#6f685f] lg:flex" aria-label="Navegação principal">
          <a href="#sobre" className="transition-colors hover:text-[#b8863e]">Sobre</a>
          <a href="#aulas" className="transition-colors hover:text-[#b8863e]">Aulas</a>
          <a href="#contato" className="transition-colors hover:text-[#b8863e]">Contato</a>
        </nav>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#292827] px-4 py-2.5 text-xs font-semibold text-[#f8f4ed] transition-transform hover:-translate-y-0.5 sm:px-5 sm:text-sm">
          <MessageCircle className="h-4 w-4 text-[#d7a95e]" /> Fale conosco
        </a>
      </header>

      <section id="inicio" className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#b8863e]"><span className="h-px w-9 bg-[#b8863e]" /> Escola de música em Campo Grande</p>
          <h1 className="max-w-2xl font-serif text-5xl leading-[0.98] tracking-[-0.04em] text-[#292827] sm:text-7xl lg:text-[6.7rem]">Aqui tem <em className="font-normal text-[#b8863e]">música.</em></h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#6f685f]">Aprender um instrumento pode ser leve, prazeroso e feito do seu jeito.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#b8863e] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#9f7332] hover:shadow-lg hover:shadow-[#b8863e]/20">Agendar uma conversa <ArrowUpRight className="h-4 w-4" /></a>
            <a href="#aulas" className="inline-flex items-center justify-center rounded-full border border-[#cfc4b5] px-6 py-3.5 text-sm font-semibold text-[#5e574f] transition-colors hover:border-[#b8863e] hover:text-[#b8863e]">Conheça as aulas</a>
          </div>
          <div className="mt-12 flex items-center gap-4 border-t border-[#ded5ca] pt-5 text-xs uppercase tracking-[0.16em] text-[#8f877d]"><Waves className="h-5 w-5 text-[#b8863e]" /> Segunda a sábado <span className="h-1 w-1 rounded-full bg-[#b8863e]" /> Mediante agendamento</div>
        </div>
        <div className="relative flex min-h-[370px] items-center justify-center sm:min-h-[500px]">
          <div className="absolute h-[310px] w-[310px] rounded-full border border-[#d8cbb8] sm:h-[440px] sm:w-[440px]" />
          <div className="absolute h-[250px] w-[250px] rounded-full border border-[#e5dbce] sm:h-[355px] sm:w-[355px]" />
          <div className="absolute -right-4 top-8 h-24 w-24 rounded-full bg-[#b8863e]/10 blur-2xl sm:right-8" />
          <div className="w-full max-w-[440px]">
            <PhotoCarousel photos={heroPhotos} variant="hero" />
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#292827] px-5 py-3 text-xs font-medium tracking-[0.12em] text-[#f8f4ed] shadow-xl sm:bottom-8"><span className="mr-2 text-[#d7a95e]">●</span> Comece a tocar</div>
        </div>
      </section>

      <section id="sobre" className="border-y border-[#e3dacf] bg-[#efe9df] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8863e]">Sobre a Pianíssima</p><h2 className="max-w-sm font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Um lugar para <em className="font-normal text-[#b8863e]">ouvir</em> a sua música.</h2></div>
          <div className="max-w-2xl"><p className="text-xl leading-relaxed text-[#514b44]">Na Pianíssima, cada aluno encontra espaço para aprender com calma, curiosidade e acompanhamento de perto.</p><p className="mt-6 leading-relaxed text-[#7b7268]">Seja o seu primeiro contato com um instrumento ou a vontade de voltar a tocar, as aulas são construídas para fazer sentido na sua rotina e valorizar cada pequena conquista.</p></div>
        </div>
      </section>

      <section id="aulas" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8863e]">O que você pode aprender</p><h2 className="font-serif text-4xl tracking-[-0.03em] sm:text-5xl">Escolha o seu <em className="font-normal text-[#b8863e]">som.</em></h2></div><p className="max-w-xs text-sm leading-relaxed text-[#7b7268]">Para quem está começando ou quer voltar a tocar, em qualquer idade.</p></div>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f877d]">Instrumentos ensinados</p><ul className="mt-5 divide-y divide-[#ded3c5] border-y border-[#ded3c5]">{instruments.map(({ title, text }) => <li key={title} className="flex items-center justify-between py-5"><span className="font-serif text-2xl">{title}</span><span className="text-right text-sm text-[#7b7268]">{text}</span></li>)}</ul></div>
          <div className="rounded-[1.5rem] border border-[#ded3c5] bg-[#faf7f2] p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8863e]">Como funciona</p><h3 className="mt-5 font-serif text-3xl">Aulas individuais, semanais.</h3><p className="mt-3 leading-relaxed text-[#7b7268]">Presenciais ou online, com o mesmo valor e acompanhamento de perto.</p><div className="mt-8 border-t border-[#ded3c5] pt-6"><p className="text-sm text-[#7b7268]">Mensalidade das aulas semanais</p><p className="mt-1 font-serif text-5xl text-[#b8863e]">R$270<span className="font-sans text-base text-[#7b7268]">/mês</span></p><p className="mt-2 text-sm text-[#7b7268]">R$250 pagando até o vencimento · quinzenal: R$135/mês</p></div></div>
        </div>
      </section>

      <VideoShowcase />

      <section className="bg-[#292827] px-5 py-20 text-[#f8f4ed] sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24"><div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#d7a95e]">Por que a Pianíssima</p><h2 className="max-w-md font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Aprender também pode ser um <em className="font-normal text-[#d7a95e]">acolhimento.</em></h2></div><div className="divide-y divide-white/20">{benefits.map((benefit) => <div key={benefit.title} className="grid gap-2 border-t border-white/20 py-6 first:pt-0 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8"><h3 className="font-serif text-2xl">{benefit.title}</h3><p className="text-sm leading-relaxed text-[#bdb5ab]">{benefit.text}</p></div>)}</div></div></section>

      <section id="espaco" className="border-y border-[#e3dacf] bg-[#efe9df] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-24">
          <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8863e]">Nosso espaço</p><h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Um ambiente para <em className="font-normal text-[#b8863e]">viver</em> a música.</h2><p className="mt-5 max-w-md leading-relaxed text-[#7b7268]">Conheça cada detalhe do espaço e dos instrumentos que fazem parte da sua experiência.</p></div>
          <GalleryCarousel />
        </div>
      </section>

      <section id="contato" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-28"><div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8863e]">Onde estamos</p><h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">A música espera por você em <em className="font-normal text-[#b8863e]">Campo Grande.</em></h2><div className="mt-10 flex gap-4"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#b8863e]" /><div><p className="font-medium">R. Rio Brilhante, 331</p><p className="mt-1 text-sm leading-relaxed text-[#7b7268]">Vila São Jorge da Lagoa<br />Campo Grande - MS, 79095-071</p></div></div><p className="mt-7 text-sm text-[#7b7268]">Atendimento de segunda a sábado, mediante agendamento.</p></div><div className="min-h-[300px] overflow-hidden rounded-[1.5rem] border border-[#ded3c5] bg-[#eee7dd]"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.4300440874017!2d-54.666709688575125!3d-20.52957818091848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e573ae43db47%3A0xff1d4affd1f23995!2sPian%C3%ADssima%20Aqui%20Tem%20M%C3%BAsica!5e0!3m2!1spt-BR!2sbr!4v1789908566774!5m2!1spt-BR!2sbr" loading="eager" referrerPolicy="strict-origin-when-cross-origin" className="h-full min-h-[300px] w-full border-0" title="Mapa da Pianíssima Aqui Tem Música" /></div></section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[1.75rem] bg-[#b8863e] px-7 py-10 text-white sm:px-12 sm:py-14 lg:flex-row lg:items-center"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Seu próximo acorde</p><h2 className="max-w-xl font-serif text-4xl leading-tight sm:text-5xl">Vamos encontrar a sua música?</h2></div><a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#292827] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Chamar no WhatsApp <ArrowUpRight className="h-4 w-4" /></a></div></section>

      <footer className="border-t border-[#e3dacf] px-5 py-8 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-[#8f877d] sm:flex-row sm:items-center sm:justify-between"><span className="font-semibold uppercase tracking-[0.2em] text-[#514b44]">Pianíssima — Aqui tem música</span><span>Campo Grande, MS · 67 98104-7995</span></div></footer>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar com a Pianíssima pelo WhatsApp" className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.35)] transition-transform hover:scale-105"><MessageCircle className="h-6 w-6" /></a>
    </main>
  )
}


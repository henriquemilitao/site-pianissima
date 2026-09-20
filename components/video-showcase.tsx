"use client"

import { useState } from "react"
import { Play } from "lucide-react"

type Video = {
  title: string
  instrument: string
  videoId: string
}

const videos: Video[] = [
  { title: "Piano em ação", instrument: "Piano", videoId: "p4cJv6s_Yjw" },
  { title: "Cordas que acompanham", instrument: "Violão", videoId: "3j8mr-gcgoI" },
  { title: "Ritmo e presença", instrument: "Bateria", videoId: "JwZzW6f7j8s" },
]

function VideoCard({ video }: { video: Video }) {
  const [started, setStarted] = useState(false)

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[#ded3c5] bg-[#faf7f2]">
      <div className="relative aspect-video bg-[#292827]">
        {started ? (
          <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setStarted(true)} className="group relative h-full w-full text-left" aria-label={`Reproduzir vídeo de ${video.instrument}`}>
            <img src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
            <span className="absolute inset-0 flex items-center justify-center"><span className="flex size-14 items-center justify-center rounded-full bg-[#b8863e] text-white shadow-lg transition-transform group-hover:scale-105"><Play className="ml-1 size-5 fill-current" /></span></span>
          </button>
        )}
      </div>
      <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8863e]">{video.instrument}</p><h3 className="mt-2 font-serif text-2xl">{video.title}</h3></div>
    </article>
  )
}

export function VideoShowcase() {
  return (
    <section className="border-y border-[#e3dacf] bg-[#efe9df] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-xl"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8863e]">Música acontecendo</p><h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Veja os instrumentos <em className="font-normal text-[#b8863e]">em movimento.</em></h2><p className="mt-4 leading-relaxed text-[#7b7268]">Uma prévia do que você pode experimentar nas aulas.</p></div>
        <div className="grid gap-5 md:grid-cols-3">{videos.map((video) => <VideoCard key={video.instrument} video={video} />)}</div>
      </div>
    </section>
  )
}

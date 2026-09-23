"use client"

import { useState } from "react"
import { Play } from "lucide-react"

type Video = {
  title: string
  instrument: string
  videoId: string
  vertical?: boolean
}

const videos: Video[] = [
  { title: "", instrument: "Piano", videoId: "354XJYQl120", vertical: true },
  { title: "", instrument: "Violão", videoId: "IFZbssUG1hQ", vertical: true },
  { title: "", instrument: "Bateria", videoId: "CEcHWjwa_7I", vertical: true },
]

function VideoCard({ video }: { video: Video }) {
  const [started, setStarted] = useState(false)
  const aspectClass = video.vertical ? "aspect-[9/16]" : "aspect-video"
  const embedSrc = video.vertical
    ? `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&playsinline=1`
    : `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[#ded3c5] bg-[#292827]">
      <div className={`relative ${aspectClass}`}>
        {started ? (
          <iframe
            className="h-full w-full"
            src={embedSrc}
            title={`Vídeo de ${video.instrument}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="group relative h-full w-full text-left"
            aria-label={`Reproduzir vídeo de ${video.instrument}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
              alt=""
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#b8863e] text-white shadow-lg transition-transform group-hover:scale-105">
                <Play className="ml-1 size-5 fill-current" />
              </span>
            </span>
            <span className="absolute bottom-3 left-3 rounded-full bg-[#292827]/80 px-3 py-1.5 font-serif text-sm text-white backdrop-blur-sm sm:text-base">
              {video.instrument}
            </span>
          </button>
        )}
      </div>
    </article>
  )
}

export function VideoShowcase() {
  return (
    <section className="border-y border-[#e3dacf] bg-[#efe9df] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8863e]">Música acontecendo</p>
          <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
            Veja os instrumentos <em className="font-normal text-[#b8863e]">em movimento.</em>
          </h2>
          <p className="mt-4 leading-relaxed text-[#7b7268]">Uma prévia do que você pode experimentar nas aulas.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:max-w-3xl">
          {videos.map((video) => (
            <VideoCard key={video.instrument} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}
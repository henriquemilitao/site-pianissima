"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export type Photo = {
  src: string
  alt: string
}

type PhotoCarouselProps = {
  photos: Photo[]
  variant: "hero" | "gallery"
}

const heroSize = "h-[280px] w-[280px] sm:h-[440px] sm:w-[440px]"

function PhotoImage({ photo, variant }: { photo: Photo; variant: PhotoCarouselProps["variant"] }) {
  const isHero = variant === "hero"
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={isHero ? 440 : 900}
      height={isHero ? 440 : 620}
      sizes={isHero ? "(min-width: 640px) 440px, 280px" : "(min-width: 1024px) 60vw, 100vw"}
      className={isHero ? `${heroSize} object-cover` : "h-[22rem] w-full object-cover sm:h-[30rem]"}
      priority={isHero}
    />
  )
}

export function PhotoCarousel({ photos, variant }: PhotoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const hasMultiplePhotos = photos.length > 1
  const isHero = variant === "hero"

  useEffect(() => {
    if (!api || !hasMultiplePhotos) return

    const interval = window.setInterval(() => api.scrollNext(), 5000)
    return () => window.clearInterval(interval)
  }, [api, hasMultiplePhotos])

  if (!photos.length) return null

  // Wrapper que faz o recorte (círculo no hero, cantos arredondados na galeria)
  const frameClass = isHero
    ? `relative ${heroSize} overflow-hidden rounded-full shadow-[0_25px_70px_rgba(80,55,25,0.12)]`
    : "relative w-full overflow-hidden rounded-[1.5rem] border border-[#ded3c5]"

  if (!hasMultiplePhotos) {
    return (
      <div className={frameClass}>
        <PhotoImage photo={photos[0]} variant={variant} />
      </div>
    )
  }

  return (
    <div className={frameClass}>
      <Carousel setApi={setApi} opts={{ loop: true }} className="h-full w-full">
        {/* -ml-0 remove a margem negativa do shadcn; h-full garante altura */}
        <CarouselContent className="ml-0 h-full">
          {photos.map((photo) => (
            // pl-0 remove o padding do shadcn que estava deslocando o slide
            <CarouselItem key={photo.src} className="h-full basis-full pl-0">
              <PhotoImage photo={photo} variant={variant} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-2 hidden border-[#cfc4b5] bg-[#f8f4ed]/90 text-[#292827] sm:flex"
          aria-label="Foto anterior"
        />
        <CarouselNext
          className="right-2 hidden border-[#cfc4b5] bg-[#f8f4ed]/90 text-[#292827] sm:flex"
          aria-label="Próxima foto"
        />
      </Carousel>
    </div>
  )
}

export function CarouselDots({ count }: { count: number }) {
  if (count < 2) return null
  return (
    <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[#8f877d]">
      Arraste para explorar · {count} fotos
    </p>
  )
}

export const heroPhotos: Photo[] = [
  { src: "/espaco-apresentacao.jpeg", alt: "Apresentação musical ao ar livre na Pianíssima" },
  { src: "/alunos-palco.jpeg", alt: "Alunos reunidos em uma apresentação na Pianíssima" },
  { src: "/aluna-piano.jpeg", alt: "Aluna tocando piano durante uma aula na Pianíssima" },
]

export const spacePhotos: Photo[] = [
  { src: "/espaco-apresentacao.jpeg", alt: "Apresentação musical ao ar livre na Pianíssima" },
  { src: "/alunos-palco.jpeg", alt: "Grupo de alunos reunido no palco da Pianíssima" },
  { src: "/dupla-violao.jpeg", alt: "Dois músicos tocando violão no espaço da Pianíssima" },
  { src: "/banda-pianissima.jpeg", alt: "Alunos reunidos com instrumentos no espaço da Pianíssima" },
  { src: "/aluna-piano.jpeg", alt: "Aluna tocando piano no espaço da Pianíssima" },
]

export function GalleryCarousel() {
  return (
    <div>
      <PhotoCarousel photos={spacePhotos} variant="gallery" />
      <CarouselDots count={spacePhotos.length} />
    </div>
  )
}

export type { CarouselApi }
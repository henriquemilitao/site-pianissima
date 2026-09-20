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

export function PhotoCarousel({ photos, variant }: PhotoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const hasMultiplePhotos = photos.length > 1

  useEffect(() => {
    if (!api || !hasMultiplePhotos) return

    const interval = window.setInterval(() => api.scrollNext(), 5000)
    return () => window.clearInterval(interval)
  }, [api, hasMultiplePhotos])

  if (!photos.length) return null

  if (!hasMultiplePhotos) {
  return (
    <div className={variant === "hero" ? "relative overflow-hidden rounded-full shadow-[0_25px_70px_rgba(80,55,25,0.12)]" : "overflow-hidden rounded-[1.5rem] border border-[#ded3c5]"}>
    <Image
      src={photos[0].src}
      alt={photos[0].alt}
      width={variant === "hero" ? 440 : 900}
      height={variant === "hero" ? 440 : 620}
      className={variant === "hero" ? "h-56 w-56 object-cover sm:h-[440px] sm:w-[440px]" : "h-[22rem] w-full object-cover sm:h-[30rem]"}
      priority={variant === "hero"}
    />
  </div>
  )
}

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className={variant === "hero" ? "w-fit max-w-full" : "w-full"}>
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.src}>
            <div className={variant === "hero" ? "relative overflow-hidden rounded-full shadow-[0_25px_70px_rgba(80,55,25,0.12)]" : "overflow-hidden rounded-[1.5rem] border border-[#ded3c5]"}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={variant === "hero" ? 440 : 900}
                height={variant === "hero" ? 440 : 620}
                className={variant === "hero" ? "h-56 w-56 object-cover sm:h-[440px] sm:w-[440px]" : "h-[22rem] w-full object-cover sm:h-[30rem]"}
                priority={variant === "hero"}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1 hidden border-[#cfc4b5] bg-[#f8f4ed]/90 text-[#292827] sm:flex" aria-label="Foto anterior" />
      <CarouselNext className="right-1 hidden border-[#cfc4b5] bg-[#f8f4ed]/90 text-[#292827] sm:flex" aria-label="Próxima foto" />
    </Carousel>
  )
}

export function CarouselDots({ count }: { count: number }) {
  if (count < 2) return null
  return <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[#8f877d]">Arraste para explorar · {count} fotos</p>
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

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
      <div className={variant === "hero" ? "relative rotate-3 rounded-[2rem] border border-white/70 bg-[#ebe3d7] p-4 shadow-[0_25px_70px_rgba(80,55,25,0.12)] sm:p-6" : "overflow-hidden rounded-[1.5rem] border border-[#ded3c5] bg-[#ebe3d7] p-3"}>
        <Image
          src={photos[0].src}
          alt={photos[0].alt}
          width={variant === "hero" ? 310 : 900}
          height={variant === "hero" ? 310 : 620}
          className={variant === "hero" ? "h-56 w-56 rounded-[1.4rem] object-contain sm:h-[310px] sm:w-[310px]" : "h-[22rem] w-full rounded-[1.1rem] object-cover sm:h-[30rem]"}
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
            <div className={variant === "hero" ? "relative rotate-3 rounded-[2rem] border border-white/70 bg-[#ebe3d7] p-4 shadow-[0_25px_70px_rgba(80,55,25,0.12)] sm:p-6" : "overflow-hidden rounded-[1.5rem] border border-[#ded3c5] bg-[#ebe3d7] p-3"}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={variant === "hero" ? 310 : 900}
                height={variant === "hero" ? 310 : 620}
                className={variant === "hero" ? "h-56 w-56 rounded-[1.4rem] object-contain sm:h-[310px] sm:w-[310px]" : "h-[22rem] w-full rounded-[1.1rem] object-cover sm:h-[30rem]"}
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
  { src: "/logopianissima.jpg", alt: "Logo Pianíssima com monograma musical" },
]

export const spacePhotos: Photo[] = [
  { src: "/logopianissima.jpg", alt: "Pianíssima Aqui Tem Música" },
]

export function GalleryCarousel() {
  return (
    <div>
      <PhotoCarousel photos={spacePhotos} variant="gallery" />
      <CarouselDots count={spacePhotos.length} />
    </div>
  )
}

export function HeroCarousel() {
  return <PhotoCarousel photos={heroPhotos} variant="hero" />
}

export type { CarouselApi }

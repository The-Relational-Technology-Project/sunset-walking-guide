import { useEffect, useRef, useState } from 'react';
import { Place } from '@/data/places';
import { TimeIndicator } from './TimeIndicator';
import { formatWalkingLine, openDirections, distanceKm } from '@/utils/geo';
import { X, Play, ExternalLink, MapPin, Maximize2 } from 'lucide-react';

interface PlaceDetailProps {
  place: Place;
  userLat: number;
  userLng: number;
  onClose: () => void;
}

export function PlaceDetail({ place, userLat, userLng, onClose }: PlaceDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dist = distanceKm(userLat, userLng, place.lat, place.lng);
  const walkingLine = formatWalkingLine(dist);

  // Trap body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDirections = () => {
    openDirections(place.lat, place.lng, place.name);
  };

  const togglePlay = () => {
    setIsPlaying((p) => !p);
  };

  return (
    <>
      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/40 rounded-full p-2 transition-colors"
            aria-label="Close fullscreen"
          >
            <X size={22} />
          </button>
          <img
            src={place.thumbnail}
            alt={place.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {place.photoCredit && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] italic text-white/50">
              Photo: {place.photoCredit}
            </p>
          )}
        </div>
      )}

      <div
        className="fixed inset-0 z-50 flex flex-col"
        style={{ maxWidth: 430, margin: '0 auto' }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Sheet */}
        <div
          ref={scrollRef}
          className="absolute bottom-0 left-0 right-0 bg-background rounded-t-lg overflow-y-auto slide-up"
          style={{ maxHeight: '92dvh' }}
        >
          {/* Close bar */}
          <div className="sticky top-0 bg-background z-10 flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
            <div className="w-8 h-0.5 bg-muted-foreground/30 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <div className="w-8" />
            <button
              onClick={onClose}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="pb-10 space-y-6">
            {/* Hero image — full width */}
            <div className="relative w-full">
              <div
                className="w-full bg-muted overflow-hidden cursor-zoom-in"
                style={{ aspectRatio: '4/3' }}
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={place.thumbnail}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              {/* Fullscreen button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm rounded-sm p-1.5 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="View fullscreen"
              >
                <Maximize2 size={14} />
              </button>
              {place.photoCredit && (
                <p className="absolute bottom-2 left-3 text-[10px] italic text-white/60 drop-shadow-sm">
                  Photo: {place.photoCredit}
                </p>
              )}
            </div>

            <div className="px-6 space-y-6">
              {/* Name + meta */}
              <div className="space-y-2">
                <h2 className="serif text-2xl font-medium leading-tight text-foreground">
                  {place.name}
                </h2>
                <div className="flex items-center gap-3">
                  <TimeIndicator layers={place.timeLayers} size="md" />
                  <span className="text-xs text-muted-foreground">{walkingLine}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-foreground/80">
                {place.description}
              </p>

              {/* Listen section */}
              {place.audio && place.audio.label && (
                <div className="border-t border-border pt-5 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Listen</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/30 hover:border-foreground/60 transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <span className="w-3 h-3 flex gap-0.5">
                          <span className="w-1 h-full bg-foreground block" />
                          <span className="w-1 h-full bg-foreground block" />
                        </span>
                      ) : (
                        <Play size={14} className="ml-0.5 text-foreground" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm text-foreground">{place.audio.label}</p>
                      <p className="text-xs text-muted-foreground">{place.audio.duration}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Links section */}
              {place.links && place.links.length > 0 && (
                <div className="border-t border-border pt-5 space-y-3">
                  {place.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      {link.label}
                      <ExternalLink size={12} className="flex-shrink-0 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              )}

              {/* Map + directions */}
              <div className="border-t border-border pt-5 space-y-3">
                <div className="w-full h-40 rounded-sm overflow-hidden bg-muted border border-border">
                  <iframe
                    title={`Map of ${place.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng - 0.01},${place.lat - 0.007},${place.lng + 0.01},${place.lat + 0.007}&layer=mapnik&marker=${place.lat},${place.lng}`}
                    className="w-full h-full border-0 opacity-90 grayscale"
                    loading="lazy"
                  />
                </div>
                <button
                  onClick={handleDirections}
                  className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  <MapPin size={13} />
                  Get directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

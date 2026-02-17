import { TimeLayer } from '@/data/places';

interface TimeIndicatorProps {
  layers: TimeLayer[];
  size?: 'sm' | 'md';
}

const ALL_LAYERS: TimeLayer[] = ['past', 'present', 'future'];

export function TimeIndicator({ layers, size = 'sm' }: TimeIndicatorProps) {
  const dim = size === 'sm' ? 8 : 10;
  const gap = size === 'sm' ? 'gap-1.5' : 'gap-2';

  return (
    <span className={`inline-flex items-center ${gap}`} aria-label={`Time layers: ${layers.join(', ')}`}>
      {ALL_LAYERS.map((layer) => {
        const active = layers.includes(layer);
        return (
          <span
            key={layer}
            title={layer}
            style={{ width: dim, height: dim }}
            className={`rounded-full inline-block flex-shrink-0 ${
              active
                ? 'bg-foreground'
                : 'bg-transparent border border-foreground/30'
            }`}
          />
        );
      })}
    </span>
  );
}

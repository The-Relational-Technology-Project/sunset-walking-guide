import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Place, TimeLayer } from '@/data/places';

export function usePlaces() {
  return useQuery({
    queryKey: ['places'],
    queryFn: async (): Promise<Place[]> => {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        lat: Number(row.lat),
        lng: Number(row.lng),
        timeLayers: (row.time_layers ?? []) as TimeLayer[],
        description: row.description,
        thumbnail: row.thumbnail,
        address: row.address ?? undefined,
        photoCredit: row.photo_credit ?? undefined,
        audio: row.audio
          ? (row.audio as { url: string; duration: string; label: string })
          : undefined,
        links: row.links
          ? (row.links as { label: string; url: string }[])
          : undefined,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

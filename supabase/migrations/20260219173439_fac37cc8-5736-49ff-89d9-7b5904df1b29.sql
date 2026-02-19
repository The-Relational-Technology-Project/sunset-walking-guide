
-- Add address column to places
ALTER TABLE public.places ADD COLUMN address text;

-- Create tour_requests table
CREATE TABLE public.tour_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tour_requests
ALTER TABLE public.tour_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts only
CREATE POLICY "Anyone can submit a tour request"
  ON public.tour_requests
  FOR INSERT
  WITH CHECK (true);

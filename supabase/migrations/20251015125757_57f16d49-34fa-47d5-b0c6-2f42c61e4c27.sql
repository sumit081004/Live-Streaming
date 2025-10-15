-- Create overlays table for storing overlay settings
CREATE TABLE public.overlays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  width INTEGER NOT NULL DEFAULT 200,
  height INTEGER NOT NULL DEFAULT 100,
  font_size INTEGER DEFAULT 16,
  color TEXT DEFAULT '#FFFFFF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.overlays ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own overlays" 
ON public.overlays 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own overlays" 
ON public.overlays 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own overlays" 
ON public.overlays 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own overlays" 
ON public.overlays 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_overlays_updated_at
BEFORE UPDATE ON public.overlays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
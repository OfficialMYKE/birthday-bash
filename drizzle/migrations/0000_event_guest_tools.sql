CREATE TABLE public.event_rsvps (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 submission_id uuid NOT NULL UNIQUE,
 guest_name text NOT NULL CHECK (char_length(trim(guest_name)) BETWEEN 1 AND 80),
 attending boolean NOT NULL,
 party_size integer NOT NULL CHECK (party_size >= 0 AND ((attending AND party_size >= 1) OR (NOT attending AND party_size = 0))),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.event_rsvps TO anon, authenticated;
GRANT ALL ON public.event_rsvps TO service_role;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests submit attendance only" ON public.event_rsvps FOR INSERT TO anon, authenticated WITH CHECK (char_length(trim(guest_name)) BETWEEN 1 AND 80 AND party_size >= 0 AND ((attending AND party_size >= 1) OR (NOT attending AND party_size = 0)));
CREATE TABLE public.event_ai_gate (
 id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
 paused_message text,
 window_start timestamptz NOT NULL DEFAULT now(),
 request_count integer NOT NULL DEFAULT 0
);
GRANT ALL ON public.event_ai_gate TO service_role;
ALTER TABLE public.event_ai_gate ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.claim_event_question() RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE gate public.event_ai_gate%ROWTYPE;
BEGIN
 INSERT INTO public.event_ai_gate (id) VALUES (1) ON CONFLICT DO NOTHING;
 SELECT * INTO gate FROM public.event_ai_gate WHERE id = 1 FOR UPDATE;
 IF gate.paused_message IS NOT NULL THEN RETURN gate.paused_message; END IF;
 IF gate.window_start < now() - interval '1 minute' THEN
  UPDATE public.event_ai_gate SET window_start = now(), request_count = 1 WHERE id = 1;
 ELSIF gate.request_count >= 20 THEN
  RETURN 'Hay muchas preguntas en este momento. Inténtalo dentro de un minuto.';
 ELSE
  UPDATE public.event_ai_gate SET request_count = request_count + 1 WHERE id = 1;
 END IF;
 RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_event_question() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_event_question() TO anon, authenticated, service_role;
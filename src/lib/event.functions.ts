import { createServerFn } from '@tanstack/react-start';
import { attendanceSchema, guestNoteSchema, questionSchema } from './event';

export const submitAttendance = createServerFn({ method: 'POST' })
 .validator((input: unknown) => attendanceSchema.parse(input))
 .handler(async ({ data }) => {
  const { publicEventClient } = await import('./event.server');
  const client = publicEventClient();
  const { error } = await client.from('event_rsvps').insert({ submission_id: data.submissionId, guest_name: data.name, attending: data.attending, party_size: data.partySize });
  if (error && error.code !== '23505') return { ok: false, error: 'No pudimos guardar tu confirmación. Inténtalo nuevamente.' };
  return { ok: true, error: null };
 });

export const askEventQuestion = createServerFn({ method: 'POST' })
 .validator((input: unknown) => questionSchema.parse(input))
 .handler(async ({ data }) => {
  const { answerEventQuestion } = await import('./event.server');
  return answerEventQuestion(data.question);
 });

export const loadGuestNotes = createServerFn({ method: 'GET' })
 .handler(async () => {
  const { publicEventClient } = await import('./event.server');
  try {
   const { data, error } = await publicEventClient().from('guestbook_notes')
    .select('id, author_name, message, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
   if (error) return { ok: false, notes: [], error: 'No pudimos cargar los mensajes.' };
   return { ok: true, notes: data, error: null };
  } catch {
   return { ok: false, notes: [], error: 'No pudimos cargar los mensajes.' };
  }
 });

export const saveGuestNote = createServerFn({ method: 'POST' })
 .validator((input: unknown) => guestNoteSchema.parse(input))
 .handler(async ({ data }) => {
  const { publicEventClient } = await import('./event.server');
  const author = data.name || 'Anónim@';
  try {
   const { data: note, error } = await publicEventClient().from('guestbook_notes')
    .insert({ author_name: author, message: data.message })
    .select('id, author_name, message, created_at')
    .single();
   if (error) return { ok: false, error: 'No pudimos guardar tu mensaje. Inténtalo nuevamente.', note: null };
   return { ok: true, error: null, note };
  } catch {
   return { ok: false, error: 'No pudimos guardar tu mensaje. Inténtalo nuevamente.', note: null };
  }
 });
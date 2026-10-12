import { createServerFn } from '@tanstack/react-start';
import { attendanceSchema, questionSchema } from './event';

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
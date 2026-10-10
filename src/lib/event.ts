import { createEvents } from 'ics';
import { z } from 'zod';

export const attendanceSchema = z.object({
 submissionId: z.string().uuid(),
 name: z.string().trim().min(1, 'Escribe tu nombre.').max(80),
 attending: z.boolean(),
 partySize: z.number().int().nonnegative(),
}).refine(v => v.attending ? v.partySize >= 1 : v.partySize === 0, { message: 'Indica cuántas personas asistirán, incluyéndote.' });
export const questionSchema = z.object({ question: z.string().trim().min(1).max(500) });
export const eventDetails = {
 host: 'Camila Arias', age: 18, date: '2026-10-31', timezone: 'America/Guayaquil',
 ceremony: { location: 'Iglesia de Amagasí del Inca, Quito', start: '09:00', end: '11:00' },
 reception: { location: 'Propiedad del Nogal, Perucho', start: '12:00', end: '18:00' },
};

export function celebrationCalendar() {
 const { error, value } = createEvents([
  { title: 'Mis 18 · Camila Arias · La ceremonia', start: [2026,10,31,14,0], end: [2026,10,31,16,0], startInputType: 'utc', endInputType: 'utc', location: eventDetails.ceremony.location, description: 'Cumpleaños de Camila Arias. Ceremonia de 9:00 a.m. a 11:00 a.m., hora de Ecuador.', uid: 'camila-18-ceremony-20261031@invitation', url: 'https://www.google.com/maps/search/?api=1&query=Iglesia+de+Amagasi+del+Inca+Quito' },
  { title: 'Mis 18 · Camila Arias · La recepción', start: [2026,10,31,17,0], end: [2026,10,31,23,0], startInputType: 'utc', endInputType: 'utc', location: eventDetails.reception.location, description: 'Cumpleaños de Camila Arias. Recepción de 12:00 p.m. a 6:00 p.m., hora de Ecuador.', uid: 'camila-18-reception-20261031@invitation', url: 'https://www.google.com/maps/search/?api=1&query=Propiedad+del+Nogal+Perucho' },
 ]);
 if (error || !value) throw new Error('No se pudo crear el calendario. Inténtalo nuevamente.');
 return value;
}
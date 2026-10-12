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
export const ceremonyStartUtc = Date.UTC(2026, 9, 31, 14, 0, 0);

export const whatsappContacts = {
 camila: { label: 'Camila', phone: '593998891074' },
 papa: { label: 'Papá', phone: '593979105887' },
} as const;

export function whatsappUrl(phone: string, message: string) {
 return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function attendanceWhatsAppMessage(guest: { name: string; attending: boolean; partySize: number }, to: 'camila' | 'papa' = 'camila') {
 const hello = to === 'camila' ? '¡Hola Camila!' : '¡Hola! Papá de Camila,';
 if (!guest.attending) return `${hello} Soy ${guest.name}. Lamento no poder acompañar a Camila en sus 18, pero le deseo un día increíble. La llevo en mi corazón ♡`;
 const total = guest.partySize === 1 ? 'Solo voy yo' : `Vamos ${guest.partySize} personas (incluyéndome)`;
 return `${hello} Soy ${guest.name} 🎉 Confirmo mi asistencia a los 18 años de Camila el sábado 31 de octubre. ${total}. ¡Nos vemos ahí! ♡`;
}

export const defaultConfirmMessage = '¡Hola Camila! Confirmo mi asistencia a tus 18 🎉';
export const defaultConfirmMessagePapa = '¡Hola! Confirmo mi asistencia a los 18 años de Camila 🎉';

const normalizeQuestion = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function answerFromEventDetails(question: string): string {
 const q = normalizeQuestion(question);
 const has = (...words: string[]) => words.some(word => q.includes(word));
 if (has('vestimenta', 'codigo de vestimenta', 'ropa', 'vestirse', 'etiqueta')) return 'El código de vestimenta no está especificado en la invitación; puedes consultarlo directamente con Camila. ♡';
 if (has('regalo', 'regalar', 'mesa de regalos', 'sobre')) return 'Los detalles de regalos no están especificados; si deseas saber algo más, pregúntale directamente a Camila. ♡';
 if (has('transporte', 'autobus', 'carro', 'estacionamiento', 'parqueo', 'lleva')) return 'No hay información de transporte especificada; consúltalo con Camila. ♡';
 if (has('comida', 'catering', 'menu', 'almuerzo', 'banquete', 'celiaco', 'vegetariano')) return 'Los detalles del menú no están especificados; puedes preguntarle a Camila. ♡';
 if (has('acompanante', 'puedo llevar', 'novio', 'novia', 'amigos', 'invitar')) return 'Claro: en el formulario de confirmación indica el total de personas incluyéndote y quedará registrado. ♡';
 if (has('confirmar', 'asistencia', 'asistire', 'confirmacion', 'rsvp')) return 'La confirmación se hace en el formulario de esta invitación: escribe tu nombre, indica si asistirás y el total de personas incluyéndote. ♡';
 if (has('calendario', 'agenda', 'guardar')) return 'Usa el botón "Guardar en mi calendario": incluye la ceremonia y la recepción del sábado 31 de octubre de 2026. ♡';
 if (has('zona horaria', 'hora de ecuador', 'utc', 'hora local')) return 'Toda la celebración sigue la hora de Ecuador (UTC-5). ♡';
 if (has('cuantos anos', 'que edad', 'tiene de edad', 'cumples')) return 'Camila está cumpliendo 18 años. ♡';
 if (has('fecha', 'dia', 'cuando')) return 'La celebración es el sábado 31 de octubre de 2026, en Ecuador. ♡';
 if (has('recepcion', 'fiesta', 'nogal', 'perucho')) return `La recepción será en ${eventDetails.reception.location}, de ${eventDetails.reception.start} a ${eventDetails.reception.end}, hora de Ecuador, el sábado 31 de octubre.`;
 if (has('ceremonia', 'misa', 'iglesia', 'amagasi')) return `La ceremonia será en ${eventDetails.ceremony.location}, de ${eventDetails.ceremony.start} a ${eventDetails.ceremony.end}, hora de Ecuador, el sábado 31 de octubre.`;
 if (has('donde', 'ubicacion', 'lugar', 'direccion', 'llego', 'mapa')) return `La ceremonia es en ${eventDetails.ceremony.location} (${eventDetails.ceremony.start} a ${eventDetails.ceremony.end}) y la recepción en ${eventDetails.reception.location} (${eventDetails.reception.start} a ${eventDetails.reception.end}), hora de Ecuador.`;
 if (has('hora', 'horario', 'empieza', 'comienza', 'termina', 'acaba')) return `La ceremonia comienza a las ${eventDetails.ceremony.start} y la recepción a las ${eventDetails.reception.start}, hora de Ecuador, el sábado 31 de octubre de 2026.`;
 return 'Ese dato no está especificado en la invitación; puedes preguntarle directamente a Camila. ♡';
}

export function celebrationCalendar() {
 const { error, value } = createEvents([
  { title: 'Mis 18 · Camila Arias · La ceremonia', start: [2026,10,31,14,0], end: [2026,10,31,16,0], startInputType: 'utc', endInputType: 'utc', location: eventDetails.ceremony.location, description: 'Cumpleaños de Camila Arias. Ceremonia de 9:00 a.m. a 11:00 a.m., hora de Ecuador.', uid: 'camila-18-ceremony-20261031@invitation', url: 'https://www.google.com/maps/search/?api=1&query=Iglesia+de+Amagasi+del+Inca+Quito' },
  { title: 'Mis 18 · Camila Arias · La recepción', start: [2026,10,31,17,0], end: [2026,10,31,23,0], startInputType: 'utc', endInputType: 'utc', location: eventDetails.reception.location, description: 'Cumpleaños de Camila Arias. Recepción de 12:00 p.m. a 6:00 p.m., hora de Ecuador.', uid: 'camila-18-reception-20261031@invitation', url: 'https://www.google.com/maps/search/?api=1&query=Propiedad+del+Nogal+Perucho' },
 ]);
 if (error || !value) throw new Error('No se pudo crear el calendario. Inténtalo nuevamente.');
 return value;
}
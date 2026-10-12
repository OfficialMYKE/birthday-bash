import { describe, expect, it } from 'vitest';
import { answerFromEventDetails, attendanceSchema, attendanceWhatsAppMessage, ceremonyCalendarEvent, celebrationCalendar, churchMapsUrl, eventDetails, guestNoteSchema, googleCalendarUrl, receptionCalendarEvent, whatsappContacts, whatsappUrl } from '@/lib/event';
const base = { submissionId: 'ba107144-bc00-45a3-9a0d-10622687162d', name: 'Ana' };
describe('Event tools', () => {
 it('records attendance and the total number of people', () => {
  expect(attendanceSchema.parse({ ...base, attending: true, partySize: 3 }).partySize).toBe(3);
  expect(attendanceSchema.safeParse({ ...base, attending: true, partySize: 0 }).success).toBe(false);
 });
 it('records non-attendance with no attendees', () => {
  expect(attendanceSchema.parse({ ...base, attending: false, partySize: 0 }).attending).toBe(false);
  expect(attendanceSchema.safeParse({ ...base, attending: false, partySize: 1 }).success).toBe(false);
 });
 it('exports both October 31 events in Ecuador time with locations', () => {
  const calendar = celebrationCalendar();
  expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  expect(calendar).toContain('DTSTART:20261031T140000Z');
  expect(calendar).toContain('DTEND:20261031T160000Z');
  expect(calendar).toContain('DTSTART:20261031T170000Z');
  expect(calendar).toContain('DTEND:20261031T230000Z');
  expect(calendar).toContain('Iglesia de Amagasí del Inca');
  expect(calendar).toContain('Propiedad del Nogal');
 });
});
describe('Local event answers', () => {
 it('answers ceremony time and location questions', () => {
  expect(answerFromEventDetails('¿A qué hora es la ceremonia?')).toContain('Iglesia de Amagasí del Inca');
  expect(answerFromEventDetails('¿Dónde es la misa?')).toContain('09:00');
 });
 it('answers reception questions', () => {
  expect(answerFromEventDetails('¿Dónde es la recepción?')).toContain('Propiedad del Nogal');
  expect(answerFromEventDetails('¿Hasta qué hora es la fiesta?')).toContain('18:00');
 });
 it('answers date and age questions despite accents', () => {
  expect(answerFromEventDetails('¿Cuándo es el cumpleaños?')).toContain('31 de octubre de 2026');
  expect(answerFromEventDetails('¿Cuántos años cumple?')).toContain('18 años');
 });
 it('shares the dress code with green as the reference color', () => {
  expect(answerFromEventDetails('¿Qué vestimenta es?')).toContain('formal');
  expect(answerFromEventDetails('¿Me puedo vestir de blanco?')).toContain('verde');
  expect(eventDetails.dressCode.attire).toBe('Formal');
  expect(eventDetails.dressCode.referenceColor).toBe('verde');
 });
 it('declines to invent details that are not specified', () => {
  expect(answerFromEventDetails('¿Habrá transporte?')).toContain('No hay información');
 });
});
describe('WhatsApp confirmation', () => {
 it('builds direct chat links for both contacts with encoded messages', () => {
  const url = whatsappUrl(whatsappContacts.camila.phone, '¡Hola! ♡');
  expect(url).toBe(`https://wa.me/${whatsappContacts.camila.phone}?text=${encodeURIComponent('¡Hola! ♡')}`);
  expect(whatsappContacts.camila.phone).toBe('593998891074');
  expect(whatsappContacts.papa.phone).toBe('593979105887');
 });
 it('describes party size and attendance in the guest message', () => {
  expect(attendanceWhatsAppMessage({ name: 'Ana', attending: true, partySize: 1 })).toContain('Solo voy yo');
  expect(attendanceWhatsAppMessage({ name: 'Ana', attending: true, partySize: 3 })).toContain('Vamos 3 personas');
  expect(attendanceWhatsAppMessage({ name: 'Ana', attending: true, partySize: 2 })).toContain('Confirmo mi asistencia');
  expect(attendanceWhatsAppMessage({ name: 'Ana', attending: false, partySize: 0 })).toContain('no poder acompañar');
 });
 it('addresses each contact correctly', () => {
  expect(attendanceWhatsAppMessage({ name: 'Ana', attending: true, partySize: 1 }, 'camila')).toContain('¡Hola Camila!');
  expect(attendanceWhatsAppMessage({ name: 'Ana', attending: true, partySize: 1 }, 'papa')).toContain('Papá de Camila');
  expect(attendanceWhatsAppMessage({ name: 'Ana', attending: true, partySize: 1 }, 'papa')).not.toContain('¡Hola Camila!');
 });
});
describe('Google Calendar events', () => {
 it('builds a Google Calendar template URL with the right dates', () => {
  const url = googleCalendarUrl(ceremonyCalendarEvent);
  expect(url).toContain('https://calendar.google.com/calendar/render?');
  expect(url).toContain('action=TEMPLATE');
  expect(url).toContain('dates=20261031T140000Z%2F20261031T160000Z');
  expect(googleCalendarUrl(receptionCalendarEvent)).toContain('dates=20261031T170000Z%2F20261031T230000Z');
 });
 it('uses the church maps short link as the ceremony location', () => {
  expect(churchMapsUrl).toBe('https://maps.app.goo.gl/axkAyUdVQWWHcy2i7');
  expect(ceremonyCalendarEvent.location).toBe(churchMapsUrl);
  expect(decodeURIComponent(googleCalendarUrl(ceremonyCalendarEvent))).toContain(churchMapsUrl);
  expect(receptionCalendarEvent.location).toContain('Propiedad del Nogal');
 });
 it('keeps the downloadable ics pointing at the same church link', () => {
  expect(celebrationCalendar()).toContain(churchMapsUrl);
 });
});
describe('Guestbook notes', () => {
 it('accepts a note and trims the fields', () => {
  expect(guestNoteSchema.parse({ name: '  Ana  ', message: '  Feliz cumple!  ' })).toEqual({ name: 'Ana', message: 'Feliz cumple!' });
  expect(guestNoteSchema.parse({ name: '', message: 'Un deseo bonito' }).name).toBe('');
 });
 it('rejects empty messages and oversized fields', () => {
  expect(guestNoteSchema.safeParse({ name: '', message: '' }).success).toBe(false);
  expect(guestNoteSchema.safeParse({ name: 'x'.repeat(41), message: 'hola' }).success).toBe(false);
  expect(guestNoteSchema.safeParse({ name: '', message: 'x'.repeat(301) }).success).toBe(false);
 });
});
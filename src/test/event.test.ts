import { describe, expect, it } from 'vitest';
import { attendanceSchema, celebrationCalendar } from '@/lib/event';
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
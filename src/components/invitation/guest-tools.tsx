import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CalendarPlus, Check, Heart, LoaderCircle, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { attendanceSchema, attendanceWhatsAppMessage, celebrationCalendar, ceremonyStartUtc, questionSchema, whatsappContacts, whatsappUrl } from '@/lib/event';
import { askEventQuestion, submitAttendance } from '@/lib/event.functions';

export function Countdown() {
 const [left, setLeft] = useState<number | null>(null);
 useEffect(() => {
  const tick = () => setLeft(Math.max(0, ceremonyStartUtc - Date.now()));
  tick();
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
 }, []);
 const pad = (n: number) => String(n).padStart(2, '0');
 const cells: [string, string][] = left == null
  ? [['días', '––'], ['horas', '––'], ['min', '––'], ['seg', '––']]
  : [['días', String(Math.floor(left / 864e5))], ['horas', pad(Math.floor(left / 36e5) % 24)], ['min', pad(Math.floor(left / 6e4) % 60)], ['seg', pad(Math.floor(left / 1e3) % 60)]];
 return <div className="countdown" role="timer" aria-label="Cuenta regresiva hasta la ceremonia">
  {left === 0 ? <p className="countdown-today">¡Ya llegó el gran día! ♡</p>
   : cells.map(([label, value]) =>
    <div className="countdown-cell" key={label}>
     <span className="countdown-value">{value}</span>
     <span className="countdown-label">{label}</span>
    </div>)}
 </div>;
}

export function CalendarSave() {
 const [error, setError] = useState('');
 return <div className="calendar-save"><Button variant="stationery" onClick={() => {
  try {
   const url = URL.createObjectURL(new Blob([celebrationCalendar()], { type: 'text/calendar;charset=utf-8' }));
   const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'camila-mis-18.ics'; anchor.click();
   window.setTimeout(() => URL.revokeObjectURL(url), 1000); setError('');
  } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar.'); }
 }}><CalendarPlus size={15}/> Guardar en mi calendario</Button>{error && <p role="alert" className="tool-error">{error}</p>}</div>;
}

export function AttendanceForm() {
 const submit = useServerFn(submitAttendance);
 const [name, setName] = useState('');
 const [attending, setAttending] = useState(true);
 const [partySize, setPartySize] = useState('1');
 const [busy, setBusy] = useState(false);
 const [sent, setSent] = useState(false);
 const [error, setError] = useState('');
 const submissionId = useRef<string | null>(null);
 return <section id="confirmar" className="section attendance-section"><p className="eyebrow">Tu lugar en este recuerdo</p><h2 className="section-heading">¿Celebramos <em>juntos?</em></h2>
 {sent ? <div className="attendance-success" role="status"><Check size={30}/><h3>¡Gracias, {name}!</h3><p>{attending ? `Tu asistencia quedó registrada para ${partySize} ${Number(partySize) === 1 ? 'persona' : 'personas'}.` : 'Registramos que no podrás asistir. Te llevaré en mi corazón. ♡'}</p><div className="whatsapp-row"><Button variant="invitation" asChild><a href={whatsappUrl(whatsappContacts.camila.phone, attendanceWhatsAppMessage({ name: name.trim() || 'un invitado', attending, partySize: Number(partySize) }, 'camila'))} target="_blank" rel="noreferrer"><Heart size={15}/> Confirmar por WhatsApp <Send size={14}/></a></Button><Button variant="stationery" asChild><a href={whatsappUrl(whatsappContacts.papa.phone, attendanceWhatsAppMessage({ name: name.trim() || 'un invitado', attending, partySize: Number(partySize) }, 'papa'))} target="_blank" rel="noreferrer">Avisar a papá</a></Button></div></div> : <form className="note-form guest-tool-form" onSubmit={async e => {
  e.preventDefault(); if (busy) return; setError('');
  if (!submissionId.current) submissionId.current = crypto.randomUUID();
  const parsed = attendanceSchema.safeParse({ submissionId: submissionId.current, name, attending, partySize: attending ? Number(partySize) : 0 });
  if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Revisa tus datos.'); return; }
  setBusy(true);
  try { const result = await submit({ data: parsed.data }); if (!result.ok) setError(result.error ?? 'No se pudo guardar.'); else setSent(true); }
  catch { setError('No pudimos guardar tu confirmación. Inténtalo nuevamente.'); }
  finally { setBusy(false); }
 }}>
 <label htmlFor="rsvp-name">Tu nombre</label><input id="rsvp-name" className="note-input" value={name} onChange={e => setName(e.target.value)} maxLength={80} required placeholder="Nombre y apellido" disabled={busy}/>
 <fieldset className="attendance-options" disabled={busy}><legend>¿Asistirás?</legend><label><input type="radio" name="attendance" checked={attending} onChange={() => setAttending(true)}/> Sí, ¡ahí estaré!</label><label><input type="radio" name="attendance" checked={!attending} onChange={() => setAttending(false)}/> No podré asistir</label></fieldset>
 {attending && <><label htmlFor="party-size">Total de personas, incluyéndote</label><input id="party-size" className="note-input party-input" type="number" min={1} step={1} required value={partySize} onChange={e => setPartySize(e.target.value)} disabled={busy}/></>}
 {error && <p role="alert" className="tool-error">{error}</p>}
 <Button variant="invitation" type="submit" disabled={busy}>{busy ? <LoaderCircle className="busy-icon" size={16}/> : <Check size={16}/>} {busy ? 'Guardando…' : 'Confirmar mi respuesta'}</Button>
 </form>}</section>;
}

export function EventQuestions() {
 const ask = useServerFn(askEventQuestion);
 const [question, setQuestion] = useState('');
 const [answer, setAnswer] = useState('');
 const [error, setError] = useState('');
 const [busy, setBusy] = useState(false);
 return <section className="section questions-section"><MessageCircle className="event-icon"/><p className="eyebrow">Antes del gran día</p><h2 className="section-heading">¿Tienes alguna <em>pregunta?</em></h2>
 <form className="note-form guest-tool-form" onSubmit={async e => {
  e.preventDefault(); if (busy) return;
  if (!questionSchema.safeParse({ question }).success) return;
  setBusy(true); setError(''); setAnswer('');
  try { const result = await ask({ data: { question } }); setAnswer(result.answer ?? ''); setError(result.error ?? ''); }
  catch { setError('No pudimos conectar. Inténtalo más tarde.'); }
  finally { setBusy(false); }
 }}><label htmlFor="event-question">Tu pregunta sobre la celebración</label><textarea id="event-question" className="note-input" placeholder="¿A qué hora empieza la recepción?" rows={2} maxLength={500} required value={question} onChange={e => setQuestion(e.target.value)} disabled={busy}/><Button variant="invitation" type="submit" disabled={busy || !question.trim()}>{busy ? <LoaderCircle className="busy-icon" size={15}/> : <Send size={15}/>} {busy ? 'Consultando…' : 'Preguntar'}</Button></form>
 {busy && <p role="status" className="status">Preparando tu respuesta…</p>}{error && <p role="alert" className="tool-error">{error}</p>}{answer && <div className="event-answer" role="status"><p className="eyebrow">Respuesta · IA</p><p>{answer}</p></div>}
 </section>;
}
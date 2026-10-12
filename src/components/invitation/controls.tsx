import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowDown, ArrowUpRight, Heart, LoaderCircle, Music2, Pause, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { launchPartyBalloons } from '@/components/ui/balloons';
import { guestNoteSchema, type GuestNote } from '@/lib/event';
import { loadGuestNotes, saveGuestNote } from '@/lib/event.functions';
import melody from '@/assets/birthday-melody.wav';
import bow from '@/assets/green-bow.png';
import disco from '@/assets/cdisco.png';

export function EnvelopeReveal({ children }: { children: ReactNode }) {
 const [stage, setStage] = useState<'closed' | 'opening' | 'opened'>('closed');
 const content = useRef<HTMLDivElement>(null);
 const balloonsLaunched = useRef(false);
 const openEnvelope = useCallback(() => setStage(s => (s === 'closed' ? 'opening' : s)), []);
 useEffect(() => {
  if (stage !== 'closed') return;
  const onWheel = (e: WheelEvent) => { if (e.deltaY > 10) openEnvelope(); };
  let touchY: number | null = null;
  const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? null; };
  const onTouchMove = (e: TouchEvent) => {
   if (touchY === null) return;
   const y = e.touches[0]?.clientY ?? touchY;
   if (touchY - y > 24) openEnvelope();
  };
  const onKeyDown = (e: KeyboardEvent) => {
   if (e.key === 'ArrowDown' || e.key === 'PageDown') openEnvelope();
  };
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('keydown', onKeyDown);
  return () => {
   window.removeEventListener('wheel', onWheel);
   window.removeEventListener('touchstart', onTouchStart);
   window.removeEventListener('touchmove', onTouchMove);
   window.removeEventListener('keydown', onKeyDown);
  };
 }, [stage, openEnvelope]);
 useEffect(() => {
  if (stage !== 'opening') return;
  if (!balloonsLaunched.current) {
   balloonsLaunched.current = true;
   if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) launchPartyBalloons();
  }
  const timer = window.setTimeout(() => setStage('opened'), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1900);
  return () => window.clearTimeout(timer);
 }, [stage]);
 useEffect(() => {
  if (stage !== 'opened') return;
  window.scrollTo({ top: 0, behavior: 'instant' });
  content.current?.focus({ preventScroll: true });
 }, [stage]);
 if (stage === 'opened') return <div ref={content} tabIndex={-1} className="revealed-invitation">{children}</div>;
 return <section className={`envelope-screen ${stage === 'opening' ? 'is-opening' : ''}`} aria-label="Invitación de cumpleaños de Camila">
   <img className="envelope-disco" src={disco} alt="" width={200} height={200}/>
  <div className="envelope-heading"><p className="eyebrow">Una invitación muy especial</p><h1>Camila Arias<span>Mis 18</span></h1><p className="envelope-date">31 · OCTUBRE · 2026</p></div>
  <div className="envelope-scene" aria-hidden="true">
   <span className="envelope-spark spark-one">✦</span><span className="envelope-spark spark-two">✧</span>
    <div className="envelope-object"><div className="envelope-back"/><div className="envelope-letter"><span>Estás invitad@</span><strong>Camila</strong><p>Una fecha, mil recuerdos. ♡</p></div><div className="envelope-pocket"/><div className="envelope-flap"/><div className="envelope-address"><span>Para:</span><strong>mi persona favorita</strong><small>QUITO · ECUADOR</small></div><div className="envelope-seal"><Heart size={23} strokeWidth={1.3}/></div><img className="envelope-bow" src={bow} alt="" width={1024} height={1024}/></div>
  </div>
  <Button variant="invitation" className="envelope-open" onClick={openEnvelope} disabled={stage !== 'closed'}> {stage === 'opening' ? 'Para ti, con cariño…' : 'Abrir invitación'} <ArrowUpRight size={16}/></Button>
  {stage === 'closed' && <p className="envelope-hint"><ArrowDown size={12}/> o desliza hacia abajo</p>}
  <p className="envelope-signature">Con cariño, Cami ♡</p>
 </section>;
}

export function MusicPlayer() {
 const audio = useRef<HTMLAudioElement>(null);
 const [playing, setPlaying] = useState(false);
 const [error, setError] = useState(false);
 async function toggle() {
  if (!audio.current) return;
  if (playing) { audio.current.pause(); setPlaying(false); return; }
  try { await audio.current.play(); setPlaying(true); setError(false); } catch { setPlaying(false); setError(true); }
 }
 return <><Button variant="ghost" size="icon" className="music-control" onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'} aria-pressed={playing} title={playing ? 'Pausar música' : 'Reproducir música'}>{playing ? <Pause size={16}/> : <Music2 size={16}/>}</Button><audio ref={audio} src={melody} loop preload="none" onError={() => { setPlaying(false); setError(true); }}/>{error && <p role="status" className="music-error">No se pudo reproducir la música. Inténtalo nuevamente.</p>}</>;
}

function noteAgo(iso: string) {
 try {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });
 } catch {
  return '';
 }
}

export function Guestbook() {
 const load = useServerFn(loadGuestNotes);
 const save = useServerFn(saveGuestNote);
 const [name, setName] = useState('');
 const [message, setMessage] = useState('');
 const [notes, setNotes] = useState<GuestNote[]>([]);
 const [loading, setLoading] = useState(true);
 const [failed, setFailed] = useState(false);
 const [busy, setBusy] = useState(false);
 const [sent, setSent] = useState(false);
 const [error, setError] = useState('');
 const refresh = useCallback(async () => {
  setLoading(true);
  try {
   const result = await load();
   setNotes(result.notes);
   setFailed(!result.ok);
  } catch {
   setFailed(true);
  } finally {
   setLoading(false);
  }
 }, [load]);
 useEffect(() => { void refresh(); }, [refresh]);
 return <div className="guestbook">
  <img src={bow} className="guestbook-bow" alt="" width={1024} height={1024} loading="lazy"/>
  <p className="eyebrow">Un recuerdo para siempre</p>
  <h2 className="section-heading">Palabras que <em>abrazan.</em></h2>
  <p className="section-subtitle">Un deseo, una anécdota, algo bonito…<br/>Me encantará leerte en este día tan especial.</p>
  <form className="note-form" onSubmit={async e => {
   e.preventDefault(); if (busy) return; setError('');
   const parsed = guestNoteSchema.safeParse({ name, message });
   if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Revisa tu mensaje.'); return; }
   setBusy(true);
   try {
    const result = await save({ data: parsed.data });
    if (!result.ok || !result.note) setError(result.error ?? 'No pudimos guardar tu mensaje.');
    else {
     setNotes(current => [result.note as GuestNote, ...current]);
     setMessage(''); setSent(true); setFailed(false);
    }
   } catch {
    setError('No pudimos guardar tu mensaje. Inténtalo nuevamente.');
   } finally {
    setBusy(false);
   }
  }}>
   <label htmlFor="guest-name">De parte de</label><input id="guest-name" className="note-input" placeholder="Tu nombre (opcional)" value={name} onChange={e => setName(e.target.value)} maxLength={40} disabled={busy}/>
   <label htmlFor="guest-message">Tu mensaje para Camila</label><textarea id="guest-message" className="note-input" placeholder="Escribe algo bonito…" value={message} onChange={e => {setMessage(e.target.value);setSent(false);setError('');}} maxLength={300} required rows={3} disabled={busy}/>
   <div className="form-bottom"><span className="form-counter">{message.length} / 300</span><Button variant="invitation" type="submit" disabled={busy || !message.trim()}>{busy ? <LoaderCircle className="busy-icon" size={14}/> : <Send size={14}/>} {busy ? 'Enviando…' : 'Enviar con cariño'}</Button></div>
   {error && <p role="alert" className="tool-error">{error}</p>}
  </form>
  {sent && <p className="status" role="status">¡Gracias! Tu mensaje ya está en la invitación. ♡</p>}
  {loading
   ? <div className="notes" aria-busy="true" aria-label="Cargando mensajes"><div className="guest-note skeleton-note"/><div className="guest-note skeleton-note"/></div>
   : failed
    ? <p role="alert" className="guestbook-empty">No pudimos cargar los mensajes. <button type="button" className="guest-retry" onClick={() => void refresh()}>Intentar de nuevo</button></p>
    : notes.length === 0
     ? <p className="guestbook-empty">Sé el primero en dejarle un mensaje ♡</p>
     : <div className="notes">{notes.map(note => <article key={note.id} className="guest-note"><div className="guest-note-meta"><Heart size={14} aria-hidden="true"/><time dateTime={note.created_at}>{noteAgo(note.created_at)}</time></div><p>{note.message}</p><footer>Con cariño, {note.author_name}</footer></article>)}</div>}
 </div>;
}

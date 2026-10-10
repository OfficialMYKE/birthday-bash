import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Heart, Music2, Pause, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import melody from '@/assets/birthday-melody.wav.asset.json';
import bow from '@/assets/green-bow.png';
import disco from '@/assets/cdisco.png.asset.json';

export function EnvelopeReveal({ children }: { children: ReactNode }) {
 const [stage, setStage] = useState<'closed' | 'opening' | 'opened'>('closed');
 const content = useRef<HTMLDivElement>(null);
 useEffect(() => {
  if (stage !== 'opening') return;
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
   <img className="envelope-disco" src={disco.url} alt="" width={200} height={200}/>
  <div className="envelope-heading"><p className="eyebrow">Una invitación muy especial</p><h1>Camila Arias<span>Mis 18</span></h1><p className="envelope-date">31 · OCTUBRE · 2026</p></div>
  <div className="envelope-scene" aria-hidden="true">
   <span className="envelope-spark spark-one">✦</span><span className="envelope-spark spark-two">✧</span>
    <div className="envelope-object"><div className="envelope-back"/><div className="envelope-letter"><span>Estás invitad@</span><strong>Camila</strong><p>Una fecha, mil recuerdos. ♡</p></div><div className="envelope-pocket"/><div className="envelope-flap"/><div className="envelope-address"><span>Para:</span><strong>mi persona favorita</strong><small>QUITO · ECUADOR</small></div><div className="envelope-seal"><Heart size={23} strokeWidth={1.3}/></div><img className="envelope-bow" src={bow} alt="" width={1024} height={1024}/></div>
  </div>
  <Button variant="invitation" className="envelope-open" onClick={() => setStage('opening')} disabled={stage !== 'closed'}> {stage === 'opening' ? 'Para ti, con cariño…' : 'Abrir invitación'} <ArrowUpRight size={16}/></Button>
  <p className="envelope-signature">Con cariño, Cami ♡</p>
 </section>;
}

export const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('¡Hola Camila! Confirmo mi asistencia a tus 18 🎉')}`;

export function MusicPlayer() {
 const audio = useRef<HTMLAudioElement>(null);
 const [playing, setPlaying] = useState(false);
 const [error, setError] = useState(false);
 async function toggle() {
  if (!audio.current) return;
  if (playing) { audio.current.pause(); setPlaying(false); return; }
  try { await audio.current.play(); setPlaying(true); setError(false); } catch { setPlaying(false); setError(true); }
 }
 return <><Button variant="ghost" size="icon" className="music-control" onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'} aria-pressed={playing} title={playing ? 'Pausar música' : 'Reproducir música'}>{playing ? <Pause size={16}/> : <Music2 size={16}/>}</Button><audio ref={audio} src={melody.url} loop preload="none" onError={() => { setPlaying(false); setError(true); }}/>{error && <p role="status" className="music-error">No se pudo reproducir la música. Inténtalo nuevamente.</p>}</>;
}

export function Guestbook() {
 const [name, setName] = useState('');
 const [message, setMessage] = useState('');
 const [notes, setNotes] = useState<{name:string; message:string}[]>([]);
 const [sent, setSent] = useState(false);
 return <div className="guestbook">
  <img src={bow} className="guestbook-bow" alt="" width={1024} height={1024} loading="lazy"/>
  <p className="eyebrow">Un recuerdo para siempre</p>
  <h2 className="section-heading">Palabras que <em>abrazan.</em></h2>
  <p className="section-subtitle">Un deseo, una anécdota, algo bonito…<br/>Me encantará leerte en este día tan especial.</p>
  <form className="note-form" onSubmit={e => { e.preventDefault(); if (!message.trim()) return; setNotes([{name:name.trim() || 'Anónim@',message:message.trim()},...notes]); setName('');setMessage('');setSent(true); }}>
   <label htmlFor="guest-name">De parte de</label><input id="guest-name" className="note-input" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} maxLength={40}/>
   <label htmlFor="guest-message">Tu mensaje para Camila</label><textarea id="guest-message" className="note-input" placeholder="Escribe algo bonito…" value={message} onChange={e => {setMessage(e.target.value);setSent(false);}} maxLength={300} required rows={3}/>
   <div className="form-bottom"><span className="form-counter">{message.length} / 300</span><Button variant="invitation" type="submit" disabled={!message.trim()}>Enviar con cariño <Send size={14}/></Button></div>
  </form>
  {sent && <p className="status" role="status">Tu mensaje se añadió a esta invitación. ♡</p>}
  <div className="notes">{notes.map((note,i) => <article key={i} className="guest-note"><Heart className="mb-3 text-primary" size={16}/><p>{note.message}</p><footer>Con cariño, {note.name}</footer></article>)}</div>
 </div>;
}

import { useRef, useState } from 'react';
import { Heart, Music2, Pause, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import melody from '@/assets/birthday-melody.wav.asset.json';
import bow from '@/assets/pink-bow.png';

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

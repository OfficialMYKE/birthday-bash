import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, ArrowUpRight, Church, Heart, MapPin, PartyPopper, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnvelopeReveal, Guestbook, MusicPlayer } from '@/components/invitation/controls';
import { churchMapsUrl, defaultConfirmMessage, defaultConfirmMessagePapa, whatsappContacts, whatsappUrl } from '@/lib/event';
import heart from '@/assets/chheart.png';
import disco from '@/assets/cdisco.png';
import kiss from '@/assets/kiss.png';
import star from '@/assets/sstar.png';
import bow from '@/assets/green-bow.png';
import eighteen from '@/assets/green-eighteen.png';
import puppy from '@/assets/cami-puppy.jpg';
import girl from '@/assets/cami-girl.jpg';
import casual from '@/assets/cami-casual.jpg';
import graduation from '@/assets/cami-graduation.jpg';
import { AttendanceForm, CalendarSave, Countdown, EventQuestions } from '@/components/invitation/guest-tools';

export const Route = createFileRoute('/')({
 head: () => ({meta:[
  {title:'Camila Arias · Mis 18 · 31 de octubre de 2026'},
  {name:'description',content:'Una fecha, mil recuerdos. Celebra los 18 años de Camila Arias el sábado 31 de octubre de 2026. Ceremonia, recepción y confirmación de asistencia.'},
  {property:'og:title',content:'Estás invitad@ · Los 18 de Camila Arias'},
  {property:'og:description',content:'Acompáñame a celebrar mis 18 años. Sábado 31 de octubre de 2026, ceremonia en Amagasí del Inca y recepción en Perucho.'},
  {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}
 ]}),component:Index,
});
function CalendarNote() {
 return <div className="calendar-note" aria-label="Octubre de 2026, sábado 31 señalado"><p className="calendar-title">octubre '26</p><div className="calendar-grid" aria-hidden="true">{['L','M','M','J','V','S','D'].map((d,i)=><b key={`day-${i}`}>{d}</b>)}{[0,1,2].map(i=><span key={`blank-${i}`}/>)}{Array.from({length:31},(_,i)=><span key={i} className={i===30?'selected-day':''}>{i+1}</span>)}</div><div className="calendar-foot">it's a date! ♡</div></div>;
}
function Index() {
 return <EnvelopeReveal><main className="invitation"><div className="paper">
  <header className="topbar"><a href="#" className="monogram" aria-label="Camila, inicio">C <Heart size={13} strokeWidth={1}/></a><span className="topbar-label">Una nueva vuelta al sol · Camila Arias</span><MusicPlayer/></header>
  <section className="hero">
   <img src={bow} className="hero-bow" alt="" width={1024} height={1024}/><img src={disco} className="hero-disco" alt="" width={200} height={200}/>
   <p className="eyebrow">Estás invitad@ a mis 18</p>
    <h1 className="hero-heading">IT’S MY <em>BIRTHDAY!</em></h1><p className="hero-name">Camila Arias</p>
   <div className="collage">
    <CalendarNote/>
    <div className="polaroid"><span className="photo-tape"/><img src={casual} alt="Camila Arias" className="portrait" width={1200} height={1600}/><div className="photo-label">Camila Arias ♡</div><img src={heart} className="photo-heart" alt="" width={150} height={150}/></div>
    <div className="age-note"><img src={star} className="age-star" alt="" width={60} height={60}/><img src={eighteen} className="age-balloons" alt="18 años" width={1024} height={1024}/><div className="age-caption">make a wish ♡</div></div>
    <img src={kiss} className="collage-kiss" alt="" width={120} height={100}/><span className="collage-annotation">mi día, contigo ♡</span>
   </div>
   <p className="intro">Hay momentos que se vuelven inolvidables<br/>cuando los compartes con tus personas favoritas.<br/>Y tú eres una de ellas.</p>
    <Button variant="invitation" asChild><a href="#confirmar"><Heart size={15}/> Sí, ¡ahí estaré! <ArrowDown size={14}/></a></Button>
   <a href="#detalles" className="hero-footer">Todos los detalles <ArrowDown size={12}/></a>
  </section>
  <section className="memory-strip" aria-label="Un poco de mi historia">
   <p className="eyebrow">Un poco de mi historia</p>
   <h2 className="memory-heading">De pequeña <em>a hoy.</em></h2>
   <div className="memory-row">
    <figure className="memory-polaroid"><img src={puppy} alt="Camila de bebé con su perrito" loading="lazy" width={1195} height={867}/><figcaption>mi primer amor ♡</figcaption></figure>
    <figure className="memory-polaroid"><img src={girl} alt="Camila de niña con moños" loading="lazy" width={543} height={712}/><figcaption>con mis moñitos</figcaption></figure>
    <figure className="memory-polaroid"><img src={graduation} alt="Camila con su bata de grado" loading="lazy" width={1200} height={1600}/><figcaption>¡bata de grado! ♡</figcaption></figure>
   </div>
  </section>
   <div className="date-band"><p className="eyebrow">Save the date</p><p className="date">Sábado <span>♡</span> 31 de octubre <span>♡</span> 2026</p><Countdown/><CalendarSave/></div>
  <section id="detalles" className="section"><p className="eyebrow">El plan de nuestro día</p><h2 className="section-heading">Un día para <em>recordar.</em></h2><p className="section-subtitle">Dos momentos especiales. Las mismas ganas de celebrar contigo.</p>
   <div className="event-grid"><article className="event-item"><Church className="event-icon"/><p className="eyebrow">01 · Con el corazón</p><h3>La ceremonia</h3><p className="event-time">9:00 a.m. — 11:00 a.m.</p><p>Iglesia de Amagasí del Inca</p><p>Quito</p><Button variant="stationery" asChild><a href={churchMapsUrl} target="_blank" rel="noreferrer"><MapPin size={14}/> Ver ubicación <ArrowUpRight size={13}/></a></Button></article>
   <article className="event-item"><PartyPopper className="event-icon"/><p className="eyebrow">02 · A celebrar</p><h3>La recepción</h3><p className="event-time">12:00 p.m. — 6:00 p.m.</p><p>Propiedad del Nogal</p><p>Perucho</p><Button variant="stationery" asChild><a href="https://www.google.com/maps/search/?api=1&query=Propiedad+del+Nogal+Perucho" target="_blank" rel="noreferrer"><MapPin size={14}/> Ver ubicación <ArrowUpRight size={13}/></a></Button></article></div>
  </section>
   <AttendanceForm/>
   <EventQuestions/>
   <section className="guestbook-band"><div className="section"><Guestbook/></div></section>
  <section className="final-section"><h2>Los mejores recuerdos llevan tu nombre.</h2><p className="section-subtitle">Si prefieres confirmar por mensaje, escríbeme:</p><div className="whatsapp-row"><Button variant="invitation" asChild><a href={whatsappUrl(whatsappContacts.camila.phone, defaultConfirmMessage)} target="_blank" rel="noreferrer"><Heart size={15}/> Confirmar con Camila <Send size={14}/></a></Button><Button variant="stationery" asChild><a href={whatsappUrl(whatsappContacts.papa.phone, defaultConfirmMessagePapa)} target="_blank" rel="noreferrer">Avisar a papá <ArrowUpRight size={13}/></a></Button></div></section>
  <footer className="page-footer"><span>Camila Arias · Mis 18</span><span>Hecho con mucho cariño ♡ · 31.10.2026</span></footer>
  </div></main></EnvelopeReveal>;
}

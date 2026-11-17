import Link from "next/link";
import Logo from "./logo";

function TruckIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 6h12v11H2zM14 10h4l4 4v3h-8z" strokeLinejoin="round"/><circle cx="6" cy="19" r="1.7"/><circle cx="18" cy="19" r="1.7"/></svg>; }
function ShieldIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6z" strokeLinejoin="round"/><path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ChatIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.5-.7L4 20l1.4-3.7A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" strokeLinejoin="round"/></svg>; }

const footerLink = "transition hover:text-[#EBD6A8]";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="border-b border-white/10 bg-[#0a0a09]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 py-7 sm:grid-cols-3 sm:gap-4 sm:px-8 sm:py-8 lg:px-12">
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left"><span className="text-[#EBD6A8]"><TruckIcon /></span><div><p className="text-[10px] font-bold tracking-wide">ENVÍOS A TODO CHILE</p><p className="mt-1 text-[10px] text-white/40">Despacho a lo largo del país.</p></div></div>
          <div className="flex items-center justify-center gap-3 text-center"><span className="text-[#EBD6A8]"><ShieldIcon /></span><div><p className="text-[10px] font-bold tracking-wide">CALIDAD Y CUIDADO</p><p className="mt-1 text-[10px] text-white/40">Consulta los detalles de cada producto.</p></div></div>
          <div className="flex items-center justify-center gap-3 text-center sm:justify-end sm:text-left"><span className="text-[#EBD6A8]"><ChatIcon /></span><div><p className="text-[10px] font-bold tracking-wide">ATENCIÓN POR WHATSAPP</p><p className="mt-1 text-[10px] text-white/40">Resolvemos tus dudas directamente.</p></div></div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-10 sm:grid-cols-2 sm:px-8 sm:py-14 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] lg:gap-12 lg:px-12">
        <div className="max-w-[330px]"><Logo /><p className="mt-5 max-w-xs text-xs leading-6 text-white/45">Proteína, creatina y colágeno para acompañar tu rutina de rendimiento.</p></div>
        <div><h3 className="mb-4 text-[9px] font-semibold tracking-[0.2em] text-[#EBD6A8]">SUPLEMENTOS</h3><ul className="space-y-2.5 text-xs text-white/55"><li><Link className={footerLink} href="/productos/proteina">Proteína</Link></li><li><Link className={footerLink} href="/productos/creatina">Creatina</Link></li><li><Link className={footerLink} href="/productos/colageno">Colágeno + Açaí</Link></li><li><Link className={footerLink} href="/productos/pack-proteina-creatina">Pack proteína + creatina</Link></li></ul></div>
        <div><h3 className="mb-4 text-[9px] font-semibold tracking-[0.2em] text-[#EBD6A8]">TIENDA</h3><ul className="space-y-2.5 text-xs text-white/55"><li><Link className={footerLink} href="/productos">Todos los productos</Link></li><li><Link className={footerLink} href="/productos#objetivos">Compra por objetivo</Link></li><li><Link className={footerLink} href="/checkout">Carrito y checkout</Link></li></ul></div>
        <div><h3 className="mb-4 text-[9px] font-semibold tracking-[0.2em] text-[#EBD6A8]">CONTÁCTATE</h3><ul className="space-y-2.5 text-xs text-white/55"><li><a className={footerLink} href="https://wa.me/56947376830" target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li><a className={footerLink} href="https://instagram.com/phantom.protein" target="_blank" rel="noopener noreferrer">Instagram</a></li><li><a className={`${footerLink} break-all`} href="mailto:phantomproteinchile@gmail.com">phantomproteinchile@gmail.com</a></li></ul></div>
      </div>

      <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 py-5 text-[9px] tracking-wide text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><span>© {new Date().getFullYear()} PHANTOM PROTEIN</span><span>PHANTOMPROTEIN.CL</span></div></div>
    </footer>
  );
}

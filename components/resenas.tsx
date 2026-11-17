const comentarios = [
  "Me encantó el polvo de la proteína; el sabor me gustó y ya lo sumé a mi rutina.",
  "La creatina tiene muy buen precio. Era justo lo que estaba buscando.",
  "Buena atención desde el primer mensaje, respondieron todas mis dudas.",
  "El despacho llegó dentro del plazo que me habían indicado. Todo bien con el pedido.",
  "La proteína me gustó mucho, sobre todo que no tiene azúcar añadida.",
  "Buenos precios y una atención súper amable. Volvería a comprar.",
  "Me explicaron bien los productos y me ayudaron a elegir. Buena experiencia.",
  "El pedido llegó bien y sin complicaciones. Se agradece que avisen cómo va el despacho.",
];

export default function Resenas() {
  return (
    <section aria-labelledby="resenas-title" className="border-y border-white/10 bg-[#070707] py-14 text-white sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
        <div className="mb-9 text-center sm:mb-12">
          <p className="mb-3 text-[9px] font-medium tracking-[0.28em] text-[#EBD6A8]/80">LO QUE NOS HAN CONTADO</p>
          <h2 id="resenas-title" className="text-2xl font-bold uppercase tracking-[-0.03em] text-[#F5F3EE] sm:text-3xl md:text-4xl">OPINIONES DE CLIENTES</h2>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/45">Comentarios compartidos con Phantom Protein sobre los productos, la atención y el despacho.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {comentarios.map((comentario, index) => (
            <article key={index} className="flex min-h-[150px] flex-col justify-between border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#EBD6A8]/40">
              <span aria-hidden="true" className="text-xl leading-none text-[#EBD6A8]">“</span>
              <p className="mt-2 flex-1 text-[12px] leading-6 text-white/75">{comentario}</p>
              <p className="mt-4 text-[8px] font-semibold tracking-[0.18em] text-[#EBD6A8]/70">COMENTARIO RECIBIDO</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

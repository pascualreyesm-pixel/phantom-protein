export default function VideoOjos() {
  return (
    <section aria-label="Phantom Protein en movimiento" className="relative overflow-hidden bg-black py-5 sm:py-8">
      <div className="mx-auto max-w-[1600px] px-0 sm:px-8">
        <div className="relative overflow-hidden bg-[#050505] sm:border sm:border-white/10">
          <video
            className="block aspect-video max-h-[480px] w-full bg-black object-cover"
            controls
            playsInline
            preload="none"
            poster="/images/phantom/video-ojos-poster.webp"
            aria-label="Video Phantom Protein: primeros planos del envase, ojos rojos y escenas de entrenamiento"
          >
            <source src="/images/phantom/video-ojos-phantom.mp4" type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
        </div>
      </div>
    </section>
  );
}

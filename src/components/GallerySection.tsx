import photo1 from "../assets/Weeding.jpg";
import photo2 from "../assets/Weeding.jpg";
import photo3 from "../assets/Weeding.jpg";
import photo4 from "../assets/Weeding.jpg";
import photo5 from "../assets/Weeding.jpg";
export default function GallerySection() {
  const photos = [photo1, photo2, photo3, photo4, photo5];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold">Retratos de nuestro amor</h2>
      <p className="text-sm text-gray-600 mb-4">
        Un minuto, un segundo, un instante que queda en la eternidad
      </p>

      <div className="flex items-center gap-4">
        <div className="text-3xl">📷</div>

        <div className="overflow-hidden rounded-lg flex-1">
          <div className="flex animate-slide">
            {photos.map((p, i) => (
              <img
                key={i}
                src={p}
                alt={`photo-${i}`}
                className="w-64 h-40 object-cover flex-shrink-0"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(0) }
          33% { transform: translateX(-100%) }
          66% { transform: translateX(-200%) }
          100% { transform: translateX(0) }
        }
        .animate-slide { animation: slide 12s linear infinite; }
      `}</style>
    </section>
  );
}

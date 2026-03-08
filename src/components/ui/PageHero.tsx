import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
}

const PageHero = ({ title, subtitle, image, imageAlt = "" }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 overlay-warm z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
      <div className="relative h-[36vh] min-h-[300px] md:h-[42vh] md:min-h-[340px]">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container-church">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-3 md:mb-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg md:text-xl text-white/85 max-w-xl" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;

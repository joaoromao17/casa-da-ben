import { useState, useEffect } from "react";
import { MapPin, Instagram } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const MobileFloatingCTA = () => {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex gap-2 bg-card/90 backdrop-blur-md border border-warm-200 rounded-2xl shadow-xl p-2">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-church-gold text-church-900 font-semibold py-3.5 rounded-xl text-sm transition-colors hover:bg-church-goldLight"
            >
              <MapPin className="w-4 h-4" />
              Como Chegar
            </a>
            <a
              href="https://www.instagram.com/icb_610/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-warm-100 text-foreground font-medium py-3.5 px-5 rounded-xl text-sm transition-colors hover:bg-warm-200"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFloatingCTA;

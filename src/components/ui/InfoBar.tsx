import { MapPin, Clock, Navigation } from "lucide-react";
import { motion } from "framer-motion";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const InfoBar = () => {
  const items = [
    {
      icon: MapPin,
      label: "Endereço",
      value: "QS 610 — Samambaia Norte, DF",
    },
    {
      icon: Clock,
      label: "Próximo Culto",
      value: "Domingo às 20h",
    },
    {
      icon: Navigation,
      label: "Como Chegar",
      value: "Abrir no Google Maps",
      href: GOOGLE_MAPS_URL,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative z-30 -mt-10 md:-mt-12"
    >
      <div className="container-church">
        <div className="bg-card border border-warm-200 rounded-2xl shadow-lg p-5 md:p-0 md:grid md:grid-cols-3 md:divide-x md:divide-warm-200">
          {items.map((item, i) => {
            const Icon = item.icon;
            const content = (
              <div className={`flex items-center gap-4 md:justify-center md:py-6 md:px-6 ${i > 0 ? "mt-4 pt-4 border-t border-warm-200 md:mt-0 md:pt-0 md:border-t-0" : ""}`}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-church-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="block hover:bg-warm-50 transition-colors md:rounded-r-2xl">
                  {content}
                </a>
              );
            }
            return <div key={i}>{content}</div>;
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default InfoBar;

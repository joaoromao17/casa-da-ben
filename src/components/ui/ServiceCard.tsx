import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  day: string;
  time: string;
  title: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean;
  index?: number;
}

const ServiceCard = ({ day, time, title, description, icon: Icon, featured = false, index = 0 }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl p-6 md:p-8 transition-all duration-300 group ${
        featured
          ? "bg-warm-50 border-2 border-church-gold/40 shadow-lg"
          : "bg-card border border-warm-200 hover:border-church-gold/30 hover:shadow-md"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-6 bg-church-gold text-church-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Culto Principal
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${featured ? "bg-church-gold/20" : "bg-warm-100"}`}>
          <Icon className={`w-6 h-6 ${featured ? "text-church-gold" : "text-church-500"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-church-gold">{day}</p>
          <h3 className="text-xl font-semibold text-foreground mt-1">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1.5">{description}</p>
          <p className="text-2xl font-display font-bold text-foreground mt-3">{time}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;

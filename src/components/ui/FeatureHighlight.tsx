import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureHighlightProps {
  icon: LucideIcon;
  text: string;
  index?: number;
}

const FeatureHighlight = ({ icon: Icon, text, index = 0 }: FeatureHighlightProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-center gap-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-church-gold" />
      </div>
      <span className="text-sm font-medium text-foreground">{text}</span>
    </motion.div>
  );
};

export default FeatureHighlight;

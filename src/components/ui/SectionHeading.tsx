import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

const SectionHeading = ({ title, subtitle, centered = true, light = false, className = "" }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`${centered ? "text-center" : ""} mb-10 md:mb-14 ${className}`}
    >
      <h2 className={`heading-display text-3xl md:text-4xl lg:text-[2.75rem] ${light ? "text-white" : "text-foreground"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 md:mt-4 text-base md:text-lg max-w-2xl ${centered ? "mx-auto" : ""} ${light ? "text-white/75" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import claudeLogo from "@/assets/claude-logo.png";
import gptLogo from "@/assets/gpt-logo.png";
import n8nLogo from "@/assets/n8n-logo.png";
import vercelLogo from "@/assets/vercel-logo.png";
import namecheapLogo from "@/assets/namecheap-logo.png";

const LogoCarousel = () => {
  const logos = [
    { name: "Claude Sonnet", logo: claudeLogo },
    { name: "GPT", logo: gptLogo },
    { name: "n8n", logo: n8nLogo },
    { name: "GitHub", icon: Github },
    { name: "Vercel", logo: vercelLogo },
    { name: "Namecheap", logo: namecheapLogo },
  ];

  const extendedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden bg-background/50 backdrop-blur-sm py-12 mt-20">
      <motion.div 
        className="flex space-x-16"
        initial={{ opacity: 0, x: "0%" }}
        animate={{
          opacity: 1,
          x: "-50%"
        }}
        transition={{
          opacity: { duration: 0.5 },
          x: {
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }
        }}
        style={{
          width: "fit-content",
          display: "flex",
          gap: "4rem"
        }}
      >
        {extendedLogos.map((item, index) => (
          <motion.div
            key={`logo-${index}`}
            className="h-8 flex items-center justify-center gap-3 text-foreground font-semibold text-xl whitespace-nowrap"
            initial={{ opacity: 0.5 }}
            whileHover={{ 
              opacity: 1,
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            {item.icon ? (
              <item.icon className="w-6 h-6" />
            ) : (
              <img src={item.logo} alt={item.name} className="h-6 w-6 object-contain" />
            )}
            {item.name}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LogoCarousel;

import { motion } from "framer-motion";
import { useRef } from "react";
import { Target } from "lucide-react";

const missions = [
  {
    title: "The AI Internet Factory",
    description: "To simplify digital creation by fusing web design, automation, and AI intelligence into one seamless experience.",
    gradient: "from-indigo-600 via-blue-500 to-cyan-400"
  },
  {
    title: "The Future Operating System of the Web",
    description: "To build a unified digital ecosystem that redefines how the internet is created, owned, and automated.",
    gradient: "from-orange-500 via-pink-500 to-indigo-600"
  },
  {
    title: "Empower Human Imagination with AI",
    description: "To unlock human creativity by combining intuitive design with intelligent automation, giving everyone the tools to transform ideas into living digital experiences.",
    gradient: "from-indigo-900 via-orange-600 to-orange-500"
  }
];

const MissionSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Vision</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Why Avallon</h2>
        </motion.div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[85vw] md:min-w-[500px] snap-center"
            >
              <div className={`h-[400px] rounded-3xl bg-gradient-to-br ${mission.gradient} p-8 md:p-12 flex flex-col justify-center relative overflow-hidden`}>
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white text-sm font-medium">
                    The vision
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {mission.title.split(" with AI")[0]}
                  {mission.title.includes("with AI") && (
                    <span className="text-orange-700 dark:text-orange-200"> with AI</span>
                  )}
                </h3>
                
                <p className="text-base md:text-lg text-gray-800 dark:text-white/90 max-w-xl">
                  {mission.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

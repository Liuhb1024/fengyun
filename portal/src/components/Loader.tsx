import { motion } from 'framer-motion';

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#05060f] text-white">
    <motion.div
      className="flex items-center gap-3 font-display text-lg tracking-[0.3em]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
    >
      <span className="h-2 w-2 rounded-full bg-accent" />
      <span>IGNITING HERITAGE</span>
      <span className="h-2 w-2 rounded-full bg-accent" />
    </motion.div>
  </div>
);

export default Loader;

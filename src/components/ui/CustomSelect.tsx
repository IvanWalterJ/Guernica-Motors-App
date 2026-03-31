import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = "Seleccionar...", className = "", buttonClassName = "px-4 py-2.5 text-sm" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white/5 border border-white/10 rounded-lg text-white flex justify-between items-center cursor-pointer hover:border-white/30 transition-colors ${buttonClassName}`}
      >
        <span className="font-light truncate mr-4">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden shadow-2xl max-h-60 overflow-y-auto"
          >
            {options.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-gradient-guernica text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
const ActionButton = ({
    onClick,
    icon: Icon,
    label,
    variant = 'secondary',
    className = '',
    active = false,
    title = ''
}) => {
    const baseStyles = "h-12 flex items-center justify-center gap-2 px-6 rounded-full font-bold transition-all transition-colors duration-300 transform active:scale-95 shadow-lg border";

    const variants = {
        primary: "bg-white text-black border-transparent hover:bg-gray-200",
        secondary: active
            ? "bg-green-500/20 border-green-500 text-green-500"
            : "bg-zinc-900/60 backdrop-blur-md border-white/10 text-white hover:bg-white/10 hover:border-white/20",
        iconOnly: "w-12 px-0 bg-zinc-900/60 backdrop-blur-md border-white/10 text-white hover:bg-white/10 hover:border-white/20"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            title={title}
            className={`${baseStyles} ${variants[label ? variant : 'iconOnly']} ${className}`}
        >
            {Icon && <Icon size={20} className={label ? "" : "flex-shrink-0"} />}
            {label && <span className="text-sm uppercase tracking-wider">{label}</span>}
        </motion.button>
    );
};

export default ActionButton;

import React from 'react';
import { motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

export const StepWrapper = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col w-full max-w-[800px] mx-auto px-4 pb-32"
  >
    <div className="text-center mb-8 mt-4">
      <h2 className="text-2xl font-medium text-gray-900 mb-3">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    <div className="bg-white rounded-3xl p-5 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50">
      <div className="space-y-8">
        {children}
      </div>
    </div>
  </motion.div>
);

export const TextInput = ({ label, value, onChange, placeholder, type = "text", icon: Icon, suffix, suffixIcon: SuffixIcon }: any) => (
  <div className="flex flex-col gap-3">
    {label && <label className="text-sm font-bold text-gray-800">{label}</label>}
    <div className="relative flex items-center">
      {Icon && <Icon size={18} className="absolute left-4 text-gray-400" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full py-4 bg-[#F4F3F0] rounded-xl border-none focus:ring-2 focus:ring-[#D84936]/20 outline-none transition-all text-gray-800 placeholder-gray-400 ${Icon ? 'pl-11' : 'px-5'} ${(suffix || SuffixIcon) ? 'pr-12' : 'pr-5'}`}
      />
      {suffix && <span className="absolute right-5 text-gray-500 text-sm">{suffix}</span>}
      {SuffixIcon && <button className="absolute right-4 p-1 hover:bg-gray-200 rounded-md transition-colors"><SuffixIcon size={18} className="text-gray-600" /></button>}
    </div>
  </div>
);

export const SegmentedRadio = ({ label, options, value, onChange }: any) => (
  <div className="flex flex-col gap-3">
    {label && <label className="text-sm font-bold text-gray-800">{label}</label>}
    <div className="flex flex-wrap gap-3">
      {options.map((opt: any) => {
        const optValue = opt.value || opt;
        const optLabel = opt.label || opt;
        const isSelected = value === optValue;
        return (
          <button
            key={optValue}
            onClick={() => onChange(optValue)}
            className={`flex-1 min-w-[100px] py-3.5 px-4 rounded-xl text-sm font-medium transition-all border ${
              isSelected ? 'bg-[#FEFDFB] border-[#D84936] text-[#D84936]' : 'bg-[#FEFDFB] border-dashed border-gray-200 text-gray-600 hover:bg-[#F4F3F0]'
            }`}
          >
            {optLabel}
          </button>
        )
      })}
    </div>
  </div>
);

export const RadioCard = ({ label, description, selected, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-5 rounded-xl transition-all duration-200 border ${
      selected ? 'bg-[#FEFDFB] border-[#D84936] ring-1 ring-[#D84936]' : 'bg-[#FEFDFB] border-dashed border-gray-200 hover:border-gray-300 hover:bg-[#F4F3F0]'
    }`}
  >
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <h3 className={`font-bold ${selected ? 'text-[#D84936]' : 'text-gray-800'}`}>{label}</h3>
        {description && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{description}</p>}
      </div>
    </div>
  </button>
);

export const IconRadioCard = ({ icon: Icon, label, description, selected, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full aspect-square flex flex-col items-center justify-center text-center p-2 rounded-xl transition-all duration-300 border ${
      selected 
        ? 'bg-white border-[#D84936] ring-1 ring-[#D84936] shadow-[0_2px_10px_rgba(216,73,54,0.12)] transform scale-[1.02]' 
        : 'bg-[#FEFDFB] border-dashed border-gray-200 hover:border-gray-300 hover:bg-[#F4F3F0]'
    }`}
  >
    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors duration-300 ${
      selected ? 'bg-[#D84936]/10 text-[#D84936]' : 'bg-white text-gray-500'
    }`}>
      {Icon && <Icon size={16} strokeWidth={1.5} />}
    </div>
    <h3 className={`text-[10px] sm:text-xs font-bold mb-0.5 transition-colors duration-300 ${
      selected ? 'text-[#D84936]' : 'text-gray-800'
    }`}>
      {label}
    </h3>
    {description && (
      <p className="text-[9px] sm:text-[10px] text-gray-400 leading-tight max-w-[120px]">
        {description}
      </p>
    )}
  </button>
);

export const SquareRadioCard = ({ label, description, selected, onClick, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`aspect-square flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all duration-300 border ${
      selected 
        ? 'bg-white border-[#D84936] ring-1 ring-[#D84936] shadow-[0_4px_15px_rgba(216,73,54,0.12)] transform scale-[1.02]' 
        : 'bg-[#FEFDFB] border-dashed border-gray-200 hover:border-gray-300 hover:bg-[#F4F3F0]'
    }`}
  >
    {Icon && (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 ${
        selected ? 'bg-[#D84936]/10 text-[#D84936]' : 'bg-[#F4F3F0] text-gray-500'
      }`}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
    )}
    <h3 className={`font-bold transition-colors duration-300 ${
      selected ? 'text-[#D84936]' : 'text-gray-800'
    }`}>
      {label}
    </h3>
    {description && (
      <p className="text-[11px] text-gray-400 mt-2 leading-tight">
        {description}
      </p>
    )}
  </button>
);

export const SquareCheckboxCard = ({ label, description, selected, onClick }: any) => (
  <button
    onClick={onClick}
    className={`aspect-square flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all duration-300 relative border ${
      selected 
        ? 'bg-white border-[#D84936] ring-1 ring-[#D84936] shadow-[0_4px_15px_rgba(216,73,54,0.12)] transform scale-[1.02]' 
        : 'bg-[#FEFDFB] border-dashed border-gray-200 hover:border-gray-300 hover:bg-[#F4F3F0]'
    }`}
  >
    <div className={`absolute top-3 right-3 w-5 h-5 rounded flex items-center justify-center transition-colors ${
      selected ? 'bg-[#D84936]' : 'bg-gray-100 border border-gray-200'
    }`}>
      {selected && <Check size={12} className="text-white" />}
    </div>
    <h3 className={`font-bold transition-colors duration-300 ${
      selected ? 'text-[#D84936]' : 'text-gray-800'
    }`}>
      {label}
    </h3>
    {description && (
      <p className="text-[11px] text-gray-400 mt-2 leading-tight">
        {description}
      </p>
    )}
  </button>
);

export const CheckboxCard = ({ label, description, selected, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-5 rounded-xl transition-all duration-200 flex items-start gap-4 border ${
      selected ? 'bg-[#FEFDFB] border-[#D84936] ring-1 ring-[#D84936]' : 'bg-[#FEFDFB] border-dashed border-gray-200 hover:border-gray-300 hover:bg-[#F4F3F0]'
    }`}
  >
    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
      selected ? 'bg-[#D84936]' : 'bg-white border border-gray-300'
    }`}>
      {selected && <Check size={14} className="text-white" />}
    </div>
    <div className="flex-1">
      <h3 className={`font-bold ${selected ? 'text-[#D84936]' : 'text-gray-800'}`}>{label}</h3>
      {description && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{description}</p>}
    </div>
  </button>
);

export const Counter = ({ label, value, onChange, min = 0 }: any) => (
  <div className="flex items-center justify-between p-4 bg-[#FEFDFB] rounded-xl border border-gray-100">
    <span className="font-bold text-gray-800">{label}</span>
    <div className="flex items-center gap-4">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        -
      </button>
      <span className="w-8 text-center font-bold text-[#D84936]">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        +
      </button>
    </div>
  </div>
);

export const SubQuestion = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`mb-4 ${className}`}>
    <div className="text-sm font-bold text-gray-800 flex items-center gap-2 leading-relaxed">
      {children}
    </div>
  </div>
);

import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

const SelectContext = createContext();

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, handleValueChange }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, placeholder, ...props }, ref) => {
  const { isOpen, setIsOpen, selectedValue } = useContext(SelectContext);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target) && !event.target.closest('.select-content')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(
        "flex h-10 items-center justify-between rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm text-black shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      type="button"
      {...props}
    >
      {children || <span className="text-neutral-500">{placeholder}</span>}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2 h-4 w-4 text-neutral-400 transition-transform duration-200"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ children, placeholder }) => {
  const { selectedValue } = useContext(SelectContext);
  return selectedValue ? children : <span className="text-neutral-500">{placeholder}</span>;
};

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen } = useContext(SelectContext);

  return isOpen && (
    <div
      ref={ref}
      className={cn(
        "select-content absolute z-50 mt-2 rounded-xl border border-neutral-200 bg-white text-sm shadow-lg transition-all duration-200 animate-in fade-in",
        className
      )}
      {...props}
    >
      <div className="max-h-60 overflow-y-auto py-1">{children}</div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { handleValueChange, selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      className={cn(
        "relative cursor-pointer select-none rounded-md px-4 py-2 text-sm text-black hover:bg-neutral-100 active:bg-neutral-200 transition-colors duration-150",
        isSelected && "bg-neutral-200 font-medium",
        className
      )}
      onClick={() => handleValueChange(value)}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 top-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
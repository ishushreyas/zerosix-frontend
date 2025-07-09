import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MonthYearPicker = ({ currentDate, onDateChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [yearScrollPosition, setYearScrollPosition] = useState(0);
  const yearContainerRef = useRef(null);
  const yearItemRefs = useRef({});

  // Generate years from 10 years ago to current year + 1
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);
  }, []);

  // Generate months
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Scroll to selected year when calendar opens
  useEffect(() => {
    if (isCalendarOpen && yearItemRefs.current[selectedYear]) {
      const yearElement = yearItemRefs.current[selectedYear];
      yearElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center', 
        inline: 'center' 
      });
    }
  }, [isCalendarOpen, selectedYear]);

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(selectedYear, monthIndex, 1);
    onDateChange(newDate);
    setIsCalendarOpen(false);
  };

  const isMonthDisabled = (monthIndex) => {
    const selectedDate = new Date(selectedYear, monthIndex, 1);
    return selectedDate > new Date(); // Disable future months
  };

  const scrollYears = (direction) => {
    if (yearContainerRef.current) {
      const scrollAmount = 200; // Adjust based on your design
      const newScrollPosition = direction === 'right' 
        ? yearContainerRef.current.scrollLeft + scrollAmount
        : yearContainerRef.current.scrollLeft - scrollAmount;
      
      yearContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
      setYearScrollPosition(newScrollPosition);
    }
  };

  return (
    <div className="relative w-full max-w-md z-20">
      {/* Month Chip */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
      >
        <Calendar size={16} />
        <span className="text-sm font-medium">
          {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
      </motion.div>

      {/* Calendar Dropdown */}
      {isCalendarOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute transform -translate-x-1/2 z-50 mt-2 w-80 max-w-[90vw] bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden"
        >
          {/* Year Selector */}
          <div className="relative bg-gray-100 border-b">
            {/* Left Scroll Button */}
            {yearScrollPosition > 0 && (
              <button 
                onClick={() => scrollYears('left')}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {/* Right Scroll Button */}
            {yearContainerRef.current && 
             yearContainerRef.current.scrollWidth > yearContainerRef.current.clientWidth && 
             yearScrollPosition + yearContainerRef.current.clientWidth < yearContainerRef.current.scrollWidth && (
              <button 
                onClick={() => scrollYears('right')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
              >
                <ChevronRight size={16} />
              </button>
            )}

            {/* Years Container */}
            <div 
              ref={yearContainerRef}
              className="flex gap-2 p-4 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {years.map(year => (
                <button
                  key={year}
                  ref={(el) => yearItemRefs.current[year] = el}
                  onClick={() => setSelectedYear(year)}
                  className={`
                    flex-shrink-0 px-3 py-1 rounded-full text-sm transition-colors 
                    ${selectedYear === year 
                      ? 'bg-gray-900 text-white' 
                      : 'hover:bg-gray-200'}
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Months Grid */}
          <div className="grid grid-cols-4 gap-2 p-4">
            {months.map((month, index) => (
              <motion.button
                key={month}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMonthSelect(index)}
                disabled={isMonthDisabled(index)}
                className={`
                  px-3 py-2 rounded-lg text-sm text-center
                  ${currentDate.getMonth() === index && currentDate.getFullYear() === selectedYear 
                    ? 'bg-gray-900 text-white' 
                    : 'hover:bg-gray-200'}
                  ${isMonthDisabled(index) 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'cursor-pointer'}
                `}
              >
                {month}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MonthYearPicker;

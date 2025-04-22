import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Delete, Percent, Divide, X, Minus, Plus, Equal } from 'lucide-react';

const MainFeature = ({ addToHistory }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastButtonPressed, setLastButtonPressed] = useState(null);
  const [animateDisplay, setAnimateDisplay] = useState(false);

  // Handle digit input
  const inputDigit = (digit) => {
    setLastButtonPressed('number');
    
    if (waitingForOperand) {
      setDisplayValue(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
    
    setAnimateDisplay(true);
  };

  // Handle decimal point
  const inputDecimal = () => {
    setLastButtonPressed('decimal');
    
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
    }
    
    setAnimateDisplay(true);
  };

  // Clear all values
  const clearAll = () => {
    setDisplayValue('0');
    setCurrentValue(null);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setLastButtonPressed('clear');
    setAnimateDisplay(true);
  };

  // Clear current entry
  const clearEntry = () => {
    setDisplayValue('0');
    setLastButtonPressed('clear');
    setAnimateDisplay(true);
  };

  // Delete last character
  const deleteLastChar = () => {
    if (waitingForOperand) return;
    
    setDisplayValue(
      displayValue.length === 1 ? '0' : displayValue.slice(0, -1)
    );
    setLastButtonPressed('delete');
    setAnimateDisplay(true);
  };

  // Handle percentage
  const percentage = () => {
    const value = parseFloat(displayValue) / 100;
    setDisplayValue(String(value));
    setWaitingForOperand(true);
    setLastButtonPressed('percent');
    setAnimateDisplay(true);
  };

  // Handle operation
  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue);
    
    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result);
      setDisplayValue(String(result));
      
      // Add to history when chaining operations
      if (storedValue !== null) {
        const expression = `${storedValue} ${getOperatorSymbol(operator)} ${inputValue}`;
        addToHistory(expression, result);
      }
    }
    
    setWaitingForOperand(true);
    setOperator(nextOperator);
    setStoredValue(parseFloat(displayValue));
    setLastButtonPressed('operator');
    setAnimateDisplay(true);
  };

  // Calculate result
  const calculate = (firstValue, secondValue, op) => {
    switch (op) {
      case 'add':
        return firstValue + secondValue;
      case 'subtract':
        return firstValue - secondValue;
      case 'multiply':
        return firstValue * secondValue;
      case 'divide':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  // Get operator symbol for history
  const getOperatorSymbol = (op) => {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '';
    }
  };

  // Handle equals
  const handleEquals = () => {
    if (currentValue === null || operator === null) {
      return;
    }
    
    const inputValue = parseFloat(displayValue);
    const result = calculate(currentValue, inputValue, operator);
    
    // Create expression for history
    const expression = `${currentValue} ${getOperatorSymbol(operator)} ${inputValue}`;
    
    setDisplayValue(String(result));
    setCurrentValue(null);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setLastButtonPressed('equals');
    setAnimateDisplay(true);
    
    // Add to history
    addToHistory(expression, result);
  };

  // Handle keyboard input
  const handleKeyDown = useCallback((event) => {
    let { key } = event;
    
    if (key === 'Enter') key = '=';
    if (key === '*') key = 'x';
    if (key === '/') key = '÷';
    
    if (/\d/.test(key)) {
      event.preventDefault();
      inputDigit(parseInt(key, 10));
    } else if (key === '.') {
      event.preventDefault();
      inputDecimal();
    } else if (key === 'Backspace') {
      event.preventDefault();
      deleteLastChar();
    } else if (key === 'Escape') {
      event.preventDefault();
      clearAll();
    } else if (key === '+') {
      event.preventDefault();
      performOperation('add');
    } else if (key === '-') {
      event.preventDefault();
      performOperation('subtract');
    } else if (key === 'x' || key === '*') {
      event.preventDefault();
      performOperation('multiply');
    } else if (key === '÷' || key === '/') {
      event.preventDefault();
      performOperation('divide');
    } else if (key === '=' || key === 'Enter') {
      event.preventDefault();
      handleEquals();
    } else if (key === '%') {
      event.preventDefault();
      percentage();
    }
  }, [displayValue, currentValue, operator, waitingForOperand]);

  // Set up keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset animation state
  useEffect(() => {
    if (animateDisplay) {
      const timer = setTimeout(() => {
        setAnimateDisplay(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [animateDisplay]);

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
      {/* Calculator Display */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
        <div className="flex flex-col items-end">
          {/* Expression Display */}
          <div className="w-full text-right text-sm text-surface-500 dark:text-surface-400 h-6 overflow-hidden">
            {storedValue !== null && (
              <span>
                {storedValue} {getOperatorSymbol(operator)}
              </span>
            )}
          </div>
          
          {/* Main Display */}
          <motion.div 
            animate={animateDisplay ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full text-right text-4xl font-semibold tracking-tight overflow-x-auto scrollbar-hide py-2"
          >
            {displayValue}
          </motion.div>
        </div>
      </div>
      
      {/* Calculator Keypad */}
      <div className="p-4 grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={clearAll}
          className="calc-button-danger"
        >
          <Trash2 size={18} className="mr-1" /> C
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={clearEntry}
          className="calc-button-function"
        >
          CE
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={deleteLastChar}
          className="calc-button-function"
        >
          <Delete size={18} />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => performOperation('divide')}
          className={`calc-button-operation ${operator === 'divide' && !waitingForOperand ? 'ring-2 ring-white' : ''}`}
        >
          <Divide size={18} />
        </motion.button>
        
        {/* Row 2 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(7)}
          className="calc-button-number"
        >
          7
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(8)}
          className="calc-button-number"
        >
          8
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(9)}
          className="calc-button-number"
        >
          9
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => performOperation('multiply')}
          className={`calc-button-operation ${operator === 'multiply' && !waitingForOperand ? 'ring-2 ring-white' : ''}`}
        >
          <X size={18} />
        </motion.button>
        
        {/* Row 3 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(4)}
          className="calc-button-number"
        >
          4
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(5)}
          className="calc-button-number"
        >
          5
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(6)}
          className="calc-button-number"
        >
          6
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => performOperation('subtract')}
          className={`calc-button-operation ${operator === 'subtract' && !waitingForOperand ? 'ring-2 ring-white' : ''}`}
        >
          <Minus size={18} />
        </motion.button>
        
        {/* Row 4 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(1)}
          className="calc-button-number"
        >
          1
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(2)}
          className="calc-button-number"
        >
          2
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(3)}
          className="calc-button-number"
        >
          3
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => performOperation('add')}
          className={`calc-button-operation ${operator === 'add' && !waitingForOperand ? 'ring-2 ring-white' : ''}`}
        >
          <Plus size={18} />
        </motion.button>
        
        {/* Row 5 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={percentage}
          className="calc-button-function"
        >
          <Percent size={18} />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => inputDigit(0)}
          className="calc-button-number"
        >
          0
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={inputDecimal}
          className="calc-button-number"
        >
          .
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleEquals}
          className="calc-button-operation bg-primary dark:bg-primary hover:bg-primary-dark dark:hover:bg-primary-dark"
        >
          <Equal size={18} />
        </motion.button>
      </div>
      
      {/* Keyboard Hint */}
      <div className="px-4 pb-4 text-xs text-center text-surface-500 dark:text-surface-400">
        <p>Keyboard supported! Try using number keys, operators, and Enter.</p>
      </div>
    </div>
  );
};

export default MainFeature;
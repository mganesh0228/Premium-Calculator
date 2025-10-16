document.addEventListener('DOMContentLoaded', function() {
    // Calculator state
    const calculator = {
        currentOperand: '0',
        previousOperand: '',
        operation: undefined,
        waitingForNewOperand: false
    };

    // DOM elements
    const currentOperandElement = document.getElementById('currentOperand');
    const previousOperandElement = document.getElementById('previousOperand');
    const modeToggle = document.getElementById('modeToggle');
    const modeText = document.querySelector('.mode-text');
    const normalButtons = document.getElementById('normalButtons');
    const scientificButtons = document.getElementById('scientificButtons');
    const buttons = document.querySelectorAll('.button');

    // Toggle between normal and scientific mode
    modeToggle.addEventListener('click', function() {
        const isScientific = scientificButtons.classList.contains('hidden');
        
        if (isScientific) {
            // Switch to scientific mode
            normalButtons.classList.add('hidden');
            scientificButtons.classList.remove('hidden');
            modeText.textContent = 'Scientific';
            modeToggle.style.background = 'rgba(142, 45, 226, 0.7)';
            document.querySelector('.toggle-slider').style.left = '43px';
        } else {
            // Switch to normal mode
            scientificButtons.classList.add('hidden');
            normalButtons.classList.remove('hidden');
            modeText.textContent = 'Normal';
            modeToggle.style.background = 'rgba(255, 255, 255, 0.3)';
            document.querySelector('.toggle-slider').style.left = '3px';
        }
    });

    // Add button press animation
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('pressed');
            setTimeout(() => {
                this.classList.remove('pressed');
            }, 200);
        });
    });

    // Update display
    function updateDisplay() {
        currentOperandElement.textContent = calculator.currentOperand;
        previousOperandElement.textContent = calculator.previousOperand;
    }

    // Append number
    function appendNumber(number) {
        if (calculator.waitingForNewOperand) {
            calculator.currentOperand = number;
            calculator.waitingForNewOperand = false;
        } else {
            calculator.currentOperand = calculator.currentOperand === '0' 
                ? number 
                : calculator.currentOperand + number;
        }
    }

    // Choose operation
    function chooseOperation(operation) {
        if (calculator.currentOperand === '') return;
        
        if (calculator.previousOperand !== '') {
            calculate();
        }
        
        calculator.operation = operation;
        calculator.previousOperand = `${calculator.currentOperand} ${operation}`;
        calculator.waitingForNewOperand = true;
    }

    // Calculate
    function calculate() {
        let computation;
        const prev = parseFloat(calculator.previousOperand);
        const current = parseFloat(calculator.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (calculator.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        calculator.currentOperand = computation.toString();
        calculator.operation = undefined;
        calculator.previousOperand = '';
        calculator.waitingForNewOperand = true;
    }

    // Clear calculator
    function clearCalculator() {
        calculator.currentOperand = '0';
        calculator.previousOperand = '';
        calculator.operation = undefined;
        calculator.waitingForNewOperand = false;
    }

    // Delete last digit
    function deleteLastDigit() {
        if (calculator.waitingForNewOperand) return;
        
        if (calculator.currentOperand.length === 1) {
            calculator.currentOperand = '0';
        } else {
            calculator.currentOperand = calculator.currentOperand.slice(0, -1);
        }
    }

    // Add decimal point
    function addDecimalPoint() {
        if (calculator.waitingForNewOperand) {
            calculator.currentOperand = '0.';
            calculator.waitingForNewOperand = false;
            return;
        }
        
        if (!calculator.currentOperand.includes('.')) {
            calculator.currentOperand += '.';
        }
    }

    // Scientific functions
    function scientificFunction(func, value) {
        const current = parseFloat(calculator.currentOperand);
        
        if (isNaN(current)) return;
        
        switch (func) {
            case 'sin':
                calculator.currentOperand = Math.sin(current * Math.PI / 180).toString();
                break;
            case 'cos':
                calculator.currentOperand = Math.cos(current * Math.PI / 180).toString();
                break;
            case 'tan':
                calculator.currentOperand = Math.tan(current * Math.PI / 180).toString();
                break;
            case 'log':
                calculator.currentOperand = Math.log10(current).toString();
                break;
            case 'ln':
                calculator.currentOperand = Math.log(current).toString();
                break;
            case 'sqrt':
                calculator.currentOperand = Math.sqrt(current).toString();
                break;
            case 'power':
                if (value === '2') {
                    calculator.currentOperand = Math.pow(current, 2).toString();
                } else if (value === '3') {
                    calculator.currentOperand = Math.pow(current, 3).toString();
                } else if (value === 'y') {
                    calculator.previousOperand = `${calculator.currentOperand} ^`;
                    calculator.operation = '^';
                    calculator.waitingForNewOperand = true;
                }
                break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    calculator.currentOperand = 'Error';
                } else {
                    let result = 1;
                    for (let i = 2; i <= current; i++) {
                        result *= i;
                    }
                    calculator.currentOperand = result.toString();
                }
                break;
            case 'pi':
                calculator.currentOperand = Math.PI.toString();
                break;
            case 'e':
                calculator.currentOperand = Math.E.toString();
                break;
        }
        
        calculator.waitingForNewOperand = true;
    }

    // Event listeners for buttons
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', () => {
            // Number buttons
            if (button.classList.contains('number')) {
                appendNumber(button.getAttribute('data-number'));
                updateDisplay();
            }
            
            // Operation buttons
            if (button.classList.contains('operator')) {
                chooseOperation(button.getAttribute('data-operation'));
                updateDisplay();
            }
            
            // Equals button
            if (button.getAttribute('data-action') === 'calculate') {
                calculate();
                updateDisplay();
            }
            
            // Clear button
            if (button.getAttribute('data-action') === 'clear') {
                clearCalculator();
                updateDisplay();
            }
            
            // Delete button
            if (button.getAttribute('data-action') === 'delete') {
                deleteLastDigit();
                updateDisplay();
            }
            
            // Decimal point
            if (button.getAttribute('data-number') === '.') {
                addDecimalPoint();
                updateDisplay();
            }
            
            // Scientific functions
            if (button.classList.contains('scientific-button')) {
                scientificFunction(
                    button.getAttribute('data-function'),
                    button.getAttribute('data-value')
                );
                updateDisplay();
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', event => {
        if (event.key >= '0' && event.key <= '9') {
            appendNumber(event.key);
            updateDisplay();
        } else if (event.key === '.') {
            addDecimalPoint();
            updateDisplay();
        } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
            const operations = {
                '+': '+',
                '-': '-',
                '*': '×',
                '/': '÷'
            };
            chooseOperation(operations[event.key]);
            updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            calculate();
            updateDisplay();
        } else if (event.key === 'Escape') {
            clearCalculator();
            updateDisplay();
        } else if (event.key === 'Backspace') {
            deleteLastDigit();
            updateDisplay();
        }
    });

    // Initialize display
    updateDisplay();
});
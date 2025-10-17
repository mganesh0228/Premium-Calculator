document.addEventListener('DOMContentLoaded', function() {
    // Calculator state
    const calculator = {
        currentOperand: '0',
        previousOperand: '',
        operation: undefined,
        waitingForNewOperand: false,
        history: []
    };

    // DOM elements
    const currentOperandElement = document.getElementById('currentOperand');
    const previousOperandElement = document.getElementById('previousOperand');
    const modeToggle = document.getElementById('modeToggle');
    const modeText = document.querySelector('.mode-text');
    const normalButtons = document.getElementById('normalButtons');
    const scientificButtons = document.getElementById('scientificButtons');
    const buttons = document.querySelectorAll('.button');
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');
    const historyToggle = document.getElementById('historyToggle');
    const historyToggleSci = document.getElementById('historyToggleSci');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const swipeIndicator = document.querySelector('.swipe-indicator');

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

    // Toggle history panel
    historyToggle.addEventListener('click', toggleHistory);
    historyToggleSci.addEventListener('click', toggleHistory);
    
    function toggleHistory() {
        historyPanel.classList.toggle('active');
        if (window.innerWidth <= 768) {
            swipeIndicator.style.display = historyPanel.classList.contains('active') ? 'none' : 'block';
        }
    }

    // Clear history
    clearHistoryBtn.addEventListener('click', function() {
        calculator.history = [];
        updateHistoryDisplay();
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
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        // Add to history
        if (computation !== 'Error') {
            const historyItem = {
                expression: `${calculator.previousOperand} ${calculator.currentOperand}`,
                result: computation.toString()
            };
            
            calculator.history.unshift(historyItem);
            if (calculator.history.length > 10) {
                calculator.history.pop();
            }
            
            updateHistoryDisplay();
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
        
        let result;
        let expression = '';
        
        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                expression = `sin(${current})`;
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                expression = `cos(${current})`;
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                expression = `tan(${current})`;
                break;
            case 'log':
                if (current <= 0) {
                    result = 'Error';
                } else {
                    result = Math.log10(current);
                    expression = `log(${current})`;
                }
                break;
            case 'ln':
                if (current <= 0) {
                    result = 'Error';
                } else {
                    result = Math.log(current);
                    expression = `ln(${current})`;
                }
                break;
            case 'sqrt':
                if (current < 0) {
                    result = 'Error';
                } else {
                    result = Math.sqrt(current);
                    expression = `√(${current})`;
                }
                break;
            case 'power':
                if (value === '2') {
                    result = Math.pow(current, 2);
                    expression = `${current}²`;
                } else if (value === '3') {
                    result = Math.pow(current, 3);
                    expression = `${current}³`;
                } else if (value === 'y') {
                    calculator.previousOperand = `${calculator.currentOperand} ^`;
                    calculator.operation = '^';
                    calculator.waitingForNewOperand = true;
                    return;
                }
                break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current) || current > 100) {
                    result = 'Error';
                } else {
                    result = 1;
                    for (let i = 2; i <= current; i++) {
                        result *= i;
                    }
                    expression = `${current}!`;
                }
                break;
            case 'pi':
                calculator.currentOperand = Math.PI.toString();
                return;
            case 'e':
                calculator.currentOperand = Math.E.toString();
                return;
        }
        
        // Add to history
        if (expression && result !== 'Error') {
            const historyItem = {
                expression: expression,
                result: result.toString()
            };
            
            calculator.history.unshift(historyItem);
            if (calculator.history.length > 10) {
                calculator.history.pop();
            }
            
            updateHistoryDisplay();
        }
        
        calculator.currentOperand = result.toString();
        calculator.waitingForNewOperand = true;
    }

    // Update history display
    function updateHistoryDisplay() {
        if (calculator.history.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }
        
        historyList.innerHTML = '';
        calculator.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            `;
            
            historyItem.addEventListener('click', function() {
                calculator.currentOperand = item.result;
                updateDisplay();
            });
            
            historyList.appendChild(historyItem);
        });
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
        } else if (event.key === 'h' || event.key === 'H') {
            toggleHistory();
        }
    });

    // Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - close history
            if (historyPanel.classList.contains('active')) {
                historyPanel.classList.remove('active');
                swipeIndicator.style.display = 'block';
            }
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - open history
            if (!historyPanel.classList.contains('active')) {
                historyPanel.classList.add('active');
                swipeIndicator.style.display = 'none';
            }
        }
    }

    // Initialize display
    updateDisplay();
    updateHistoryDisplay();
    
    // Show swipe indicator on mobile
    if (window.innerWidth <= 768) {
        swipeIndicator.style.display = 'block';
    }
});
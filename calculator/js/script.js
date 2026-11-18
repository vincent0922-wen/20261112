/* 全域變數設定 */
var currentInput = "0";
var num1 = null;
var operator = "";
var isCalculated = false;
var waitingForSecondOperand = false;

/* 取得 HTML 元素 */
var screen = document.getElementById("screen");
var buttons = document.querySelectorAll(".btn"); // 取得所有 .btn 按鈕

/* 按鈕點擊事件綁定 */
for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        var clickedValue = this.getAttribute("data-val");
        handleInput(clickedValue);
    };
}

/* 四則運算計算函式 */
function calculate(n1, op, n2) {
    var res = 0;
    if (op === "+") { res = n1 + n2; }
    else if (op === "−") { res = n1 - n2; }
    else if (op === "×") { res = n1 * n2; }
    else if (op === "÷") {
        if (n2 === 0) return "Error";
        res = n1 / n2;
    }
    else if (op === "%") { res = n1 % n2; }
    return Math.round(res * 100000000) / 100000000;
}

/* 按鍵輸入處理主函式 */
function handleInput(val) {

    /* C 清除功能 */
    if (val === "C") {
        currentInput = "0";
        num1 = null;
        operator = "";
        isCalculated = false;
        waitingForSecondOperand = false;
        screen.innerText = currentInput;
        return;
    }

    /* 百分比計算 */
    if (val === "%") {
        currentInput = String(Number(currentInput) / 100);
        if (operator !== "" && num1 !== null) {
            screen.innerText = num1 + operator + currentInput;
        } else {
            screen.innerText = currentInput;
        }
        return;
    }

    /* Delete 刪除功能 */
    if (val === "⌫") {
        if (isCalculated || currentInput === "Error") {
            currentInput = "0";
            num1 = null;
            operator = "";
            isCalculated = false;
            waitingForSecondOperand = false;
        } else if (waitingForSecondOperand && operator !== "") {
            operator = "";
            currentInput = String(num1);
            num1 = null;
            waitingForSecondOperand = false;
        } else if (currentInput.length > 1) {
            currentInput = currentInput.substring(0, currentInput.length - 1);
        } else if (operator !== "" && num1 !== null) {
            currentInput = String(num1);
            waitingForSecondOperand = true;
        } else {
            currentInput = "0";
        }
        if (operator !== "" && num1 !== null) {
            if (waitingForSecondOperand) {
                screen.innerText = num1 + operator;
            } else {
                screen.innerText = num1 + operator + currentInput;
            }
        } else {
            screen.innerText = currentInput;
        }
        return;
    }

    /* 小數點輸入功能 */
    if (val === ".") {
        if (isCalculated || waitingForSecondOperand || currentInput === "Error") {
            currentInput = "0.";
            isCalculated = false;
            waitingForSecondOperand = false;
        } else if (currentInput.indexOf(".") === -1) {
            currentInput = currentInput + ".";
        }
        if (operator !== "" && num1 !== null) {
            screen.innerText = num1 + operator + currentInput;
        } else {
            screen.innerText = currentInput;
        }
        return;
    }

    /* FACE 特殊按鍵功能 */
    if (val === "FACE") {
        screen.innerText = "♠ ♥ ♣ ♦";
        isCalculated = true;
        return;
    }

    /* 加減乘除運算符號 */
    if (val === "+" || val === "−" || val === "×" || val === "÷") {
        var inputValue = Number(currentInput);
        if (operator && waitingForSecondOperand) {
            operator = val;
            screen.innerText = num1 + operator;
            return;
        }
        if (num1 === null) {
            num1 = inputValue;
        } else if (operator) {
            var result = calculate(num1, operator, inputValue);
            currentInput = String(result);
            num1 = result === "Error" ? null : result;
        }
        waitingForSecondOperand = true;
        operator = val;
        isCalculated = false;
        screen.innerText = num1 + operator;
        return;
    }

    /* 等號計算功能 */
    if (val === "=") {
        if (!operator || waitingForSecondOperand) return;
        var num2 = Number(currentInput);
        var result = calculate(num1, operator, num2);
        currentInput = String(result);
        screen.innerText = currentInput;
        num1 = null;
        operator = "";
        isCalculated = true;
        waitingForSecondOperand = false;
        return;
    }

    /* 一般數字輸入 */
    if (
        currentInput === "0" ||
        isCalculated ||
        waitingForSecondOperand ||
        currentInput === "Error"
    ) {
        currentInput = val;
        isCalculated = false;
        waitingForSecondOperand = false;

    } else {
        currentInput = currentInput + val;
    }

    /* 更新螢幕顯示 */
    if (operator && num1 !== null) {
        screen.innerText = num1 + operator + currentInput;
    } else {
        screen.innerText = currentInput;
    }
}

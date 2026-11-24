let calcString = "";
let result = "";
let displayResult = "";
const numbers = new Set("0123456789.");
const operators = new Set("+-*/()^sqrt");
const calcText = document.querySelector("#calc-input-text")
const calcResult = document.querySelector("#calc-result-text")

calcText.focus()

function isInsideSqrt(pos, text) {
    const start = text.lastIndexOf("sqrt", pos)
    return start !== -1 && pos > start && pos < start + 4
}

function superscriptNumber(number) {
    const superscripts = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹"
    }
    return [...String(number)].map(char => superscripts[char] ?? char).join("")
}

function calcPress(idValue, value) {
    document.querySelector(idValue).addEventListener("pointerdown", () => {
    calcString = calcText.value 
    calcString += value;
    });
}

function tokenize() {
    let calcGrouping = "";
    let calcArray = [];

    for (let i = 0; i < calcString.length; i++) {
        if (numbers.has(calcString[i])) {
            calcGrouping += calcString[i]
        } else { if (calcString[i] === "-") {
                if (i === 0 || operators.has(calcString[i - 1])) {
                    if (operators.has(calcString[i + 1])) {
                        calcArray.push(calcString[i])
                    } else {
                        calcGrouping += calcString[i];
                    }
                } else {
                    if (calcGrouping !== "") {
                        calcArray.push(calcGrouping);
                    }
                    calcGrouping = "";
                    calcArray.push(calcString[i]);
                }
            } else {
                if (calcString[i] === "(" && numbers.has(calcString[i - 1])) {
                    calcArray.push(calcGrouping)
                    calcGrouping = ""
                    calcArray.push("*")
                    calcArray.push("(")
                } else {
                    if (calcString[i] === ")" && (numbers.has(calcString[i + 1]) || calcString[i + 1] === "(")) {
                        calcArray.push(calcGrouping)
                        calcGrouping = ""
                        calcArray.push(")")
                        calcArray.push("*")
                    } else {
                        if (calcString.slice(i,i + 4) === "sqrt") {
                            calcArray.push("sqrt")
                            i += 3;
                        } else {
                            if (calcGrouping !== "") {
                                calcArray.push(calcGrouping);
                            }
                            calcGrouping = "";
                            calcArray.push(calcString[i])
                            continue
                        }
                    }
                }
            }
        }
    }
    if (calcGrouping !== "") {
        calcArray.push(calcGrouping);
    }
    console.log(calcArray)
    return calcArray;
}

function calculate(calcArray) {
    for (let i = 0; i < calcArray.length; i++) {
        if (calcArray[i] === "(") {
            let iPos = 0;
            let depth = 0;
            let bracketArray = [];
            iPos = i;
            console.log("Closing bracket found at index:", i + 1);
            console.log(depth)
            while ((calcArray[i + 1] !== ")" || depth >= 1) && i < calcArray.length) {
                i++;
                if (calcArray[i] === "(") {
                    depth++;
                } 
                if (calcArray[i] === ")") {
                    depth--;
                }
                bracketArray.push(calcArray[i]);
                if (i >= calcArray.length) {
                    return "Error";
                }
            }
            console.log("Full array:", calcArray);
            console.log("Bracket contents:", bracketArray);
            console.log("i:", i);
            console.log("Closing bracket:", calcArray[i + 1]);
            console.log("Opening bracket index:", i - bracketArray.length - 1);
            console.log([...bracketArray])
            calcArray.splice(i - bracketArray.length, bracketArray.length + 2, calculate(bracketArray));
            i = iPos - 1
        }
    }

    for (let i = 0; i < calcArray.length; i++) {
        if (calcArray[i] === "sqrt") {
            console.log(calcArray)
            console.log(i)
            if (Number.isNaN(Math.sqrt(parseFloat(calcArray[i + 1])))) {
                return "Error"
            } else {
            calcArray.splice(i, 2, (Math.sqrt(parseFloat(calcArray[i + 1]))));
            }
        }
        if (calcArray[i] === "^") {
            if (Number.isNaN(parseFloat(calcArray[i - 1]) ** parseFloat(calcArray[i + 1]))) {
                return "Error"
            } else {
            calcArray.splice(i - 1, 3, (parseFloat(calcArray[i - 1]) ** parseFloat(calcArray[i + 1])));
            i--;
            }
        }
    }

    for (let i = 0; i < calcArray.length; i++) {
        if (calcArray[i] === "*") {
            if (Number.isNaN(parseFloat(calcArray[i - 1]) * parseFloat(calcArray[i + 1]))) {
                return "Error"
            } else {
            calcArray.splice(i - 1, 3, (parseFloat(calcArray[i - 1]) * parseFloat(calcArray[i + 1])));
            i--;
            }
        }
        if (calcArray[i] === "/") {
            if (Number.isNaN(parseFloat(calcArray[i - 1]) / parseFloat(calcArray[i + 1]))) {
                return "Error"
            } else {
            calcArray.splice(i - 1, 3, (parseFloat(calcArray[i - 1]) / parseFloat(calcArray[i + 1])));
            i--;
            }
        }
    }

    for (let i = 0; i < calcArray.length; i++) {
        if (calcArray[i] === "+") {
            if (Number.isNaN(parseFloat(calcArray[i - 1]) + parseFloat(calcArray[i + 1]))) {
                return "Error"
            } else {
            calcArray.splice(i - 1, 3, (parseFloat(calcArray[i - 1]) + parseFloat(calcArray[i + 1])));
            i--;
            }
        }
        if (calcArray[i] === "-") {
            if (Number.isNaN(parseFloat(calcArray[i - 1]) - parseFloat(calcArray[i + 1]))) {
                return "Error"
            } else {
            calcArray.splice(i - 1, 3, (parseFloat(calcArray[i - 1]) - parseFloat(calcArray[i + 1])));
            i--;
            }
        }
    }

    result = String(parseFloat(calcArray) + 0);

    if (result.includes("NaN") || result.trim() === "") {
        displayResult = "Error";
    } else {
        displayResult = result;
    }

    return String(displayResult);
}

calcPress("#nine", "9")
calcPress("#eight", "8")
calcPress("#seven", "7")
calcPress("#six", "6")
calcPress("#five", "5")
calcPress("#four", "4")
calcPress("#three", "3")
calcPress("#two", "2")
calcPress("#one", "1")
calcPress("#zero", "0")
calcPress("#doubleZero", "00")
calcPress("#decimal", ".")
calcPress("#plus", "+")
calcPress("#minus", "-")
calcPress("#times", "*")
calcPress("#divide", "/")
calcPress("#openBracket", "(")
calcPress("#closeBracket", ")")
calcPress("#power", "^")
calcPress("#squareRoot", "sqrt(")

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("pointerdown", () => {
        calcText.value = calcString;
    })
})

document.querySelector("#AC").addEventListener("pointerdown", () => {
    calcString = "";
    calcText.value = calcString;
})

document.querySelector("#equal").addEventListener("pointerdown", () => {
    console.log(calcString)
    calcString = calcText.value
    calcResult.textContent = calculate(tokenize());
})

calcText.addEventListener("keydown", (key) => {
    if (key.key === "Enter") {
        calcString = calcText.value
        calcResult.textContent = calculate(tokenize());
    }
})

calcText.addEventListener("keydown", (key) => {
    if (key.key === "Backspace") {
        calcString = calcText.value
        const pos = calcText.selectionStart
        if (calcString.slice(pos - 4, pos) === "sqrt") {
            key.preventDefault()
            calcString = calcString.slice(0, pos - 4) + calcString.slice(pos)
            calcText.value = calcString

            calcText.setSelectionRange(pos - 4, pos - 4);
        }
    }
});

calcText.addEventListener("click", () => {
    const pos = calcText.selectionStart
    const text = calcText.value
    const start = text.lastIndexOf("sqrt", pos)
    if (start !== -1 && pos > start && pos < start + 4) {
        const middle = start + 2
        calcText.setSelectionRange(
            pos < middle ? start : start + 4,
            pos < middle ? start : start + 4
        )
    }
})

calcText.addEventListener("keydown", (key) => {
    const pos = calcText.selectionStart
    const text = calcText.value

    if (key.key === "ArrowLeft") {
        if (text.slice(pos - 4, pos) === "sqrt") {
            key.preventDefault()

            calcText.setSelectionRange(pos - 4, pos - 4)
        }
    }
})

calcText.addEventListener("keydown", (key) => {
    const pos = calcText.selectionStart
    const text = calcText.value

    if (key.key === "ArrowRight") {
        if (text.slice(pos, pos + 4) === "sqrt") {
            key.preventDefault()

            calcText.setSelectionRange(pos + 4, pos + 4)
        }
    }
})

calcText.addEventListener("keydown", (key) => {
    if (key.key === "Escape") {
        calcString = "";
        calcText.value = calcString;
    }
})

calcText.addEventListener("select", () => {
    if (document.activeElement === calcText && calcText.selectionStart !== calcText.selectionEnd) {
        calcText.setSelectionRange(calcText.selectionEnd, calcText.selectionEnd)
    }
})

document.querySelector("#DEL").addEventListener("pointerdown", () => {
    calcString = calcText.value
    console.log(calcString)
    const pos = calcText.selectionStart
    if (calcString.slice(pos - 4, pos) === "sqrt") {
        calcString = calcString.slice(0, pos - 4) + calcString.slice(pos)
        calcText.value = calcString

            calcText.setSelectionRange(pos - 4, pos - 4);
        }
    calcString = calcString.slice(0, -1);
    calcText.value = calcString;
})

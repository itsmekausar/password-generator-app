const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbercaseCheck = document.querySelector("#numbers");
const symbolcaseCheck = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");

let password = "";
let passwordLength = 10; 
let checkCount = 0;
setIndicator("#ccc");

handleSlider();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
};

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = ``;
}

function getRndInteger(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0, 10);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

function getRndSymbols() {
    const symbols = ["+", "-", "*", "@", "/", "%", "#", "!", "^", "$", "?", "=", "&", "$"];
    return symbols[Math.floor(Math.random() * symbols.length)] ;
}

function calcStrength(){
    let hasUpper  = false;
    let hasLower  = false;
    let hasNumber  = false;
    let hasSymbol  = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbercaseCheck.checked) hasNumber = true;
    if (symbolcaseCheck.checked) hasSymbol = true;
    
    if (hasUpper && hasLower && 
        (hasNumber || hasSymbol) && 
        passwordLength >= 8){
        setIndicator("#0f0");
    } 
    else if ( 
        (hasUpper || hasLower) && 
        (hasNumber || hasSymbol) && 
        passwordLength >=6 ) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active"); // to make the copy msg visible
    
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    // By Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handlecheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    })

    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckBoxChange);
})

inputSlider.addEventListener("input", () =>{
    passwordLength = inputSlider.value;
    handleSlider();
})

// inputSlider.addEventListener("input", (e) =>{
//     passwordLength = e.target.value;
//     handleSlider();
// })

copyBtn.addEventListener("click", () =>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener("click", () =>{
    
    // None of the checkbox is selected
    if(checkCount == 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // Remove old password
    password = "";

    //Finally! Lets generate the password 
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbercaseCheck.checked){
    //     password += numbercaseCheck();
    // }
    // if(symbolcaseCheck.checked){
    //     password += symbolcaseCheck();
    // }

    let funcArray = [];

    if(uppercaseCheck.checked)
        funcArray.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArray.push(generateLowerCase);

    if(numbercaseCheck.checked)
        funcArray.push(generateRandomNumber);
    
    if(symbolcaseCheck.checked)
        funcArray.push(getRndSymbols);

    // Compulsory 4 things
    for(i=0; i<funcArray.length; i++){
        password += funcArray[i]();
    }

    // Remaining password length addition
    for(i=0; i<passwordLength - funcArray.length; i++){
        let randIndex = getRndInteger(0, funcArray.length);
        password += funcArray[randIndex]();
    }

    // Shuffling the password
    password = shufflePassword(Array.from(password));

    // Showing password on UI
    passwordDisplay.value = password;

    calcStrength();
})
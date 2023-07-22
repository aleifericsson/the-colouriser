function changeColor(){
    hexString = rgbToHex(col);
    document.documentElement.style.setProperty("--base", hexString);
    weird2.textContent = "Current color: "+hexString;
    for(let i=0;i<3;i++){
        sliderList[i].value=col[i];
        numList[i].value=col[i];
    }
}

function randomColor(e){
    col[0] = getRndInteger(0,255);
    col[1] = getRndInteger(0,255);
    col[2] = getRndInteger(0,255);
    changeColor();
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function componentToHex(c) { var hex = c.toString(16); return hex.length == 1 ? "0" + hex : hex; }
function rgbToHex(col) { return "#" + componentToHex(col[0]) + componentToHex(col[1]) + componentToHex(col[2]); }

function updateNum(e){
    for(let i=0;i<3;i++){
        if (this.id === sliderList[i].id || this.id === numList[i].id){
            col[i]=parseInt(this.value,10);
            changeColor();
        }
    }
}

let col = [255,255,255]
let hexString = rgbToHex(col);

const weird = document.querySelector(".weird");
weird.addEventListener("click",randomColor);
const weird2 = document.querySelector(".weird2");
weird2.addEventListener("click",randomColor);
let sliderList = document.querySelectorAll(".slide");
sliderList.forEach(slider => slider.addEventListener("input",updateNum));
let numList = document.querySelectorAll(".num");
numList.forEach(num => num.addEventListener("input",updateNum));
const dividerList = document.querySelectorAll(".divider");
randomColor();

const endpoint = 'https://gist.githubusercontent.com/jennyknuth/e2d9ee930303d5a5fe8862c6e31819c5/raw/e4ec571a9b49ddc5c1789a4e7f3c67ec5271398e/colors.json';
const colors = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => colors.push(...data));
  
const colorGroups = ["purple", "pink", "red", "orange", "yellow", "green", "blue", "brown", "grey", "white"];
const groupedColors = colorGroups.forEach(group => colors.filter(color => color.families.includes(group)));

function findMatches(wordToMatch, colors) {
  return colors.filter(color => {
    const regex = new RegExp(wordToMatch, 'gi');
    return color.name.match(regex) || color.families.includes(wordToMatch)
  });
}

function displayMatches() {
  if (!this.value)
  {
      return `
         <li>Filter for a color</li>
         <li>or a color family</li>
    `;
  }else{
  const matchArray = findMatches(this.value, colors);
  const html = matchArray.map(color => {
    const regex = new RegExp(this.value, 'gi');
    const colorName = color.name.replace(regex, `<span class="hl">${this.value}</span>`);
    return `
      <li>
        <span class="name" id="${color.hex}">${colorName}</span><div style="background-color:${color.hex}" class="color-box"></div>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
  let nameList = document.querySelectorAll('.name');
  nameList.forEach(name => name.addEventListener('click',colBoxChange));
  }
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

String.prototype.convertToRGB = function(){ if(this.length != 6){ throw "Only six-digit hex colors are allowed."; } var aRgbHex = this.match(/.{1,2}/g); var aRgb = [ parseInt(aRgbHex[0], 16), parseInt(aRgbHex[1], 16), parseInt(aRgbHex[2], 16) ]; return aRgb; }

function colBoxChange(e){
    document.documentElement.style.setProperty("--base", this.id);
    weird2.textContent = "Current color: "+this.id+` (aka: ${this.textContent.toLowerCase()})`;
    col = this.id.substring(1).convertToRGB();
    for(let i=0;i<3;i++){
        sliderList[i].value=col[i];
        numList[i].value=col[i];
    }
}


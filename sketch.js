let data;
let maxScore = 100;
let minScore = 59;
let continents = [];

//spazi
let margin = 40;
let gutter = 3;
let topSpace = 90;
let bottomSpace = 110;

//scaffali
let booksNumber = 25; //libri x scaffale
let shelvesNumber = 4; //numero mensole

let colorScale = {
  'North America': '#66A9ED',
  'Europe': '#ED66ED',
  'Asia': '#EDA966',
  'Oceania': '#66ED66',
  'South America': '#7366ED',
}

let widthScale = {
  'S': 20,
  'M': 35,
  'L': 50,
  'XL': 65,
}


async function setup() {
  createCanvas(windowWidth, windowHeight);
  data = await loadTable("assets/ranking.csv", ",", "header");
}

function draw() {

  background(20);
  noStroke();

  //altezza scaffali
  let shelfHeight = (height - topSpace - bottomSpace) / shelvesNumber;

  //posizione libri
  let xPos = margin;
  let label = "";

  //creazione libri
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let size = data.getString(rowNumber, "size");
    let continent = data.getString(rowNumber, "continent");
    let name = data.getString(rowNumber, "institution name");
    let rank = data.getString(rowNumber, "ranking");
    let score = data.getNum(rowNumber, "qs overall score");

    let shelfNumber = floor(rowNumber / booksNumber);
    let baseY = topSpace + (shelfNumber + 1) * shelfHeight;

    if (rowNumber % booksNumber == 0) {
      xPos = margin;
      fill(90, 64, 48);
      rect(margin - 10, baseY, width - 2 * margin + 20, 10);
    }

    let bookHeight = map(score, minScore, maxScore, shelfHeight * 0.45, shelfHeight * 0.9);
    let bookWidth = widthScale[size];

    fill(colorScale[continent]);
    rect(xPos, baseY - bookHeight, bookWidth, bookHeight);

    if (
      mouseX >= xPos &&
      mouseX <= xPos + bookWidth &&
      mouseY >= baseY - bookHeight &&
      mouseY <= baseY
    ) {
      label = rank + name + score;
    }

    xPos += bookWidth + gutter;
  }

  //etichetta mouse
  if (label != "") {
    textSize(14);
    fill(0, 200);
    rect(mouseX + 4, mouseY + 2, textWidth(label) + 12, 24);
    fill(255);
    text(label, mouseX + 10, mouseY + 20);
  }

}


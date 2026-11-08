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
  'S': 15,
  'M': 30,
  'L': 45,
  'XL': 60,
}


async function setup() {
  createCanvas(windowWidth, windowHeight);
  data = await loadTable("assets/ranking.csv", ",", "header");
}

function draw() {

  background("#14171C");
  noStroke();
  drawTitolo();

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
      xPos = margin + 24;
      drawMensola(baseY, shelfHeight)
    }

    let bookHeight = map(score, minScore, maxScore, shelfHeight * 0.45, shelfHeight * 0.9);
    let bookWidth = widthScale[size];

    drawLibro(xPos, baseY, bookWidth, bookHeight, colorScale[continent]);


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

  drawLegenda();

  //etichetta mouse
  if (label != "") {
    textSize(14);
    fill(0, 200);
    rect(mouseX + 4, mouseY + 2, textWidth(label) + 12, 24);
    fill(255);
    text(label, mouseX + 10, mouseY + 20);
  }
}


function drawMensola(baseY, shelfHeight) {
  noStroke();

  //asse mensola
  fill("#5A4030");
  rect(margin - 10, baseY, width - 2 * margin + 20, 18);

  //luce asse di legno
  fill("#7A5A42");
  rect(margin - 10, baseY, width - 2 * margin + 20, 6);

  //ombra asse di legno
  fill("black");
  rect(margin - 10, baseY + 18, width - margin, 20, 6);

}

//un libro: x e baseY sono l'angolo in basso a sinistra, w e h larghezza e altezza
function drawLibro(x, baseY, w, h, colore) {
  push();
  noStroke();

  //copertina
  fill(colore);
  rect(x, baseY - h, w, h, 3, 3, 0, 0);

  //ombra sul lato destro (nero trasparente)
  fill(0, 50);
  rect(x + w * 0.72, baseY - h, w * 0.28, h);

  //luce sul lato sinistro (bianco trasparente)
  fill(255, 30);
  rect(x, baseY - h, w * 0.12, h);

  //contorno scuro sottile
  noFill();
  stroke(0, 90);
  strokeWeight(1);
  rect(x + 0.5, baseY - h + 0.5, w - 1, h - 1, 3, 3, 0, 0);

  //righe chiare del dorso: due in alto e due in basso
  stroke(255, 90);
  strokeWeight(2);
  line(x, baseY - h + 14, x + w, baseY - h + 14);
  line(x, baseY - h + 21, x + w, baseY - h + 21);
  line(x, baseY - 14, x + w, baseY - 14);
  line(x, baseY - 21, x + w, baseY - 21);

  pop();
}

function drawTitolo() {
  noStroke();

  fill("#FFF6E6");
  textSize(32);
  text("Una libreria di università", margin, 50);

  fill("#8B909A");
  textSize(16);
  text("Le prime 100 università del QS World University Rankings 2025", margin + 2, 76);
}


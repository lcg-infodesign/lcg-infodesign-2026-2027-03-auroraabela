let data;
let maxScore = 100;
let minScore = 59;
let continents = [];

//spazi
let margin = 40;
let gutter = 3;
let topSpace = 90;
let bottomSpace = 50;
let xShelf = 500;

//scaffali
let booksNumber = 25; //libri x scaffale
let shelvesNumber = 4; //numero mensole
let shelfWidth = 0; 

let colorScale = {
  'North America': '#EF6989',
  'Europe': '#4CC9F0',
  'Asia': '#FFD166',
  'Oceania': '#06D6A0',
  'South America': '#B28DFF',
}

let widthScale = {
  'S': 10,
  'M': 20,
  'L': 30,
  'XL': 40,
}


async function setup() {
  createCanvas(windowWidth, windowHeight);
  data = await loadTable("assets/ranking.csv", ",", "header");

  //larghezza della mensola: la riga di libri più larga + un po' di spazio ai lati
  for (let shelf = 0; shelf < shelvesNumber; shelf++) {
    let rowWidth = 0;
    for (let i = shelf * booksNumber; i < (shelf + 1) * booksNumber; i++) {
      rowWidth += widthScale[data.getString(i, "size")] + gutter;
    }
    if (rowWidth > shelfWidth) {
      shelfWidth = rowWidth;
    }
  }
  shelfWidth += 48; //24 px a sinistra e 24 px a destra
}

function draw() {

  background("#14171C");
  noStroke();
  drawTitolo();
  drawLegenda();

  let shelfHeight = (height - topSpace - bottomSpace) / shelvesNumber;

  //posizione libri
  let xPos = xShelf;
  let label = "";
  let shelfNumber = -1; //il primo libro diventa 0
  let baseY = 0;

  //libri dal dataset
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let size = data.getString(rowNumber, "size");
    let continent = data.getString(rowNumber, "continent");
    let name = data.getString(rowNumber, "institution name");
    let rank = data.getString(rowNumber, "ranking");
    let score = data.getNum(rowNumber, "qs overall score");


    //scaffale dopo ogni 25 libri
    if (rowNumber % booksNumber == 0) {
      shelfNumber++;
      baseY = topSpace + (shelfNumber + 1) * shelfHeight;
      xPos = xShelf + 24;
      drawMensola(baseY, shelfHeight);
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
      label = rank + "ª,  " + name + "  -  score:  " + score
    }

    xPos += bookWidth + gutter;
  }


  //hover mouse
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

  //sfondo scaffale
  fill("#1B2028");
  rect(xShelf, baseY - shelfHeight + 10, shelfWidth, shelfHeight - 10);

  //asse di legno
  fill("#5A4030");
  rect(xShelf - 10, baseY, shelfWidth + 20, 18);

  //filo di luce sul bordo alto dell'asse
  fill("#7A5A42");
  rect(xShelf - 10, baseY, shelfWidth + 20, 3);

  //ombra sotto l'asse: stessa x e stessa larghezza dell'asse
  fill(0, 90);
  rect(xShelf - 10, baseY + 18, shelfWidth + 20, 6);
}


function drawLibro(x, baseY, w, h, colore) {
  push();
  noStroke();

  //dorso
  fill(colore);
  rect(x, baseY - h, w, h, 3, 3, 0, 0);

  //ombra
  fill(0, 50);
  rect(x + w * 0.72, baseY - h, w * 0.28, h);

  //luce
  fill(255, 30);
  rect(x, baseY - h, w * 0.12, h);

  //righette dorso
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
  text("Le migliori università", margin, 50);

  fill("#8B909A");
  textSize(16);
  text("Le migliori 100 università secondo il QS World University Rankings 2025", margin + 2, 76);
}


function drawLegenda() {
  noStroke();

  let x = margin;
  let y = topSpace + 10;

  let xLegenda = x;
  let yLegenda = y + 35;

  //continente
  fill("#E8E6DF");
  textSize(15);
  text("Colore: continente dell'università", xLegenda, yLegenda)
  yLegenda += 15;

  //legenda continenti
  textSize(14);

    fill(colorScale['North America']);
    rect(xLegenda, yLegenda, 14, 26);
    fill("#CFD3DA");
    text("North America", xLegenda + 24, yLegenda + 18);
    yLegenda += 32;

    fill(colorScale['Europe']);
    rect(xLegenda, yLegenda, 14, 26);
    fill("#CFD3DA");
    text("Europe", xLegenda + 24, yLegenda + 18);
    yLegenda += 32;

    fill(colorScale['Asia']);
    rect(xLegenda, yLegenda, 14, 26);
    fill("#CFD3DA");
    text("Asia", xLegenda + 24, yLegenda + 18);
    yLegenda += 32;

    fill(colorScale['Oceania']);
    rect(xLegenda, yLegenda, 14, 26);
    fill("#CFD3DA");
    text("Oceania", xLegenda + 24, yLegenda + 18);
    yLegenda += 32;

    fill(colorScale['South America']);
    rect(xLegenda, yLegenda, 14, 26);
    fill("#CFD3DA");
    text("South America", xLegenda + 24, yLegenda + 18);
    yLegenda += 32;


  //dimensione libro
  yLegenda += 20;
  fill("#E8E6DF");
  textSize(15);
  text( "Spessore: dimensione del campus", xLegenda, yLegenda);
  yLegenda += 15;

  //legenda dimensione libro
   textSize(14);

    fill("#8B909A");
    rect(xLegenda, yLegenda, widthScale['S'], 26);
    fill("#CFD3DA");
    text("S", xLegenda + widthScale['S'] + 8, yLegenda + 18);
    yLegenda += 32;

    fill("#8B909A");
    rect(xLegenda, yLegenda, widthScale['M'], 26);
    fill("#CFD3DA");
    text("M", xLegenda + widthScale['M'] + 8, yLegenda + 18);
    yLegenda += 32;

    fill("#8B909A");
    rect(xLegenda, yLegenda, widthScale['L'], 26);
    fill("#CFD3DA");
    text("L", xLegenda + widthScale['L'] + 8, yLegenda + 18);
    yLegenda += 32;

    fill("#8B909A");
    rect(xLegenda, yLegenda, widthScale['XL'], 26);
    fill("#CFD3DA");
    text("XL", xLegenda + widthScale['XL'] + 8, yLegenda + 18);
    yLegenda += 32;

  //resto della legenda  
  yLegenda += 20;

  fill("#E8E6DF");
  textSize(15);
  text("Altezza del libro: punteggio QS (da 100 a 59)", xLegenda, yLegenda);

  textSize(13);
  fill("#CFD3DA");
  text("Ordine di ranking: dalla 1ª in alto a sinistra alla 100ª", xLegenda, yLegenda + 20);

    fill("#8B909A");
  text("Passa il mouse su un libro per leggere i dettagli", xLegenda, yLegenda + 90);
}

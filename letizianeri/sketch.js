let table;
let filteredRows = []; // contiene le righe filtrate come oggetti
let col0Values = [];
let col1Values = [];
let col2Values = [];
let col3Values = [];
let col4Values = [];

let average0;
let average1;
let std1;
let mode2;
let median3;
let average4;
let std4;

function preload() {
  table = loadTable("dataset.csv", "csv", "header");
}

//  FUNZIONI DI CALCOLO

// funzione per calcolare la media di un array
function calcAvg(arr) {
  if (arr.length === 0) return 0; // evita divisione per 0
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}


// funzione per calcolare la deviazione standard di un array
function calcStD(arr) {
  if (arr.length === 0) return 0;
  let average = calcAvg(arr);
  let sommaQuad = 0;
  for (let i = 0; i < arr.length; i++) {
    sommaQuad += (arr[i] - average) ** 2;
  }
  let variation = sommaQuad / arr.length;
  return Math.sqrt(variation);
}


// funzione per calcolare la moda
function calcMode(arr) {
  if (arr.length === 0) return null;
  let counts = {}; // conta le occorrenze
  let maxCount = 0;
  let mode = [];

  // conta le occorrenze di ogni valore
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxCount) {
      maxCount = counts[val];
    }
  }

  // trova tutti i valori che hanno il numero massimo di occorrenze
  for (let key in counts) {
    if (counts[key] === maxCount) {
      mode.push(key);
    }
  }

  // se c'è una sola moda restituisce il valore singolo
  if (mode.length === 1) return mode[0];
  return mode; // altrimenti ritorna un array di valori moda
}

//funzione per calcolare la mediana
function calcMedian(arr) {
  if (arr.length === 0) return 0; // se l'array vuoto restituisce 0
  let sorted = arr.slice().sort((a, b) => a - b); // ordina senza modificare l'array originale
  let middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    // se c'è un numero pari di elementi calcola la media dei due valori centrali
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    // se i valori sono dispari restituisce l'elemento centrale
    return sorted[middle];
  }
}

// avg della colonna 0
function drawAverageCol0() {
  let g = createGraphics(400, 200);
  g.background(255, 255, 255, 0);

  let topMargin = 10;
  let bottomMargin = 40;
  let leftMargin = 20;
  let rightMargin = 20;

  let chartHeight = g.height - topMargin - bottomMargin;
  let barWidth = (g.width - leftMargin - rightMargin) / col0Values.length;

  let maxVal = Math.max(...col0Values);
  let minVal = Math.min(...col0Values);

  // zeroY verticale per valore 0
  let zeroY = map(0, minVal, maxVal, topMargin, topMargin + chartHeight);

  // disegna le barre
  for (let i = 0; i < col0Values.length; i++) {
    let val = col0Values[i];
    let h = map(val, 0, maxVal, 0, zeroY - topMargin);
    if (val < 0) {
      h = map(val, 0, minVal, 0, topMargin + chartHeight - zeroY);
    }

    let yPos = val >= 0 ? zeroY - h : zeroY;

    g.fill("hotpink");
    g.noStroke();
    g.rect(leftMargin + i * barWidth, yPos, barWidth - 2, Math.abs(h));
  }

  // linea orizzontale della media
  let avgY = map(average0, minVal, maxVal, topMargin, topMargin + chartHeight);
  g.stroke("deeppink");
  g.strokeWeight(2);
  g.line(leftMargin, avgY, g.width - rightMargin, avgY);

  // testo descrittivo
  g.noStroke();
  g.fill(0);
  g.textAlign(CENTER);
  g.textSize(16);
  g.text("La media della colonna 0 è " + nf(average0, 1, 2), g.width / 2, g.height - 10);

  // inserisce il graphics nella box1
  let cnvImg = createImg(g.canvas.toDataURL(), "Media colonna 0");
  cnvImg.parent("box1");
  cnvImg.style("width", "400px");
  cnvImg.style("height", "200px");
}

// std della colonna 1 - animazione --> eseguito nel draw
let currentDiameter = 0;  // diametro iniziale
let targetDiameter;        // diametro finale (std1)
let easing = 0.05;        // coefficiente easing
let growing = true;       // crescita/loop
let pauseFrames = 30;     // durata pausa in frame (0.5 secondi)
let pauseCounter = 0;

// moda della colonna 2
function drawFrequencyBubbles() {
  let g = createGraphics(400, 200);

  g.background(255, 255, 255, 0);
  g.textAlign(CENTER, CENTER);
  g.textSize(12);
  g.fill(0);
  g.noStroke();

  // calcola le frequenze di ogni valore
  let counts = {};
  col2Values.forEach(val => {
    counts[val] = (counts[val] || 0) + 1;
  });

  // massimo numero di occorrenze per scalare i diametri
  let maxCount = Math.max(...Object.values(counts));

  // margine dal bordo e dallo spazio per il testo in basso
  let topMargin = 10;
  let bottomMargin = 30;
  let leftMargin = 10;
  let rightMargin = 10;

  let positions = []; // per controllare sovrapposizione

  for (let key in counts) {
    let count = counts[key];
    let diametro = map(count, 0, maxCount, 5, 40);

    let tries = 0;
    let maxTries = 400;
    let x, y;
    let overlap;

    do {
      x = random(leftMargin + diametro / 2, g.width - rightMargin - diametro / 2);
      y = random(topMargin + diametro / 2, g.height - bottomMargin - diametro / 2);

      // controlla sovrapposizione
      overlap = positions.some(pos => dist(x, y, pos.x, pos.y) < (diametro / 2 + pos.d / 2 + 5));
      tries++;
    } while (overlap && tries < maxTries);

    positions.push({ x, y, d: diametro });

    // disegna cerchio
    g.fill("blue");
    g.stroke(0);
    g.strokeWeight(2);
    g.circle(x, y, diametro);

    // scrive valore al centro
    g.noStroke();
    g.fill("lightblue");
    g.text(key, x, y);
  }

  // testo descrittivo in basso
  g.fill(40);
  g.textSize(14);
  g.textAlign(CENTER, CENTER);
  g.text("La moda della colonna 2 è costituita dai valori " + mode2, g.width / 2, g.height - 15);

  // crea immagine da inserire nel box
  let cnvImg = createImg(g.canvas.toDataURL(), "Moda colonna 2");
  cnvImg.parent("box3");
  cnvImg.style("width", "400px");
  cnvImg.style("height", "200px");
}


function setup() {
   // canvas principale dentro box2 per animazione cerchio
  let cnv = createCanvas(400,200);
  cnv.parent("box2"); // canvas principale nel div box2
  
  // ciclo che si ripete su tutte le righe --> filtraggio
  for (let r = 0; r < table.getRowCount(); r++) {
    const col0 = table.getNum(r, 0); // colonna 0 come numero
    const col1 = table.getNum(r, 1); // colonna 1 come numero
    
    // applica le regole
    if (col0 % 5 === 0 && Number.isInteger(col1) && col1 >= 10 && col1 < 50) { // && fa in modo che entrambe le condizioni debbano essere soddisfatte
      let rowObj = {}; // crea un oggetto per ogni riga valida
      for (let c = 0; c < table.getColumnCount(); c++) {
        let colName = table.columns[c]; // nome colonna
        rowObj[colName] = table.get(r, c); //salva la coppia chiave-valore (riga-colonna)
      }
    filteredRows.push(rowObj);
    }
  }

// estrarre i valori numerici delle colonne
col0Values = filteredRows.map(row => Number(row.column0));
col1Values = filteredRows.map(row => Number(row.column1));
col2Values = filteredRows.map(row => Number(row.column2));
col3Values = filteredRows.map(row => Number(row.column3));
col4Values = filteredRows.map(row => Number(row.column4));


// 1. calcolo media colonna 0
  average0 = calcAvg(col0Values);
  print("average col0:", average0);

  //disegnare il grafico di avg colonna 0
  drawAverageCol0();


// 2. calcolo media e deviazione standard colonna 1
  average1 = calcAvg(col1Values);
  std1 = calcStD(col1Values);
  print("average col1:", average1);
  print("std col1:", std1);

  // impostazione diametro target
  targetDiameter = map(std1, 0, 50, 50, 180);


// 3. calcolo moda colonna 2
mode2 = calcMode(col2Values);
print("mode col2:", mode2);

  // disegna il grafico di moda colonna 2
  drawFrequencyBubbles();


// 4. calcolo mediana colonna 3
median3 = calcMedian(col3Values);
print("median col3:", median3);


// 5. calcolo media e deviazione standard colonna 4
  average4 = calcAvg(col4Values);
  std4 = calcStD(col4Values);
  print("average col4:", average4);
  print("std col4:", std4);

}             // CHIUSURA DI SETUP


function draw() {
  clear();

  fill("black");
  stroke(0);
  strokeWeight();

  //text("mouse X: " + mouseX + "   mouse Y: " + mouseY, 50,50)

  // animazione cerchio std1
  if (growing) {
    let delta = targetDiameter - currentDiameter;
    currentDiameter += delta * easing;

    // se il diametro è vicino al target ferma l'animazione e avvia la pausa
    if (abs(delta) < 0.5) {
      growing = false;
      pauseCounter = pauseFrames;
    }
  } else {
    if (pauseCounter > 0) {
      pauseCounter--;
    } else {
      // reset e ricomincia animazione
      currentDiameter = 0;
      growing = true;
    }
  }

  noFill();
  stroke("gold");
  strokeWeight(5);
  circle(width/2, height/2, currentDiameter);

  // etichetta di testo
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("La deviazione standard della colonna 1 è " + nf(std1,1,2), width/2, height-20);
}
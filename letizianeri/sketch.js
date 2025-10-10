let table;
let filteredRows = []; // contiene le righe filtrate come oggetti

function preload() {
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(400, 400);
  
  // ciclo che si ripete su tutte le righe
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
let col0Values = filteredRows.map(row => Number(row.col0));
let col1Values = filteredRows.map(row => Number(row.col1));
let col2Values = filteredRows.map(row => row.col2);


// 1. calcolo media colonna 0
  let average0 = calcAvg(col0Values);
  print("average col0:", average0);


// 2. calcolo media e deviazione standard colonna 1
  let average1 = calcAvg(col1Values);
  let std1 = calcStD(col1Values);
  print("average col1:", average1);
  print("std col1:", std1);


//3. calcolo moda colonna 2
let mode2 = calcMode(col2Values);
print("mode col2:", mode2);

}

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


// function draw() {
// background(220);
//  textSize(16);

//}

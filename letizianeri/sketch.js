let table;
let col0Arr = []; //numeri filtrati nella prima colonna
let col1Arr = []; //numeri filtrati nella seconda colonna

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
    if (col0 % 5 === 0 && Number.isInteger(col1) && col1 >= 10 && col1 < 50) {
      col0Arr.push(col0); //la colonna 0 nel primo array
      col1Arr.push(col1); //la colonna 1 nel secondo array
    }
  }

  //calcolo media colonna 1
  let sum = 0;
  for (let i = 0; i < col0Arr.length; i++) {
    sum += col0Arr[i];
  }
  let average = sum / col0Arr.length;
  print("average:", average); 

}

function draw() {
  background(220);
  textSize(16);

}

let table;
let filtrati = [];

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
      filtrati.push([col0, col1]);
    }
  }

  console.log("righe filtrate:", filtrati); //mostra il numero di righe che soddisfano le condizioni
}

function draw() {
  background(220);
  textSize(16);
 // text(`righe filtrate: ${filtrati.length}`, 10, 30);
}

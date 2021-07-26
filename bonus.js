const readlineSync = require("readline-sync");
const fs = require('fs');

var tennisPlayers = [];

const path = "C:/Users/Lenovo T470p/Desktop/hey.txt";

const main = () => {
    sourceFile = readlineSync.questionPath('Unesite putanju fajla u kome se nalaze podaci o igracima: ', {
        isFile: true
      });
    // fs.readFile(path),(err, data) => {
    //     if(err){
    //         console.log("Greska prilikom ucitavanja fajla, pokusajte ponovo.");
    //         return;
    //     }

    //     var arr = data.toString().split("\n");
    //     console.log(arr);

    // }
    var array = fs.readFileSync(path, 'utf8').toString().split("\n");
    
    for(let i of array) {
        try{
        tennisPlayers.push(JSON.parse(i));
        } catch (e) {
            console.log("Igraci u fajlu nisu u odgovarajucem formatu.");
            return
        }
    }

    console.log(tennisPlayers);
}

main();
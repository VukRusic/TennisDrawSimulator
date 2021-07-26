const readlineSync = require("readline-sync");

var N;
var rounds;
const tennisPlayers = [];

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

const makeDraw = () => {

}

const getRoundsNumber = () => {
  var players = tennisPlayers.length;
  var rounds = 1;

  while(players > 1){
    players/2;
    rounds++;
  }

  return rounds;
}

const checkRanking = (tennisPlayers, ranking) =>{
  var result = true;
  tennisPlayers.forEach(player => {
    if(player.ranking === ranking){
      result = false;
      console.log("Već postoji igrač sa unetim ranking-om!\nUnesite opet podatke ovog tenisera.")
    }
  });
  
  return result;
}

const checkPlayersNumbers = (N) => {
    return (N != 1) && (N != 0) && ((N & (N - 1)) == 0);
}

const addTennisPlayer = () => {
  var tempTennisPlayerData;
  var rank;
  do{
  const tempTennisPlayer = readlineSync.question(
    "Unesite tenisera u obliku [ime],[prezime],[drzava],[ranking]:"
  );

  tempTennisPlayerData = tempTennisPlayer.split(",");
  rank = parseInt(tempTennisPlayerData[3]);
  } while(checkRanking(tennisPlayers, rank) == false)

  tennisPlayers.push({
    firstName: tempTennisPlayerData[0],
    lastName: tempTennisPlayerData[1],
    country: tempTennisPlayerData[2],
    ranking: parseInt(tempTennisPlayerData[3]),
  });
  console.log("Igrac je uspesno dodat!");
}

const main = () => {

  do {
    N = readlineSync.question("Unesite broj tenisera\n(broj tenisera mora da bude u odgovarajucem foramtu (2, 4, 8,16, 32...) i ne veci od 64): ");
  } while (checkPlayersNumbers(N) == false)

  for (var i = 0; i < N; i++) {
    addTennisPlayer();
  }

  console.log("\nSvi igrači su uspešno dodati.");

  shuffle(tennisPlayers);
  console.log(tennisPlayers);

  readlineSync.keyIn("\nPritisnite bilo koje dugme da zapocnete simulaciju turnira...")
  rounds = getRoundsNumber();
  makeDraw();

  for(var i = 1; i <= rounds; i++){
    console.log("\nRound " + i + ":");
    for(var j = 1; j <= rounds; j++){
      
      console.log("\n" + j + " ")
    }

  }

};

main();

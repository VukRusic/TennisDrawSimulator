const readlineSync = require("readline-sync");
const fs = require('fs');


// var tennisPlayers = [
//     { firstName: 'Novak', lastName: 'Djokovic', country: 'Serbia', ranking: 1 },
//     { firstName: 'Rafeal', lastName: 'Nadal', country: 'Spain', ranking: 3 },
//     { firstName: 'Matteo', lastName: 'Berrettini', country: 'Italy', ranking: 2 },
//     { firstName: 'Dominic', lastName: 'Thiem', country: 'Austia', ranking: 4 },
//     { firstName: 'Alexander', lastName: 'Zverev', country: 'Germany', ranking: 5 },
//     { firstName: 'Roger', lastName: 'Federer', country: 'Switzerland', ranking: 6 },
//     { firstName: 'Denis', lastName: 'Shapovalov', country: 'Canada', ranking: 7 },
//     { firstName: 'Hubert', lastName: 'Hurkacz', country: 'Poland', ranking: 8 }
// ];

var tennisPlayers = [];
var mode;

const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }

  const getLoser = () => {
    return Math.floor(Math.random() * 2) + 1;
  }

  const getResult = (i) => {
    sets1 = 3;
    sets2 = Math.floor(Math.random() * 2);
    if(i == 1)
      return sets1 + " : " + sets2;
    else
      return sets2 + " : " + sets1; 
  }
  
  const makeDraw = () => {
    shuffle(tennisPlayers);
    while(checkDraw() == false) {
        shuffle(tennisPlayers);
    }
  }

  const checkDraw = () => {
    var result = true;
    if(tennisPlayers.length > 2){
      for(var i=0; i < tennisPlayers.length; i++){
        if(i%2 == 0 && i != 0){
          if(tennisPlayers[i].ranking == tennisPlayers[i+1].ranking + 1 || tennisPlayers[i].ranking == tennisPlayers[i+1].ranking - 1)
            result = false;
        } else if(i == 0){
          if(tennisPlayers[i].ranking == tennisPlayers[i+1].ranking + 1 || tennisPlayers[i].ranking == tennisPlayers[i+1].ranking - 1)
            result = false;
        }
      }
        
    }

    return result;
  }

  const tennisPlayerToString = (player) => {
    var fistname = player.firstName;
    return fistname.charAt(0) + ". " + player.lastName + " (" + player.country + ", " + player.ranking + ")";
  }

  const getRoundsNumber = () => {
    var players = tennisPlayers.length;
    var rounds = 1;
    while(players > 1){
      players = players/2;
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

const checkPlayerData = (data) => {
  var result = true;
  if(data.length == 4) {
    console.log(data);
    if(isNaN(data[3]))
      result = false;
    for(var i = 0; i < data.length; i++){
      if(data[i] === "")
        result = false;
    }
  } else {
    result = false;
  }
  console.log(result);
  return result;
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
  } while(checkPlayerData(tempTennisPlayerData) == false || checkRanking(tennisPlayers, rank) == false)

  tennisPlayers.push({
    firstName: tempTennisPlayerData[0],
    lastName: tempTennisPlayerData[1],
    country: tempTennisPlayerData[2],
    ranking: parseInt(tempTennisPlayerData[3]),
  });
  console.log("Igrac je uspesno dodat!");
}

const readPlayersFromFile = () => {
  path = readlineSync.questionPath('Unesite putanju fajla u kome se nalaze podaci o igracima: ', {
    isFile: true
  });

  var players = fs.readFileSync(path, 'utf8').toString().split("\n");
    
    for(let p of players) {
        try{
        tennisPlayers.push(JSON.parse(p));
        } catch (e) {
            console.log("Igraci u fajlu nisu u odgovarajucem formatu.");
            return false;
        }
    }

    return true;
}

const chooseMode = (type) => {
  if(type == "m" || type == "t")
    return true;
  else 
    return false;
}


  const main = () => {
    console.log("Dobrodosli!\n");
    do{
      mode = readlineSync.question("Da li zelite sami da unosite igrace (unesite karakter 'm') \nili zelite da ucitavate podatke iz odredjenog txt dokumenta (unesite karakter 't')?");
      console.log(mode)
    } while(chooseMode(mode) == false)

    if(mode == 'm'){
    do {
      N = readlineSync.question("Unesite broj tenisera\n(broj tenisera mora da bude u odgovarajucem foramtu (2, 4, 8,16, 32...) i ne veci od 64): ");
    } while (checkPlayersNumbers(N) == false)
  
      for (var i = 0; i < N; i++) {
        addTennisPlayer();
      }
  
      console.log("\nSvi igrači su uspešno dodati.");
    } else if(mode == 't'){
      console.log("\nIgraci u fajlu moraju da budu u formatu:\nPrimer: { 'firstName': 'Novak', 'lastName': 'Djokovic', 'country': 'Serbia', 'ranking': 1 } -> sa dvostrukin navodnicima, i svaki odvojen u novom redu!\n");
      while(readPlayersFromFile() == false){
        console.log("\nPodaci u trazenom fajlu nisu u odgovarajucem obliku.")
      }
    }

    shuffle(tennisPlayers);

    makeDraw();    
    readlineSync.keyIn("\nPritisnite bilo koje dugme da zapocnete simulaciju turnira...")
    
    var rounds = getRoundsNumber();

    for(var i=1; i<=rounds; i++){
        if(tennisPlayers.length > 1){
        var losers = [];
        var players = tennisPlayers.length;
        switch (players){
            case 2: console.log("\nFinal:"); break;
            case 4: console.log("\nRound " + i + " / Semifinals:"); break;
            default: console.log("\nRound " + i + ":");
        } 
        
        
        for(var j=0, m=1; j<tennisPlayers.length-1; j++, m++){
          let l = getLoser();
          console.log(m + ". " + tennisPlayerToString(tennisPlayers[j]) + " - " + tennisPlayerToString(tennisPlayers[j+1]) + ", result: " + getResult(l));
          if(l > 1)
            losers.push(tennisPlayers[j++]);
          else 
            losers.push(tennisPlayers[++j]);
        }

        losers.forEach(l => {
            var index = tennisPlayers.indexOf(l);
            tennisPlayers.splice(index, 1);
        });
        
    } else {
        console.log("\nWinner:\n!!! " + tennisPlayerToString(tennisPlayers[0]) + " !!!");
    }
}
  
};
  
  main();
  
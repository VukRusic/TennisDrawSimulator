const readlineSync = require("readline-sync");
const fs = require('fs');

var tennisPlayers = [];
var mode;

//mesanje niza koji sadrzi unete igrace
const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//dobijanje random izabranog pobednika meca
const getLoser = () => {
  return Math.floor(Math.random() * 2) + 1;
}

//dobijanje random generisanog rezultata meca (u setovima)
const getResult = (i) => {
  sets1 = 3;
  sets2 = Math.floor(Math.random() * 2);
  if(i == 1)
    return sets1 + " : " + sets2;
  else
    return sets2 + " : " + sets1; 
}

//pravljenje inicijalnog zreba 
const makeDraw = () => {
  shuffle(tennisPlayers);
  //ponovno zrebanje ukoliko nisu ispunjeni uslovi prvog kola
  while(checkDraw() == false) {
    shuffle(tennisPlayers);
  }
}

//provera zreba 
//Teniseri u prvoj rundi ne mogu igrati protiv igrača koji je direktno ispred ili ispod njih na rang listi
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

//ispis podataka o teniseru u trazenom formatu
const tennisPlayerToString = (player) => {
  var fistname = player.firstName;
  return fistname.charAt(0) + ". " + player.lastName + " (" + player.country + ", " + player.ranking + ")";
}

//dobijanje broja rundi koje ce se odigrati na osnovu broja tenisera
const getRoundsNumber = () => {
  var players = tennisPlayers.length;
  var rounds = 1;
  while(players > 1){
    players = players/2;
    rounds++;
  }
  return rounds;
}

//provera rankinga tenisera
//Teniseri ne mogu deliti isti ranking.
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

//provera da li je za broj ucesnika turnira unesen odgovarajuci broj
const checkPlayersNumbers = (N) => {
  if(isNaN(N))
    return false;
  else
    return (N != 1) && (N != 0) && ((N & (N - 1)) == 0);
}

//provera unetih podataka o teniseru
const checkPlayerData = (data) => {
  var result = true;
  console.log(data.length);
  if(data.length == 4) {
    if(isNaN(data[3])){
      result = false;
    }
    for(var i = 0; i < data.length; i++){
      if(data[i] === ""){
        result = false;
      }
    }
  } else {
    result = false;
  }
  if(result == false){
    console.log("Uneti podaci nisu u odgovarajucem formatu. Pokusajte ponovo.\n");
  }
  return result;
}

//dodavanje novog tenisera u 'm' modu, manuelno unosenje
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
  console.log("Igrac je uspesno dodat!\n");
}

//citanje podataka iz txt fajla u 't' modu
const readPlayersFromFile = () => {
  path = readlineSync.questionPath('Unesite putanju fajla u kome se nalaze podaci o igracima: ', {
    isFile: true
  });

  var players = fs.readFileSync(path, 'utf8').toString().split("\n");
    
  for(let p of players) {
    try{
    tennisPlayers.push(JSON.parse(p));
    } catch (e) {
      return false;
    }
  }
  return true;
}

//odabir moda (nacina) unosa tenirera u program
const chooseMode = (type) => {
  if(type == "m" || type == "t")
    return true;
  else 
    return false;
}


const main = () => {
  console.log("Dobrodosli!\n");
  //biranje moda unosa
  do{
    mode = readlineSync.question("Da li zelite sami da unosite igrace (unesite karakter 'm') \nili zelite da ucitavate podatke iz odredjenog txt dokumenta (unesite karakter 't')?");
  } while(chooseMode(mode) == false)

  //verzija programa namenjena manuelnom unosu podataka o teniserima
  if(mode == 'm'){
  do {
    N = readlineSync.question("Unesite broj tenisera\n(broj tenisera mora da bude u odgovarajucem foramtu (2, 4, 8,16, 32...) i ne veci od 64): ");
  } while (checkPlayersNumbers(N) == false)
  
    for (var i = 0; i < N; i++) {
      addTennisPlayer();
    }
    console.log("\nSvi igrači su uspešno dodati.");

  //varzija programa namenjena iscitavanju txt fajla sa podacima o teniserima
  } else if(mode == 't'){
    console.log("\nIgraci u fajlu moraju da budu u formatu\nPrimer: { 'firstName': 'Novak', 'lastName': 'Djokovic', 'country': 'Serbia', 'ranking': 1 }\n -> sa dvostrukin navodnicima, i svaki odvojen u novom redu!\nBroj tenisera mora da bude u odgovarajucem foramtu (2, 4, 8,16, 32...) i ne veci od 64.\n");
    while(readPlayersFromFile() == false){
      console.log("Podaci u trazenom fajlu nisu u odgovarajucem obliku.");
    }
    if(checkPlayersNumbers(tennisPlayers.length) == false){
      console.log("U fajlu se nalazi neodgovarajuci broj tenisera.");
      return;
    }
  }
  //mesanje unetog niza
  shuffle(tennisPlayers);
  makeDraw();    
  readlineSync.keyIn("\nPritisnite bilo koje dugme da zapocnete simulaciju turnira...")  
  var rounds = getRoundsNumber();

  //ispis rounde (faze) turnira
  for(var i=1; i<=rounds; i++){
    if(tennisPlayers.length > 1){
    var losers = [];
    var players = tennisPlayers.length;
      switch (players){
        case 2: console.log("\nFinal:"); break;
        case 4: console.log("\nRound " + i + " / Semifinals:"); break;
        default: console.log("\nRound " + i + ":");
      } 
        
    //ispis parova runde    
    for(var j=0, m=1; j<tennisPlayers.length-1; j++, m++){
      //random generisanje gubitnika tog para
      let l = getLoser();
      console.log(m + ". " + tennisPlayerToString(tennisPlayers[j]) + " - " + tennisPlayerToString(tennisPlayers[j+1]) + ", result: " + getResult(l));
      //dodavanje gubitnika u niz sa porazenim igracima
      if(l > 1)
        losers.push(tennisPlayers[j++]);
      else 
        losers.push(tennisPlayers[++j]);
    }

    //odvajanje porazenih igraca runde od inicijalnog niza igraca
    losers.forEach(l => {
        var index = tennisPlayers.indexOf(l);
        tennisPlayers.splice(index, 1);
    });
    
    //ispis pobednika ukoliko je ostao samo 1 teniser u nizu
    } else {
        console.log("\nWinner:\n!!! " + tennisPlayerToString(tennisPlayers[0]) + " !!!");
    }
  }
  
};
  
main();
  
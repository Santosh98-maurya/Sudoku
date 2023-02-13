//load the board
const easy=["6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
"685329174971485326234761859362574981549618732718293465823946517197852643456137298"];

const medium=["--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
"619472583243985617587316924158247369926531478734698152891754236365829741472163895"];

const hard=["-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
"712583694639714258845269173521436987367928415498175326184697532253841769976352841"];

//Create a variable
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelecte;

window.onload=function(){                            //function onloaded for whole page
    //Run startGame function when botton is click
    id("start-btn").addEventListener("click", startGame);
    //Add eventListener to each number in number container.
    for(let i=0; i<id("number-container").children.length; i++){
        id("number-container").children[i].addEventListener("click", function(){
            //if selecting is not disabled.
            if(!disableSelecte){
                //If number is allready selected
                if(this.classList.contains("selected")){
                    //remove the selected number.
                    this.classList.remove("selected");
                    selectedNum=null;
                } else {
                    //Deselect all other number.
                    for(let i=0; i < 9; i++){
                        id("number-container").children[i].classList.remove("selected");
                    }
                    //Select it and update selectedNum variable
                    this.classList.add("selected");
                    selectedNum=this;
                    updateMove();
                }
            }
        });
        
    }
}


function startGame(){                      //function for start the game
    //Choose board Difficulty level
    let board;
    if (id("level-1").checked) board=easy[0];
    else if (id("level-2").checked) board=medium[0];
    else board=hard[0];

    //Set live to 3 and enable selecting number and tile.
    lives=3;
    disableSelecte=false;
    id("live").textContent="Live Reamining: 3";

    // Create a board on difficulty level.
    generateBoard(board);
    //Set timer
    startTimer();

    //Set theam of game.
    if(id("theam-1").checked){
        qs("body").classList.remove("dark");
    }else{
        qs("body").classList.add("dark");
    }

    //Show number container
    id("number-container").classList.remove("hidden");
}




function startTimer(){                                //functionn for set timer for game
    //Set time remaining based on input are Checked.
    if (id("time-1").checked) timeRemaining=300;
    else if (id("time-2").checked) timeRemaining=600;
    else timeRemaining=900;

    //Set timer for first second
    id("timer").textContent=timeConversion(timeRemaining);
    //Set time update every second.
    timer=setInterval(function(){
        timeRemaining--;
        //if no time is remaining end the game.
        if(timeRemaining ===0 ) endGame();
        id("timer").textContent=timeConversion(timeRemaining);
    }, 1000)
}



//Conver Second into string of MM:SS format.
function timeConversion(time){
    let minutes=Math.floor(time/60);
    if(minutes<10) minutes="0" + minutes;
    let seconds=time % 60;
    if(seconds<10) seconds="0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board){           //function for generate the board
    //Clear previous board.
    clearPrevious();
    //Lets used to increment tile ids.
    let idCount=0;
    //Create 81 tiles.
    for(let i=0; i<81; i++){
        //Create new paragraph element.
        let tile=document.createElement("p");
        //check tile empty or not
        if(board.charAt(i)!="-"){
            //Set tile tiole curerent text value.
            tile.textContent=board.charAt(i);
        }else{
            //Add click eventListener to the current tile.
            tile.addEventListener("click", function(){
                //if selecting is not disabled.
                if(!disableSelecte){
                    //if tile is allready selected.
                    if(tile.classList.contains("selected")) {
                        //then remove selection
                        tile.classList.remove("selected");
                        selectedTile=null;
                    } else {
                        //Deselect all other tiles
                        for(let i=0; i<81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add the selection aand update variable
                        tile.classList.add("selected");
                        selectedTile=tile;
                        updateMove();
                    }
                }
            })
        }
        //Assign tile Id
        tile.id=idCount;
        //Increment for next tile
        idCount++;
        //Add tile class to all tiles
        tile.classList.add("tile");
        if((tile.id>17 && tile.id<27) || (tile.id>44 && tile.id<54)){
            tile.classList.add("bottomBorder");
        }
        if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
            tile.classList.add("rightBorder");
        }
        //Add tile to board
        id("board").appendChild(tile);
    }
}



function updateMove(){                   //function for update the in board
    //If a tile and a number is selected
    if(selectedNum && selectedTile){
        //Set the tile to the correct number
        selectedTile.textContent=selectedNum.textContent;
        //If the number match to corresponding number in solution key
        if(checkCorrect(selectedTile)){
            //Deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //Clear selected variable
            selectedNum=null;
            selectedTile=null;
            
            //if number is not match to the soution key
        } else {
            //Deselct the selecting number for a second
            disableSelecte=true;
            //Make tile turn red
            selectedTile.classList.add("incorrect");
            //Run one ssecond
            setTimeout(function(){
                //subtract lives by one
                lives --;
                //If no lives left the end the game
                if(lives === 0){
                    endGame();
                } else {
                    //If live is not equal to zero
                    //Update lives text
                    id("live").textContent="Live Remaining: " + lives;
                    //Renable selecting numbers and tiles
                    disableSelecte=false;
                    //Restore tile color and remove selected from both
                    selectedTile.classList.remove("incorrect");
                    selectedTile.classList.remove("selected");
                    selectedNum.classList.remove("selected");
                    //clear tiles text and clear selected variables
                    selectedTile.textContent = "";
                    selectedNum = null;
                    selectedTile = null;
                }
            }, 1000)
        }
    }
}


function checkDone(){
    let tiles=qsa(".tile");
    for(let i=0; i<tiles.length; i++) {
        if(tiles[i].textContent==="") return false;
    }
    return true;
}

function endGame(){              //function for end the game
    //Disable move and stop timer
    disableSelecte=true;
    clearTimeout(timer);
    //Display win and loss messege
    if(lives === 0 || timeRemaining === 0){
        id("live").textContent="You lost!";
    } else {
        id("live").textContent="You win!";
    }
}

function checkCorrect(tile){              //function for check the inpute number it is right or not
    //set solution based on difficulty level
    let solution;
    if(id("level-1").checked) solution=easy[1];
    else if(id("level-2").checked) solution=medium[1];
    else solution=hard[1];
    //If tile's number is equal to solution number
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}



function clearPrevious(){   //function for clear the previous board
// Acces all of the tile
let tiles=qsa(".tile");
// Remove each tile
for(let i=0; i<tiles.length; i++){
    tiles[i].remove();
}
// if there is timer clear it
if(timer) clearTimeout(timer);
// Deselected any numbers
for(let i=0; i<id("number-container").children.length; i++){
    id("number-container").children[i].classList.remove("selected");
}
//Clear Selected variable.
selectedNum=null;
selectedTile=null;
}



// Helper Function in sudoku game created by me.
function id(id){
   return document.getElementById(id);
}

function qs(selector){
    return document.querySelector(selector);
}

function qsa(selector){
    return document.querySelectorAll(selector);
}
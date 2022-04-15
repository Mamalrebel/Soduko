// load board from file
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

//   create variables
var timer;
var timeremining;
var lives;
var selectedNum;
var selectedTiles;
var disableSelect;


window.onload = function() {
    //run startgame function when buttom is clicked 
    id("start-btn").addEventListener("click" , startGame);
    //add event listener to number container
    for(let i = 0; i < id("number-container").children.length ; i++){
        id("number-container").children[i].addEventListener("click", function(){
            //if selecting in not disable
            if(!disableSelect){
                //if number is already selected 
                if(this.classList.contains("selected")){
                    //then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;                  
                }else{
                    //sedelect all other numbers
                    for(let i = 0; i < 9 ; i++){
                        id("number-container").children[i].classList.remove("selected");
                    }
                }
                //select it and update selection variable
                this.classList.add("selected");
                selectedNum = this;
                updateMove();
            }
        })
    }
}

function startGame() {
    //choose board dificulty 
    let board;
    if(id("diff-1").checked) {
        board = easy[0];
    } else if(id("diff-2").checked){
        board = medium[0];
    }else {
        board = hard[0];
    }
    //set lives to 3 and enable selecting numbers and tiles 
    lives = 7;
    disableSelect = false;
    id("lives").textContent = "جان باقی مانده :7";
    //create board based on dificulty 
    generateBoard(board);
    //start the timer
    startTimer();
    //sets theme based on input
    if(id("theme-1").checked){
        qs("body").classList.remove("dark");
    }else{
        qs("body").classList.add("dark");
    }
    //show number container 
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    //sets time on input 
    if(id("time-1").checked){
        timeremining = 180;
    } else if(id("time-2").checked){
        timeremining = 300;
    }else {
        timeremining = 600;
    }
    //set timer for first second 
    id("timer").textContent = timeConversion(timeremining);
    //set timer to timer every second 
    timer = setInterval( function(){
        timeremining --;
        //if no time remaining end the game 
        if(timeremining === 0) endGame();
        id("timer").textContent = timeConversion(timeremining);
    }, 1000 )
}

function timeConversion(time){
    //convert seconds into mm:ss
    let minutes = Math.floor(time / 60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if(seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board){
    //clear previous board 
    clearPrevious();
    //let use to increment tile ids
    let idCount = 0;
    //create 81 tiles
    for(let i = 0; i < 81; i++ ){
        //create a new paragraph element 
        let tile = document.createElement("p");
        //if the tile is not supposed to be blank
        if(board.charAt(i) != "-" ){
            //set tile text to correct number 
            tile.textContent = board.charAt(i);
        } else{
            //add click event listener to tile
            tile.addEventListener("click", function(){
                //if selecting is not disable
                if(!disableSelect){
                    //if tje tile is aleardy selectd
                    if(tile.classList.contains("selected")){
                        //then remove selection
                        tile.classList.remove("selected");
                        selectedTiles = null;
                    }else {
                        //deselected all other tils
                        for(let i = 0; i< 81 ; i++){
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //add selection and update varible 
                        tile.classList.add("selected");
                        selectedTiles = tile;
                        updateMove();
                    }
                }
            })
        }
        //assign tile id 
        tile.id = idCount;
        //Increment for next tile 
        idCount ++;
        //Add tile class to all tiles 
        tile.classList.add("tile");
        if((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)){
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
            tile.classList.add("rightBorder");
        }
        //Add tile to board 
        id("board").appendChild(tile);
    }
}

function updateMove(){
    //if atile and number is selected 
    if(selectedTiles && selectedNum){
        //set the tile to the correct number
        selectedTiles.textContent = selectedNum.textContent;
        //if the number matchs the correspoding number the solution key
        if(checkCorrect(selectedTiles)){
            //deselects the tile
            selectedTiles.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //clear the selected variables
            selectedNum = null;
            selectedTiles = null;
            //check if board is completed
            if(checkDone()){
                endGame();
            }
            //if number does not match the solution key

        } else {
            //disable selecting new number for one second
            disableSelect = true;
            //make the tile turn red 
            selectedTiles.classList.add("incorrect");
            //run in one second
            setTimeout(function(){
                //subtract lives by one
                lives --;
                //if no lives left end the game
                if(lives === 0) {
                    endGame();
                } else {
                    //if lives not equal to zero
                    //update lives text
                    id("lives").textContent = "جان باقی مانده:" + lives;
                    //renable selecting numbers and tiles
                    disableSelect = false;
                }
                //restore tile color and remove selected from both
                selectedTiles.classList.remove("incorrect");
                selectedTiles.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //clear the tiles text and clear selected variables 
                selectedTiles.textContent = "";
                selectedTiles = null;
                selectedNum = null;
            },1000)
        }
    }
}

function checkDone(){
    let tiles = qsa(".tile");
    for(let i = 0; i < tiles.length ; i++){
        if(tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame(){
    //disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);
    //display win or loss massage 
    if(lives === 0 || timeremining === 0){
        id("lives").textContent = "ای وای باختی دوباره امتحان کن;)";
    } else{
        id("lives").textContent = "تبریک! شما برنده شدید ";
    }
}

function checkCorrect(tile){
    //set solution based on dificulty selection
    let solution;
    if(id("diff-1").checked) {
        solution = easy[1];
    } else if(id("diff-2").checked){
        solution = medium[1];
    }else {
        solution = hard[1];
    }
    //if tiles number is equal to solution number 
    if(solution.charAt(tile.id) === tile.textContent ) return true;
    else return false;
}

function clearPrevious(){
    //access all of tiles 
    let tiles = qsa(".tile");
    //remove each tile 
    for(let i = 0; i < tiles.length; i++){
        tiles[i].remove();
    }
    //if there is a timer clear it 
    if(timer) clearTimeout(timer);
    //dedelect any numbers 
    for(let i = 0; i < id("number-container").children.length; i++ ){
        id("number-container").children[i].classList.remove("selected");
    }
    //clear selected variables
    selectedTiles = null;
    selectedNum = null;
}



//helper funtions
function id(id) {
    return document.getElementById(id);
}

function qs(selector){
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}



function placePiece(e) {
  let piece = e.target;
  const row = parseInt(piece.getAttribute("row"));
  const column = parseInt(piece.getAttribute("column"));
	  if (!ballselected) {
	  board[row][column] = -1;
	  currentPlayer = - currentPlayer;
	  displayCurrentPlayer();
	  remakeBoard();
	} else {makeTheCapture(e)}
	
}

function score(e) {
	let piece = e.target;
	const row = parseInt(piece.getAttribute("row"));
	const column = parseInt(piece.getAttribute("column"));
	let p = new Piece(row, column);
	clickedontarget = enableToCapture(p);		  
	remakeBoard();
}

function makeTheCapture(e) {
	let piece = e.target;
	const row = parseInt(piece.getAttribute("row"));
	const column = parseInt(piece.getAttribute("column"));
	let p = new Piece(row, column);
	clickedontarget = enableToCapture(p);		  
			//if there are possible jump spots, this will mark them and make the ball selected.
			//otherwise, nothing will happen.
		
	if (clickedontarget) {
		jumpstarted = true;
		ballselected = markJumpLocations(p);
				if (!ballselected) {
						currentPlayer = -currentPlayer;
						displayCurrentPlayer();
						var socket = io();
						socket.emit('boardUpdate', board, currentPlayer);
						emitting = true;
						jumpstarted = false;
				}
	}	else { 
			if (jumpstarted) {
					displayCurrentPlayer();
					currentPlayer = -currentPlayer;
			}
			ballselected = false
		}		
				
}
//what happens when jump started but click not on a target 




function ballClicked(e) {
  let piece = e.target;
  const row = parseInt(piece.getAttribute("row"));
  const column = parseInt(piece.getAttribute("column"));
  let p = new Piece(row, column);
	  if (!ballselected){
		//if there are possible jump spots, this will mark them and make the ball selected.
		//otherwise, nothing will happen.
		ballselected = markJumpLocations(p);
	  } else {
		  if (jumpstarted === true) {
			currentPlayer = - currentPlayer;
			displayCurrentPlayer();
		  }
		  ballselected = false; 
		  jumpstarted = false;

		  remakeBoard();
		  }
		  
}



function enableToCapture(p) {
  let clickedontarget = false;
  let pos = null;
  capturedPosition.forEach((element) => {
    if (element.newPosition.compare(p)) {
      clickedontarget = true;
      pos = element.newPosition;
      old = element.pieceCaptured;
	  //delete captured pieces
	  board[old.row][old.column] = 0;
      return;
    }
  });
  
  if (clickedontarget) {
    // if the current piece can move on, edit the board and rebuild
    board[pos.row][pos.column] = 1; // move the piece
    board[readyToMove.row][readyToMove.column] = 0; // delete the old position

    // reinit ready to move value

    readyToMove = null;
    capturedPosition = [];
    posNewPosition = [];
  }
    remakeBoard();
    return clickedontarget;

	

}


function moveThePiece(newPosition) {
  // if the current piece can move on, edit the board and rebuild
  board[newPosition.row][newPosition.column] = currentPlayer;
  board[readyToMove.row][readyToMove.column] = 0;

  // init value
  readyToMove = null;
  posNewPosition = [];
  capturedPosition = [];

  currentPlayer = -currentPlayer;

  displayCurrentPlayer();
  remakeBoard();
}

function markPossiblePosition(p, player = 0, direction = 0) {
  attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);

  position = document.querySelector("[data-position='" + attribute + "']");
  if (position) {
    position.style.background = "red";
    posNewPosition.push(new Piece(p.row + player, p.column + direction));
  }
}



function remakeBoard() {
  game.innerHTML = "";
  let victory = 0;
  for (let i = 0; i < board.length; i++) {
    const element = board[i];
    let row = document.createElement("div"); // create div for each row
    row.setAttribute("class", "row");

    for (let j = 0; j < element.length; j++) {
      const elmt = element[j];
      let col = document.createElement("div"); // create div for each case
      let piece = document.createElement("div");
      let caseType = "";
      let occupied = "";

	  if ((board[i][j] === 1 && i === 0) || (board[i][j] === 1 && i === 1)) { 
	  victory = 1
	  }
	  if ((board[i][j] === 1 && i === board.length-1)||(board[i][j] === 1 && i === board.length-2) ) { 
	  victory = -1
	  }
		

      // add the piece if the case isn't empty
	  //add event listener to each piece which is not black
      if (board[i][j] === 1) {
        occupied = "whitePiece";
		piece.addEventListener("click", ballClicked);
      } else if (board[i][j] === -1) {
        occupied = "blackPiece";
      } else if (board[i][j] === 0) {
        occupied = "empty";
		piece.addEventListener("click", placePiece);
      } else if (board[i][j] === 3){
        occupied = "goalp1";
		piece.addEventListener("click", score); 
	  } else if (board[i][j] === 2){
        occupied = "goalp2";
		piece.addEventListener("click", score); 
	  } else {
		occupied = "out";
	  }

      piece.setAttribute("class", "occupied " + occupied);

      // set row and colum in the case
      piece.setAttribute("row", i);
      piece.setAttribute("column", j);
      piece.setAttribute("data-position", i + "-" + j);


	 

      col.appendChild(piece);

      col.setAttribute("class", "column " + caseType);
      row.appendChild(col);
    }

    game.appendChild(row);
  }

  if (victory === 1 || victory === -1) {
    modalOpen(victory);
  }

        var socket = io();
		socket.emit('boardUpdate', board, currentPlayer);
		emitting = true;
}




function silentRemakeBoard() {
  game.innerHTML = "";
  let victory = 0;
  for (let i = 0; i < board.length; i++) {
    const element = board[i];
    let row = document.createElement("div"); // create div for each row
    row.setAttribute("class", "row");

    for (let j = 0; j < element.length; j++) {
      const elmt = element[j];
      let col = document.createElement("div"); // create div for each case
      let piece = document.createElement("div");
      let caseType = "";
      let occupied = "";
	  if ((board[i][j] === 1 && i === 0) || (board[i][j] === 1 && i === 1)) { 
	  victory = 1
	  }
	  if ((board[i][j] === 1 && i === board.length-1)||(board[i][j] === 1 && i === board.length-2) ) { 
	  victory = -1
	  }
		

      // add the piece if the case isn't empty
	  //add event listener to each piece which is not black
      if (board[i][j] === 1) {
        occupied = "whitePiece";
		piece.addEventListener("click", ballClicked);
      } else if (board[i][j] === -1) {
        occupied = "blackPiece";
      } else if (board[i][j] === 0) {
        occupied = "empty";
		piece.addEventListener("click", placePiece);
      } else if (board[i][j] === 3){
        occupied = "goalp1";
		piece.addEventListener("click", score); 
	  } else if (board[i][j] === 2){
        occupied = "goalp2";
		piece.addEventListener("click", score); 
	  } else {
		occupied = "out";
	  }

      piece.setAttribute("class", "occupied " + occupied);

      // set row and colum in the case
      piece.setAttribute("row", i);
      piece.setAttribute("column", j);
      piece.setAttribute("data-position", i + "-" + j);


	 

      col.appendChild(piece);

      col.setAttribute("class", "column " + caseType);
      row.appendChild(col);
    }

    game.appendChild(row);
  }

  if (victory === 1 || victory === -1) {
    modalOpen(victory);
  }

     
}




function displayCurrentPlayer() {
  var container = document.getElementById("next-player");
  if (currentPlayer === -1) {
    container.setAttribute("class", "occupied blackPiece");
  } else {
    container.setAttribute("class", "occupied whitePiece");
  }
}

function markJumpLocations(p) {
  let found = false;
  
  for (let i = -1; i < 2; i++)
	{
	for (let j = -1; j < 2; j++)
		{
		  if (board[p.row +i][p.column +j] === -1 )
			{
				found = true;  
				pathlength = 1;
				pathopen = true;
				while (pathopen) {
					pathlength++;
					pathopen = (board[p.row +i*pathlength][p.column +j*pathlength] === -1)		
					}				  
				newPosition = new Piece(p.row +i*pathlength, p.column +j*pathlength);
				readyToMove = p;
				markPossiblePosition(newPosition);
				for (let k = 1; k < pathlength; k++) {
								// save the new position and the opponent's piece position
					capturedPosition.push({
					newPosition: newPosition,
					pieceCaptured: new Piece(p.row +i*k, p.column +j*k),  
					});
				}
				  
			} 
		}	
		
	}	
		
	return found;
}


function modalOpen(victory) {
  document.getElementById("winner").innerHTML = victory === 1 ? "Blue" : "Pink";
  document.getElementById("loser").innerHTML = victory === -1 ? "Blue" : "Pink";
  modal.classList.add("effect");
}

function modalClose() {
  modal.classList.remove("effect");
  board = [
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],

];
  currentPlayer = 1;
  displayCurrentPlayer();
  remakeBoard();
  socket.emit('boardUpdate', board, currentPlayer);
}
	  
	  document.addEventListener('DOMContentLoaded', (event) => {
        var socket = io();

        socket.on('gameState', (newBoard, player) => {
		if (emitting === false) {
			board = newBoard;
			currentPlayer = player; 
			displayCurrentPlayer();
			silentRemakeBoard();
		} else {emitting = false}  
		
        });

		
      });
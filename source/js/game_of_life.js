function playGameOfLife() {

    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function mouseMove(e) {
        var mousePos = getMousePos(e);
        mouse.x = mousePos.x;
        mouse.y = mousePos.y;
        if (mouseIsDown) {
            checkMouseClick(true);
        }
    }

    var mouseIsDown = false;

    var canvas = document.getElementById('game-canvas');
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mouseleave', mouseLeave);
    // Check if user has canvas feature with canvas.getContext
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var SQUARE_WIDTH = 8;
    var PURE_WHITE = 'rgba(255, 255, 255, 1.0)';
    var LIGHT_COLOUR = 'rgba(255, 255, 255, 0.85)';
    var DARK_COLOUR = 'rgba(255, 255, 255, 0.3)';

    var mouse = {};
    var numRows = Math.floor(HEIGHT/(SQUARE_WIDTH+1)) - 4; // 4 * SQUARE_WIDTH pixels available for controls
    var numCols = Math.floor(WIDTH/(SQUARE_WIDTH+1));

    var GRID_WIDTH = (numCols*(SQUARE_WIDTH+1))+1;
    var GRID_HEIGHT = (numRows*(SQUARE_WIDTH+1))+1;

    var PLAY_PAUSE_BUTTON = {
        x: GRID_WIDTH/2 - 10,
        y: GRID_HEIGHT+10,
        width: 25,
        height: 25
    }

    var CLEAR_BUTTON = {
        x: GRID_WIDTH/2 + 20,
        y: GRID_HEIGHT+13,
        width: 20,
        height: 20
    }

    var topPadding = 0;
    var leftPadding = (WIDTH-GRID_WIDTH)/2;

    ctx.fillStyle = '#1591B2'; // colour of background
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillRect(leftPadding, topPadding, GRID_WIDTH, GRID_HEIGHT);

    var grid = [];
    var gridColour = []; // Keep track of grid colours; don't unnecessarily clear and fill grid squares

    var clearGrid = function() {
        for (var i = 0; i < numRows; i++) {
            grid[i] = [];
            gridColour[i] = [];
            for (var j = 0; j < numCols; j++) {
                grid[i][j] = false;
                gridColour[i][j] = null;
            }
        }
    }

    clearGrid();

    var getGridSquareCoordinates = function(i, j) {
        var x = leftPadding + 1 /* 1 for left margin */ + j*(SQUARE_WIDTH+1);
        var y = topPadding + 1 /* 1 for top margin */ + i*(SQUARE_WIDTH+1);
        return {
            x: x,
            y: y
        };
    };

    var drawCellAtIndex = function(i, j, colour) {
        ctx.fillStyle = colour;
        if (gridColour[i][j] !== ctx.fillStyle) {
            gridColour[i][j] = ctx.fillStyle;
            var coords = getGridSquareCoordinates(i, j);
            ctx.clearRect(coords.x, coords.y, SQUARE_WIDTH, SQUARE_WIDTH);
            ctx.fillRect(coords.x, coords.y, SQUARE_WIDTH, SQUARE_WIDTH);
        }
    };

    var drawGrid = function(selectedCell) {
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {
                if (!selectedCell || i !== selectedCell.row || j !== selectedCell.col) {
                    drawCellAtIndex(i, j, getColour(grid[i][j]));
                }
            }
        }
    };

    var getColour = function(isSelected) {
        if (isSelected) {
            return LIGHT_COLOUR;
        }
        return DARK_COLOUR;
    };

    var getFocusedGridSquare = function() {
        if (mouse.x && mouse.y) {
            var x = mouse.x - leftPadding - 3; // 1 for left margin
            var y = mouse.y - topPadding - 4; // 1 for top margin
            var col = Math.floor(x/(SQUARE_WIDTH+1));
            var row = Math.floor(y/(SQUARE_WIDTH+1));
            if (row < numRows && col < numCols && row >= 0 && col >= 0) {
                return {
                    row: row,
                    col: col
                };
            }
        }
        return null;
    };

    var mouseHoverUpdate = function() {
        // console.log(getFocusedGridSquare());
        var selectedCell = getFocusedGridSquare();
        if (selectedCell) {
            var row = selectedCell.row;
            var col = selectedCell.col;
            drawCellAtIndex(row, col, PURE_WHITE);
        }
        return selectedCell;
    };

    function mouseTouchingButton(button) {
        return mouse && mouse.x >= button.x && mouse.x <= button.x + button.width &&
            mouse.y >= button.y && mouse.y <= button.y + button.height;
    }

    function togglePlayPauseButton() {
        ctx.clearRect(PLAY_PAUSE_BUTTON.x, PLAY_PAUSE_BUTTON.y, PLAY_PAUSE_BUTTON.width, PLAY_PAUSE_BUTTON.height);
        if (isPlaying) {
            pauseImage = new Image();
            pauseImage.src = 'images/pause-icon.png';
            pauseImage.onload = function() {
                ctx.drawImage(pauseImage, PLAY_PAUSE_BUTTON.x, PLAY_PAUSE_BUTTON.y, PLAY_PAUSE_BUTTON.width, PLAY_PAUSE_BUTTON.height);
            };
        } else {
            playImage = new Image();
            playImage.src = 'images/play-icon.png';
            playImage.onload = function() {
                ctx.drawImage(playImage, PLAY_PAUSE_BUTTON.x, PLAY_PAUSE_BUTTON.y, PLAY_PAUSE_BUTTON.width, PLAY_PAUSE_BUTTON.height);
            };
        }
    }

    function mouseUp() {
        mouseIsDown = false;
    }

    var lastToggledCell = {
        row: null,
        col: null
    };

    function checkMouseClick(shouldCheckLastToggled) {
        var selectedCell = getFocusedGridSquare();
        if (selectedCell) {
            var row = selectedCell.row;
            var col = selectedCell.col;
            console.log(lastToggledCell);
            if (!shouldCheckLastToggled || lastToggledCell.row !== row || lastToggledCell.col !== col) {
                console.log('wat');
                grid[row][col] = !grid[row][col];
            }

            lastToggledCell.row = row;
            lastToggledCell.col = col;
        } else {
            // Check for button clicks
            if (mouseTouchingButton(PLAY_PAUSE_BUTTON)) {
                isPlaying = !isPlaying;
                togglePlayPauseButton();
            } else if (mouseTouchingButton(CLEAR_BUTTON)) {
                clearGrid();
            }
        }
    }

    function mouseDown() {
        mouseIsDown = true;
        checkMouseClick(false);
    }

    function mouseLeave() {
        mouse = {};
    }

    function getNumAliveNeighbours(i, j) {
        numAlive = 0;
        if (i > 0) {
            if (grid[i-1][j]) {
                numAlive++;
            }
            if (j > 0 && grid[i-1][j-1]) {
                numAlive++;
            }
            if (j < numCols-1 && grid[i-1][j+1]) {
                numAlive++;
            }
        }
        if (j > 0) {
            if (grid[i][j-1]) {
                numAlive++;
            }
            if (i < numRows-1 && grid[i+1][j-1]) {
                numAlive++;
            }
        }
        if (i < numRows-1) {
            if (grid[i+1][j]) {
                numAlive++;
            }
            if (j < numCols-1 && grid[i+1][j+1]) {
                numAlive++;
            }
        }
        if (j < numCols-1 && grid[i][j+1]) {
            numAlive++;
        }
        return numAlive;
    }

    function populateGrid(gridRow, colIdx, numAliveNeighbours, isAlive) {
        if (isAlive) {
            gridRow[colIdx] = numAliveNeighbours === 2 || numAliveNeighbours === 3;
        } else {
            gridRow[colIdx] = numAliveNeighbours === 3;
        }
    }

    function updateGrid() {
        var newGrid = [];
        for (var i = 0; i < numRows; i++) {
            newGrid[i] = [];
            for (var j = 0; j < numCols; j++) {
                populateGrid(newGrid[i], j, getNumAliveNeighbours(i, j), grid[i][j]);
            }
        }
        grid = newGrid;
    }

    var playCounter = 0;
    var speed = 5; // speed should vary from 0 to 10
    var update = function() {
        if (isPlaying) {
            if (playCounter % (11-speed) === 0) {
                updateGrid();
            }
            playCounter++;
        }
        var selectedCell = mouseHoverUpdate();
        drawGrid(selectedCell);
    };

    function animationLoop() {
        requestAnimFrame(animationLoop);
        update();
    }

    // Setup
    var isPlaying = false;

    function createClearButton() {
        clearImage = new Image();
        clearImage.src = 'images/clear-icon.png';
        clearImage.onload = function() {
            ctx.drawImage(clearImage, CLEAR_BUTTON.x, CLEAR_BUTTON.y, CLEAR_BUTTON.width, CLEAR_BUTTON.height);
        };
    }

    function loadButtons() {
        togglePlayPauseButton();
        createClearButton();
    }

    drawGrid(null);
    loadButtons();
    animationLoop();

}

function playGameOfLife() {

    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function trackPosition(e) {
        var mousePos = getMousePos(e);
        mouse.x = mousePos.x;
        mouse.y = mousePos.y;
    }

    var canvas = document.getElementById('game-canvas');
    canvas.addEventListener('mousedown', mouseClick);
    canvas.addEventListener('mousemove', trackPosition);
    // Check if user has canvas feature with canvas.getContext
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var SQUARE_WIDTH = 10;
    var PURE_WHITE = 'rgba(255, 255, 255, 1.0)';
    var LIGHT_COLOUR = 'rgba(255, 255, 255, 0.85)';
    var DARK_COLOUR = 'rgba(255, 255, 255, 0.3)';

    var mouse = {};
    var numRows = Math.floor(HEIGHT/(SQUARE_WIDTH+1)) - 4; // 4 * SQUARE_WIDTH pixels available for controls
    var numCols = Math.floor(WIDTH/(SQUARE_WIDTH+1));

    var GRID_WIDTH = (numCols*(SQUARE_WIDTH+1))+1;
    var GRID_HEIGHT = (numRows*(SQUARE_WIDTH+1))+1;
    var topPadding = 0;
    var leftPadding = (WIDTH-GRID_WIDTH)/2;

    ctx.fillStyle = '#1591B2'; // colour of background
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillRect(leftPadding, topPadding, GRID_WIDTH, GRID_HEIGHT);

    var grid = [];
    var gridColour = []; // Keep track of grid colours; don't unnecessarily clear and fill grid squares
    for (var i = 0; i < numRows; i++) {
        grid[i] = [];
        gridColour[i] = [];
        for (var j = 0; j < numCols; j++) {
            grid[i][j] = false;
            gridColour[i][j] = null;
        }
    }

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

    function mouseClick() {
        console.log(mouse);
        console.log(getFocusedGridSquare());
        var selectedCell = getFocusedGridSquare();
        if (selectedCell) {
            var row = selectedCell.row;
            var col = selectedCell.col;
            grid[row][col] = !grid[row][col];
        }
    }

    var update = function() {
        var selectedCell = mouseHoverUpdate();
        drawGrid(selectedCell);
    };

    function animationLoop() {
        requestAnimFrame(animationLoop);
        update();
    }

    // Setup
    drawGrid(null);
    animationLoop();

}

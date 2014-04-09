var Options = require('options');
var Game = require('./lib/Game');
var TileTypes = require('./lib/TileTypes');
var GameOptions = require('./lib/GameOptions');

var escapeString = '\u001B';
var screenBuffer = {
    statusArea: {
        top: 1,
        left: 1,
        bottom: process.stdout.rows - 4,
        right: 20,
        buffer: []
    },
    mapArea: {
        top: 1,
        left: 22,
        right: process.stdout.columns - 1,
        bottom: process.stdout.rows - 4,
        buffer: []
    },
    messageArea: {
        top: process.stdout.rows - 2,
        left: 1,
        right: process.stdout.columns - 1,
        buffer: []
    },
    toPrint: ''
}

function getPrintable(tile) {
    var retString = ' ';
    if (tile.tileType === TileTypes.WALL) {
        retString = '#';
    } else if (tile.tileType === TileTypes.FLOOR) {
        retString = '.';
    }
    return {
        string: retString,
        color: GameOptions.ColorCodes.Default
    };
}

function clearScreen() {
    process.stdout.write(escapeString + '[2J');
    // TODO: make 24 configurable
    var bottom = process.stdout.rows > 24 ? 24 : process.stdout.rows;
    // TODO: make 4 configurable
    screenBuffer.statusArea.buffer = [];
    screenBuffer.statusArea.bottom = bottom;
    // TODO: make 30 configurable
    screenBuffer.statusArea.right = 30;
    screenBuffer.mapArea.buffer = [];
    // TODO: make 32 configurable
    screenBuffer.mapArea.left = 32;
    screenBuffer.mapArea.bottom = bottom;
    // TODO: make 80 configurable
    screenBuffer.mapArea.right = process.stdout.columns > 80 
                                        ? 80 
                                        : process.stdout.columns;

    screenBuffer.messageArea.buffer = [];
    screenBuffer.messageArea.top = bottom + 2;
    screenBuffer.messageArea.right = process.stdout.columns > 80 
                                        ? 80 
                                        : process.stdout.columns;
}

function drawString(options) {
    options = new Options({
        x: 1,
        y: 1,
        str: '',
        color: GameOptions.ColorCodes.Default
    }).merge(options);
    var outputString = escapeString + '[' + options.value.y + ';' + options.value.x + 'H';
    outputString += escapeString + options.value.color;
    outputString += options.value.str;
    screenBuffer.toPrint += outputString;
    //process.stdout.write(outputString);
}

function flushScreenBuffer() {
    process.stdout.write(screenBuffer.toPrint);
    screenBuffer.toPrint = '';
}

function updateStatusArea() {
    drawString({y:1, x:1, str:'Gnasher'});
    drawString({y:2, x:1, str:'Knight Templar'});
    drawString({y:3, x:4, str:Array(11).join('\u00bb'), color:GameOptions.ColorCodes.BrightGreen});
    drawString({y:4, x:4, str:'30/30', color:GameOptions.ColorCodes.Green});
    drawString({y:6, x:4, str:Array(11).join('\u00bb'), color:GameOptions.ColorCodes.BrightBlue});
    drawString({y:7, x:4, str:'10/10', color:GameOptions.ColorCodes.Blue});
    for (var i = 1; i <= screenBuffer.statusArea.bottom; i++) {
        drawString({y:i, x:screenBuffer.statusArea.right + 1, str:'\u2502', color:GameOptions.ColorCodes.Gray});
    }
    flushScreenBuffer();
}

function updateMapArea() {
    var playerX = screenBuffer.mapArea.left + 
        Math.floor((screenBuffer.mapArea.right - screenBuffer.mapArea.left) / 2);
    var playerY = screenBuffer.mapArea.top +
        Math.floor((screenBuffer.mapArea.bottom - screenBuffer.mapArea.top) / 2);

    for(var x = screenBuffer.mapArea.left; x <= screenBuffer.mapArea.right; x++) {
        for(var y = screenBuffer.mapArea.top; y <= screenBuffer.mapArea.bottom; y++) {
            var tile = game.getTile((playerY - y),-1*(playerX - x));
            var printable = getPrintable(tile);

            if(typeof screenBuffer.mapArea.buffer[y] === 'undefined') {
                screenBuffer.mapArea.buffer[y] = [];
            }

            if(typeof screenBuffer.mapArea.buffer[y][x] === 'undefined') {
                screenBuffer.mapArea.buffer[y][x] = {
                    string:'', 
                    color:GameOptions.ColorCodes.Default
                };
            }
                
            if (screenBuffer.mapArea.buffer[y][x].string !== printable.string
                || screenBuffer.mapArea.buffer[y][x].color !== printable.color) {
                screenBuffer.mapArea.buffer[y][x] = {
                    string:printable.string, 
                    color:printable.color
                };
                drawString({y:y, x:x, str:printable.string, color:printable.color});
            }
        }
    }

    drawString({
        x:playerX, 
        y:playerY, 
        str:'@', 
        color:GameOptions.ColorCodes[GameOptions.Colors.Player]
    });
    drawString({
        x: 1,
        y: 30,
        str:'('+game.playerLocation.x+', '+game.playerLocation.y + ')    '
    });
    /*
    drawString({
        x:playerX+1, 
        y:playerY, 
        str:'r', 
        color:GameOptions.ColorCodes.BrightWhite
    });
    */
    
    flushScreenBuffer();
}

function updateMessageArea() {
    for(var i = screenBuffer.messageArea.left; i <= screenBuffer.messageArea.right; i++) {
        drawString({
            y: screenBuffer.messageArea.top -1,
            x: i,
            str: '\u2500',
            color: GameOptions.ColorCodes.Gray
        });
    }

    // add tee to join lines between status and message areas
    drawString({
        y: screenBuffer.statusArea.bottom + 1,
        x: screenBuffer.statusArea.right + 1,
        str: '\u2534',
        color:GameOptions.ColorCodes.Gray
    });

    flushScreenBuffer();
    /*
    drawString({y:20, x:1, str:'You hit the rat!', color:GameOptions.ColorCodes.BrightRed});
    drawString({y:21, x:1, str:'The rat bites you!', color:GameOptions.ColorCodes.Red});
    drawString({y:22, x:1, str:'You found a short sword', color:GameOptions.ColorCodes.White});
    */
}

function redrawScreen() {
   clearScreen();
   updateScreen();
}

function updateScreen() {
   updateStatusArea();
   updateMapArea();
   updateMessageArea();
}

function handleInput(character) {
    try {
        switch(character.toString()) {
            case GameOptions.Keybindings.Quit:
                var quitMessage = escapeString + '[2J';
                quitMessage += escapeString + '[H';
                quitMessage += escapeString + GameOptions.ColorCodes.Default;
                quitMessage += escapeString + '[?25h';
                quitMessage += 'Thanks for playing!';
                console.log(quitMessage);
                process.exit(0);
                break;
            case GameOptions.Keybindings.MoveDown:
                game.moveDown();
                break;
            case GameOptions.Keybindings.MoveUp:
                game.moveUp();
                break;
            case GameOptions.Keybindings.MoveLeft:
                game.moveLeft();
                break;
            case GameOptions.Keybindings.MoveRight:
                game.moveRight();
                break;
        }
    } catch (err) {
        var cleanupMsg = escapeString + '[2J';
        cleanupMsg += escapeString + '[H';
        cleanupMessage += escapeString + GameOptions.ColorCodes.Default;
        cleanupMessage += escapeString + '[?25h';
        console.log(cleanupMsg);
        console.log(err);
    }
}

process.stdout.write('\033[?25l');
var game = new Game();
game.on('map_updated', updateMapArea);

process.stdin.setRawMode(true);

redrawScreen();

process.stdout.on('resize', redrawScreen);

process.stdin.on('data', handleInput);

var util = require('util');
var events = require('events');
var Options = require('options');
var Tile = require('./Tile');
var TileTypes = require('./TileTypes');

function Map() {
    this.tileMap = [];
}

// inherits has to happen before any other prototyping
util.inherits(Map, events.EventEmitter);

Map.prototype.generateMap = function(options) {
    options = new Options({
        height: 5,
        width: 5,
        player: null
    }).merge(options);
    for (var i = 0; i < options.value.height; i++) {
        var rowArray = [];
        for (var j = 0; j < options.value.width; j++) {
            if (i == 0 || j == 0 
                || i == options.value.height-1 || j == options.value.width-1)
            {
                rowArray.push(new Tile({tileType: TileTypes.WALL}));
            } else {
                rowArray.push(new Tile());
            }
        }
        this.tileMap.push(rowArray);
    }
}

Map.prototype.getTile = function(y, x) {
    if (x < 0 || y < 0 || y >= this.tileMap.length || x >= this.tileMap[0].length) {
        return new Tile({tileType: TileTypes.UNKNOWN});
    }
    return this.tileMap[y][x];
}



module.exports = Map;

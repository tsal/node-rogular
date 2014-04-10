var util = require('util');
var events = require('events');
var Tile = require('./Tile');
var TileTypes = require('./TileTypes');

function Map() {
    this.tileMap = [];
}

// inherits has to happen before any other prototyping
util.inherits(Map, events.EventEmitter);

Map.prototype.generateMap = function(y, x) {
    for (var i = 0; i < y; i++) {
        var rowArray = [];
        for (var j = 0; j < x; j++) {
            if (i == 0 || j == 0 || i == y-1 || j == x-1){
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

var util = require('util');
var events = require('events');

var Map = require('./Map');
var TileTypes = require('./TileTypes');

function Game() {
    var self = this;
    this.map = new Map();
    this.map.generateMap(40, 35);
    this.playerLocation = {x: 1, y: 1};

    process.nextTick(function() {
        self.emit('map_updated');
    });
};

// inherits has to happen before any other prototyping
util.inherits(Game, events.EventEmitter);

Game.prototype.save = function() {
}

Game.prototype.isTilePassable = function(tile) {
    return tile.tileType === TileTypes.FLOOR;
}

Game.prototype.moveLeft = function() {
    var newLoc = this.playerLocation.x - 1;
    if (this.isTilePassable(this.map.getTile(this.playerLocation.y, newLoc))) {
        this.playerLocation.x = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.moveRight = function() {
    var newLoc = this.playerLocation.x + 1;
    if (this.isTilePassable(this.map.getTile(this.playerLocation.y, newLoc))) {
        this.playerLocation.x = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.moveUp = function() {
    var newLoc = this.playerLocation.y + 1;
    if (this.isTilePassable(this.map.getTile(newLoc, this.playerLocation.x))) {
        this.playerLocation.y = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.moveDown = function() {
    var newLoc = this.playerLocation.y - 1;
    if (this.isTilePassable(this.map.getTile(newLoc, this.playerLocation.x))) {
        this.playerLocation.y = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.getTile = function(yOffset, xOffset) {
    return this.map.getTile(this.playerLocation.y + yOffset, this.playerLocation.x + xOffset);
}

module.exports = Game;


var util = require('util');
var events = require('events');

var Map = require('./Map');

function Game() {
    this.map = new Map();
    this.map.generateMap(15, 15);
    this.playerLocation = {x: 1, y: 1};

    this.emit('map_updated');
};

// inherits has to happen before any other prototyping
util.inherits(Game, events.EventEmitter);

Game.prototype.save = function() {
}

Game.prototype.moveLeft = function() {
    var newLoc = this.playerLocation.x - 1;
    if (this.map.isPassable(this.playerLocation.y, newLoc)){
        this.playerLocation.x = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.moveRight = function() {
    var newLoc = this.playerLocation.x + 1;
    if (this.map.isPassable(this.playerLocation.y, newLoc)){
        this.playerLocation.x = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.moveUp = function() {
    var newLoc = this.playerLocation.y + 1;
    if (this.map.isPassable(newLoc, this.playerLocation.x)) {
        this.playerLocation.y = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.moveDown = function() {
    var newLoc = this.playerLocation.y - 1;
    if (this.map.isPassable(newLoc, this.playerLocation.x)) {
        this.playerLocation.y = newLoc;
        this.emit('map_updated');
    }
}

Game.prototype.getTile = function(yOffset, xOffset) {
    return this.map.getTile(this.playerLocation.y + yOffset, this.playerLocation.x + xOffset);
}

module.exports = Game;


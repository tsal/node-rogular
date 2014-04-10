var util = require('util');
var events = require('events');

var Map = require('./Map');
var TileTypes = require('./TileTypes');
var generateEntity = require('./EntityGenerator').generateEntity;

function Game() {
    this.playerLocation = {x: 1, y: 1};
};

// inherits has to happen before any other prototyping
util.inherits(Game, events.EventEmitter);

Game.prototype.start = function() {
    this.map = new Map();
    this.map.generateMap(40, 35);
    this.entities = [];
    this.generateEntities();

    var self = this;
    process.nextTick(function() {
        self.emit('map_updated');
    });
}

Game.prototype.save = function() {
}

Game.prototype.generateEntities = function() { 
    var newEntity = generateEntity();
    var randomY = Math.floor(Math.random() * this.map.tileMap.length);
    var randomX = Math.floor(Math.random() * this.map.tileMap[0].length);
    var tile = this.map.getTile(randomY, randomX);
    while (tile.tileType !== TileTypes.FLOOR) {
        randomY = Math.floor(Math.random() * this.map.tileMap.length);
        randomX = Math.floor(Math.random() * this.map.tileMap[0].length);
        tile = this.map.getTile(randomY, randomX);
    }
    tile.entity = newEntity;
    this.entities.push(newEntity);
}

Game.prototype.isTilePassable = function(tile) {
    return tile.tileType === TileTypes.FLOOR;
}

Game.prototype.moveLeft = function() {
    var newLoc = this.playerLocation.x - 1;
    var newTile = this.map.getTile(this.playerLocation.y, newLoc);
    if (newTile.entity !== null) {
        doCombat();
        var self = this;
//        process.nextTick(function() {
            self.emit('combat_result');
//        });
    }
    else if (this.isTilePassable(newTile)) {
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

function doCombat() {
}

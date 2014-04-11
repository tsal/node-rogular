var util = require('util');
var events = require('events');

var Map = require('./Map');
var TileTypes = require('./TileTypes');
var EntityTypes = require('./EntityTypes');
var ActionCosts = require('./ActionCosts');
var generateEntity = require('./EntityGenerator').generateEntity;

function Game() {
    this.playerLocation = {x: 1, y: 1};
    // Turncounter will be divided by 10 to get actual turns
    this.turnCounter = 100;
    this.player = generateEntity({type:EntityTypes.Human});
    this.player.actionPoints = 100;
};

// inherits has to happen before any other prototyping
util.inherits(Game, events.EventEmitter);

Game.prototype.start = function() {
    this.map = new Map();
    this.map.generateMap({
        height: 40, 
        width: 35,
        player: this.player
    });
    this.generateEntities();

    var self = this;
    process.nextTick(function() {
        self.emit('map_updated');
    });
}

Game.prototype.save = function() {
}

Game.prototype.generateEntities = function() { 
    var resultList = [];
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
    newEntity.tile = tile;
    resultList.push(newEntity);
    return resultList;
}

Game.prototype.removeEntity = function(entity) {
    entity.tile.entity = null;
}

Game.prototype.isTilePassable = function(tile) {
    return tile.tileType === TileTypes.FLOOR;
}

Game.prototype.moveLeft = function() {
    moveInto(this, 0, -1);
}

Game.prototype.moveRight = function() {
    moveInto(this, 0, 1);
}

Game.prototype.moveUp = function() {
    moveInto(this, 1, 0);
}

Game.prototype.moveDown = function() {
    moveInto(this, -1, 0);
}

Game.prototype.getTile = function(yOffset, xOffset) {
    return this.map.getTile(this.playerLocation.y + yOffset, this.playerLocation.x + xOffset);
}

Game.prototype.getAttackChanceAndDamage = function(entity) {
    // do fancy calculations here
    return {
        chance: 1.0,
        damage: 3
    }
}

Game.prototype.getDefenseChance = function(entitiy) {
    // do fancy calculations here
    return {
        missChance: 0.1,
        armor: 10,
        damageReduction: 0
    };
}

Game.prototype.doCombat = function(attacker, defender) {
    var self = this;
    var attackInfo = this.getAttackChanceAndDamage(attacker);
    var defenseInfo = this.getDefenseChance(defender);
    // TODO: work out exact combat mechanics
    var didHit = true; // (attackInfo.chance * Math.random()) < defenseInfo.missChance;
    var attackerName = attacker === this.player ? 'You' : attacker.name;
    var defenderName = defender === this.player ? 'you' : defender.name;
    var message = '%s %s %s';
    if (didHit) {
        defender.hp -= attackInfo.damage;
        message = util.format(message, attackerName, 'hit', defenderName);
        if (defender.hp <= 0) {
            if (defender === this.player) {
                // TODO: Game over logic
            } else {
                this.removeEntity(defender);
                // TODO: experience points and such
                message += util.format(' You killed %s', defenderName);
            }
        }
    } else {
        message = util.format(message, attackerName, 'missed', defenderName);
    }
        
    process.nextTick(function() {
        self.emit('message', message);
    });
}

module.exports = Game;

function moveInto(game, yOffset, xOffset) {
    var newLoc = { 
        y: game.playerLocation.y + yOffset,
        x: game.playerLocation.x + xOffset
    }
    var newTile = game.map.getTile(newLoc.y, newLoc.x);
    if (newTile.entity !== null) {
        var result = game.doCombat(game.player, newTile.entity);
    }
    else if (game.isTilePassable(newTile)) {
        game.playerLocation = newLoc;
    }
    process.nextTick(function() {
        game.emit('map_updated');
    });
}


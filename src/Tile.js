var util = require('util');
var events = require('events');
var Options = require('options');
var TileTypes = require('./TileTypes');

var Tile = function(options) {
    options = new Options({
        tileType: TileTypes.FLOOR,
        entity: null,
        items: []
    }).merge(options);

    this.tileType = options.value.tileType;
    this.entity = options.value.entity;
    this.items = options.value.items;
}

// inherits has to happen before any other prototyping
util.inherits(Tile, events.EventEmitter);

module.exports = Tile;

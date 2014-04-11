var assert = require('chai').assert;
var sinon = require('sinon');
var Map = require('../lib/Map');
var Tile = require('../lib/Tile');
var TileTypes = require('../lib/TileTypes');

suite('Map', function() {
    var map;
    setup(function() {
        map = new Map();
    });

    suite('#generateMap(options)', function() {
        test('generates a properly sized map', function() {
            map.generateMap({height: 15, width: 15});
            assert.equal(15, map.tileMap.length);
            assert.equal(15, map.tileMap[0].length);
        });
    });
    suite('#getTile(y, x)', function() {
        test('gets the valid tile requested', function() {
            map.generateMap({height: 15, width: 15});
            var tile = map.getTile(7, 7);
            assert.equal(tile, map.tileMap[7][7]);
        });
        test('returns TileType.UNKNOWN for invalid request', function() {
            map.generateMap({height: 15, width: 15});
            var tile = map.getTile(100, 100);
            assert.equal(tile.tileType, TileTypes.UNKNOWN);
        });
    });
});

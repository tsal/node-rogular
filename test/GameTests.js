var assert = require('chai').assert;
var sinon = require('sinon');
var Game = require('../lib/Game');
var Tile = require('../lib/Tile');
var TileTypes = require('../lib/TileTypes');

suite('Game', function() {
    var game;
    setup(function() {
        // Create a 3x3 "map" with all floor tiles, and place
        // player in the center (map is 0-based)
        game = new Game(); 
        game.map.tileMap = [];
        for (var i = 0; i < 3; i++) {
            var thisRow = [];
            for (var j = 0; j < 3; j++) {
                thisRow.push(new Tile({tileType:TileTypes.FLOOR}));
            }
            game.map.tileMap.push(thisRow);
        }

        game.playerLocation = {x:1, y:1};
    });

    suite('#moveLeft()', function() {
        test('should move player and emit map_updated when tile is passable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerX = game.playerLocation.x;
            game.moveLeft();
            assert.equal(game.playerLocation.x, (playerX - 1));
            sinon.assert.calledOnce(spy);
        });
        test('should not move player or emit map_updated when tile is impassable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerX = game.playerLocation.x;
            game.map.tileMap[game.playerLocation.y][game.playerLocation.x - 1] =
                    new Tile({tileType:TileTypes.WALL});
            game.moveLeft();
            assert.equal(game.playerLocation.x, playerX);
            sinon.assert.notCalled(spy);
        });
    });
    suite('#moveRight()', function() {
        test('should move player and emit map_updated when tile is passable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerX = game.playerLocation.x;
            game.moveRight();
            assert.equal(game.playerLocation.x, (playerX + 1));
            sinon.assert.calledOnce(spy);
        });
        test('should not move player or emit map_updated when tile is impassable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerX = game.playerLocation.x;
            game.map.tileMap[game.playerLocation.y][game.playerLocation.x + 1] =
                    new Tile({tileType:TileTypes.WALL});
            game.moveRight();
            assert.equal(game.playerLocation.x, playerX);
            sinon.assert.notCalled(spy);
        });
    });
    suite('#moveUp()', function() {
        test('should move player and emit map_updated when tile is passable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerY = game.playerLocation.y;
            game.moveUp();
            assert.equal(game.playerLocation.y, (playerY + 1));
            sinon.assert.calledOnce(spy);
        });
        test('should not move player or emit map_updated when tile is impassable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerY = game.playerLocation.y;
            game.map.tileMap[game.playerLocation.y + 1][game.playerLocation.x] =
                    new Tile({tileType:TileTypes.WALL});
            game.moveUp();
            assert.equal(game.playerLocation.y, playerY);
            sinon.assert.notCalled(spy);
        });
    });
    suite('#moveDown()', function() {
        test('should move player and emit map_updated when tile is passable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerY = game.playerLocation.y;
            game.moveDown();
            assert.equal(game.playerLocation.y, (playerY - 1));
            sinon.assert.calledOnce(spy);
        });
        test('should not move player or emit map_updated when tile is impassable', function() {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerY = game.playerLocation.y;
            game.map.tileMap[game.playerLocation.y - 1][game.playerLocation.x] =
                    new Tile({tileType:TileTypes.WALL});
            game.moveDown();
            assert.equal(game.playerLocation.y, playerY);
            sinon.assert.notCalled(spy);
        });
    });
    suite('#getTile(yOffset, xOffset)', function() {
        test('should return valid tile requiested', function() {
            var tile = game.getTile(1, 1);
            assert.equal(tile, game.map.tileMap[game.playerLocation.y + 1][game.playerLocation.x + 1]);
        });
        test('should return UNKNOWN tile if invalid tile requested', function() {
            var tile = game.getTile(-15, -32);
            assert.equal(tile.tileType, TileTypes.UNKNOWN);
        });
    });
    suite('#isTilePassable(tile)', function(){
        test('TileTypes.FLOOR should be passable', function() {
            assert.isTrue(game.isTilePassable(new Tile({tileType: TileTypes.FLOOR})));
        });
        test('TileTypes.WALL should be impassable', function() {
            assert.isFalse(game.isTilePassable(new Tile({tileType: TileTypes.WALL})));
        });
    });
});

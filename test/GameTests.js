var assert = require('chai').assert;
var sinon = require('sinon');
var Game = require('../lib/Game');
var Tile = require('../lib/Tile');
var TileTypes = require('../lib/TileTypes');
var generateEntity = require('../lib/EntityGenerator').generateEntity;

suite('Game', function() {
    var game;
    setup(function() {
        // Create a 3x3 "map" with all floor tiles, and place
        // player in the center (map is 0-based)
        game = new Game(); 
        game.start();
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
        test('should move player and emit map_updated when tile is passable',
             function(done)
        {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerX = game.playerLocation.x;
            game.moveLeft();
            assert.equal(game.playerLocation.x, (playerX - 1));
            process.nextTick(function() {
                sinon.assert.calledOnce(spy);
            });
            done();
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
        test('should attack target when moving into occupied tile', function(done) {
            var spy = sinon.spy();
            game.on('message', spy);
            var enemyTile = game.getTile(0, -1);
            enemyTile.entity = generateEntity();
            game.moveLeft();
            process.nextTick(function() {
                sinon.assert.called(spy);
            });
            done();
        });
    });
    suite('#moveRight()', function() {
        test('should move player and emit map_updated when tile is passable',
             function(done)
        {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerX = game.playerLocation.x;
            game.moveRight();
            assert.equal(game.playerLocation.x, (playerX + 1));
            process.nextTick(function() {
                sinon.assert.calledOnce(spy);
            });
            done();
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
        test('should attack target when moving into occupied tile', function(done) {
            var spy = sinon.spy();
            game.on('message', spy);
            var enemyTile = game.getTile(0, 1);
            enemyTile.entity = generateEntity();
            game.moveRight();
            process.nextTick(function() {
                sinon.assert.called(spy);
            });
            done();
        });
    });
    suite('#moveUp()', function() {
        test('should move player and emit map_updated when tile is passable', 
             function(done) 
        {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerY = game.playerLocation.y;
            game.moveUp();
            assert.equal(game.playerLocation.y, (playerY + 1));
            process.nextTick(function() {
                sinon.assert.calledOnce(spy);
            });
            done();
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
        test('should attack target when moving into occupied tile', function(done) {
            var spy = sinon.spy();
            game.on('message', spy);
            var enemyTile = game.getTile(1, 0);
            enemyTile.entity = generateEntity();
            game.moveUp();
            process.nextTick(function() {
                sinon.assert.called(spy);
            });
            done();
        });
    });
    suite('#moveDown()', function() {
        test('should move player and emit map_updated when tile is passable', 
             function(done) 
        {
            var spy = sinon.spy();
            game.on('map_updated', spy);
            var playerY = game.playerLocation.y;
            game.moveDown();
            assert.equal(game.playerLocation.y, (playerY - 1));
            process.nextTick(function() {
                sinon.assert.calledOnce(spy);
            });
            done();
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
        test('should attack target when moving into occupied tile', function(done) {
            var spy = sinon.spy();
            game.on('message', spy);
            var enemyTile = game.getTile(-1, 0);
            enemyTile.entity = generateEntity();
            game.moveDown();
            process.nextTick(function() {
                sinon.assert.called(spy);
            });
            done();
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
    suite('#generateEntities()', function() {
        test('at least one entity is generated', function() {
            var entities = game.generateEntities();
            assert(entities.length > 0, 'no entities generated');
        });
        test('entity is added to map', function() {
            game.generateEntities();
            var found = false;
            for (var y = 0;y < game.map.tileMap.length; y++) {
                for (var x = 0;x < game.map.tileMap[y].length; x++) {
                    if (game.map.tileMap[y][x].entity !== null) {
                        found = true;
                        break;
                    }
                }
                if(found) break;
            }
            assert(found, 'entity not found');
        });
    });
    suite('#removeEntity(entityEntry)', function() {
        test('entity is removed from list and map', function() {
            var entityList = game.generateEntities();
            var entity = entityList[0];
            var entityListLength = entityList.length;
            game.removeEntity(entity);
            var found = false;
            for (var y = 0;y < game.map.tileMap.length; y++) {
                for (var x = 0;x < game.map.tileMap[y].length; x++) {
                    if (game.map.tileMap[y][x].entity === entity) {
                        found = true;
                        break;
                    }
                }
                if(found) break;
            }
            assert(!found, 'entity was found on map');
        });
    });
    suite('#getAttackChanceAndDamage(entity)', function() {
        test('returns valid values', function() {
            var result = game.getAttackChanceAndDamage(game.player);
            assert.property(result, 'chance');
            assert.property(result, 'damage');
        });
    });
    suite('#getDefenseChance(entity)', function() {
        test('returns valid values', function() {
            var result = game.getDefenseChance(game.player);
            assert.property(result, 'missChance');
            assert.property(result, 'armor');
            assert.property(result, 'damageReduction');
        });
    });
    suite('#doCombat(attacker, defender)', function() {
        test('emits message event with message', function(done) {
            var spy = sinon.spy();
            game.on('message', spy);
            game.doCombat(game.player, generateEntity());
            process.nextTick(function() {
                sinon.assert.calledWith(spy, sinon.match.string);
            });
            done();
        });
    });
});

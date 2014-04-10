var assert = require('chai').assert;
var sinon = require('sinon');
var generateEntity = require('../lib/EntityGenerator').generateEntity;
var EntityTypes = require('../lib/EntityTypes');

suite('EntityGenerator', function() {
    suite('#generateEntity(options)', function() {
        test('has sane defaults', function() {
            var entity = generateEntity();
            assert.isDefined(entity);
            assert.equal(entity.type, EntityTypes.Natural);
            assert.equal(entity.hp, EntityTypes.Natural.baseHP);
        });
        test('generates higher level entity', function() {
            var entity = generateEntity({level:5});
            assert.isDefined(entity);
            assert(entity.hp > 25);
        });
    });
});

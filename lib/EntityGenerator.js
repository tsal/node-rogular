var Options = require('options');
var EntityTypes = require('./EntityTypes');

function levelUp(entityType, level) {
    var hp = entityType.baseHP;
    for(var i = 1; i < level; i++){
        var randomVal = Math.random();
        randomVal = randomVal < 0.5 ? randomVal + 0.5 : randomVal;
        hp += Math.ceil(entityType.baseHP * randomVal);
    }
    return {
        hp: hp
    };
}

module.exports.generateEntity = function(options) {
    options = new Options({
        type: EntityTypes.Natural,
        level: 1
    }).merge(options);
    var levelUpStats = levelUp(options.value.type, options.value.level);
    return {
        type: options.value.type,
        hp: levelUpStats.hp
    };
};


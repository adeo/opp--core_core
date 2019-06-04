const { Module, __kill__ } = require('./../../../src');
const { kill } = require('./../../fakes');

class SubTest3 extends Module {

    [__kill__]() {
        kill.subTest3Cb();
    }

}

module.exports = SubTest3;
const { Module, __init__, __kill__ } = require('./../../../src');
const { init, kill } = require('./../../fakes');

class SubTest1 extends Module {

    [__init__]() {
        init.subTest1Cb();
    }

    [__kill__]() {
        kill.subTest1Cb();
    }

}

module.exports = SubTest1;
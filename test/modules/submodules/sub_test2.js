const { Module, __init__ } = require('./../../../src');
const { init } = require('./../../fakes');

class SubTest2 extends Module {

    [__init__]() {
        init.subTest2Cb();
    }

}

module.exports = SubTest2;
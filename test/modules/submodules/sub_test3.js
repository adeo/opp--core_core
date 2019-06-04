const { Module, __kill__ } = require('./../../../src');

class SubTest3 extends Module {

    [__kill__]() {

    }

}

module.exports = SubTest3;
const { Module } = require('./../../src');
const SubTest2 = require('./submodules/sub_test2');
const SubTest3 = require('./submodules/sub_test3');

class Test2 extends Module {

    constructor(...args) {
        super(...args);
        this.subTest2 = new SubTest2();
        this.subTest3 = new SubTest3();
    }

}

module.exports = Test2;
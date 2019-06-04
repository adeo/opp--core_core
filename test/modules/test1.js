const { Module } = require('./../../src');
const SubTest1 = require('./submodules/sub_test1');
const SubTest2 = require('./submodules/sub_test2');

class Test1 extends Module {

    constructor(...args) {
        super(...args);
        this.subTest1 = new SubTest1();
        this.subTest2 = new SubTest2();
    }

}

module.exports = Test1;
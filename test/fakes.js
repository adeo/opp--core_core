const sinon = require('sinon');

module.exports.init            = {};
module.exports.init.subTest1Cb = sinon.fake();
module.exports.init.subTest2Cb = sinon.fake();

module.exports.kill            = {};
module.exports.kill.subTest1Cb = sinon.fake();
module.exports.kill.subTest3Cb = sinon.fake();
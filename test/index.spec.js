const { assert }         = require('chai');
const { core, __conf__ } = require('../src');
const Test1              = require('./modules/test1');
const Test2              = require('./modules/test2');
const Module             = require('./module');

describe('core', function() {

    let root;
    const appName = 'app';

    before(async () => {
        await core
            .name(appName)
            .use(
                Test1,
                Test2,
            )
            .run();
        root = await Module.$run();
    });

    it('core v1', () => {
        console.log(core.$test1[__conf__]);
    });

    it('core v2', () => {
        console.log(root.$conf('test'));
        console.log(root.subA.$conf('test'));
    });

    after(async () => {
        process.kill(process.pid, 'SIGINT');
    });

});
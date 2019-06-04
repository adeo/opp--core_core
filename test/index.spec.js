const { assert }         = require('chai');
const { core, __conf__ } = require('./../src');
const Test1              = require('./modules/test1');
const Test2              = require('./modules/test2');

describe('core', function () {

    const appName = 'app';

    before(async () => {
        await core
                .name(appName)
                .use(
                    Test1,
                    Test2,
                )
                .run();
    });

    it('init', () => {
        console.log(core.$test1[__conf__]);
    });

    after(async () => {
        process.kill(process.pid, 'SIGINT');
    });

});
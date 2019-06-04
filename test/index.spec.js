const { assert }         = require('chai');
const env                = require('@core/env');
const { core, __conf__ } = require('./../src');
const { init, kill }     = require('./fakes');
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
        assert.equal(init.subTest1Cb.callCount, 1);
        assert.equal(init.subTest2Cb.callCount, 2);
    });

    it('conf', () => {
        assert.deepEqual(env.test1, core.$test1[__conf__]);
    });

    it('kill', done => {
        process.kill(process.pid, 'SIGINT');
        setImmediate(() => {
            assert(kill.subTest1Cb.calledOnce);
            assert(kill.subTest3Cb.calledOnce);
            done();
        });
    });

});
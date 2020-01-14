const { __name__, __reg__, __init__, __updt__, __kill__, __state__, __parents__ } = require('./interfaces');
const _ = require('lodash');

class Base {

    method = null;
    color  = 'green';
    action = '';

    constructor(method) {
        this.method = method;
    }

    check(object) {
        if (!object)
            return false;
        if (!object.constructor)
            return false;
        if (!object.constructor[__name__])
            return false;
        if (!_.has(object, [__state__, this.method]))
            _.set(object, [__state__, this.method], false);
        if (object[__state__][this.method])
            return false;
        object[__state__][this.method] = true;
        return true;
    }

    info(object, time = 0) {
        console.info(`Module [${object[__name__]}] ${this.action} at %ims`, Date.now() - time);
    }

    async process(object) {
        let time;
        if (!this.check(object))
            return;
        if (this.method in object) {
            time = Date.now();
            await object[this.method]();
            this.info(object, time);
        }
    }

}

class Reg extends Base {

    color  = 'gray';
    action = 'registered';

    async process(object, parent) {
        let time;
        if (!object)
            return false;
        if (!object.constructor)
            return false;
        if (!object.constructor[__name__])
            return false;
        if (!(__parents__ in object))
            object[__parents__] = new Set();
        if (parent)
            object[__parents__].add(parent);
        if (!this.check(object))
            return;
        time = Date.now();
        for (let field in object)
            if (typeof object[field] === 'function' && __name__ in object[field])
                object[field] = new object[field]();
        if (this.method in object)
            await object[this.method]();
        this.info(object, time);
    }

}

class Init extends Base {

    color  = 'green';
    action = 'inited';

}

class Updt extends Base {

    color  = 'cyan';
    action = 'updated';

    async process(object, parent, uid, ...args) {
        let time;
        if (!(this.method in object))
            return;
        if (_.get(object, [__state__, this.method]) === uid)
            return;
        time = Date.now();
        _.set(object, [__state__, this.method], uid);
        await object[this.method](...args);
        this.info(object, time);
    }

}

class Kill extends Base {

    color  = 'red';
    action = 'killed';

}

module.exports = class State {
    [__reg__]  = new Reg(__reg__);
    [__init__] = new Init(__init__);
    [__updt__] = new Updt(__updt__);
    [__kill__] = new Kill(__kill__);
}
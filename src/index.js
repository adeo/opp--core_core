const util = require('util');
const _ = require('lodash');
const env = require('@core/env');
const { Item } = require('@core/library');
const { CoreError } = require('./errors');

const __init__ = Symbol.for('__init__');
const __kill__ = Symbol.for('__kill__');
const __deps__ = Symbol.for('__deps__');
const __name__ = Symbol.for('__name__');
const __conf__ = Symbol.for('__conf__');
const __core__ = Symbol.for('__core__');

const _coreInited = Symbol.for('_coreInited');
const _use        = Symbol('_use');
const _kill       = Symbol('_kill');
const _walk       = Symbol('_walk');
const _version    = require('./../package').version;

if (global[_coreInited])
    throw new CoreError.VersionConflict(global[_coreInited], _version);
global[_coreInited] = _version;

class Module extends Item {

    static get [__name__]() {
        return _.lowerFirst(this.name);
    }

    get [__conf__]() {
        return env[this.constructor[__name__]];
    }

}

class Core {

    constructor() {
        process.on('SIGINT',  () => this[_kill]());
        process.on('SIGTERM', () => this[_kill]());
        process.on('uncaughtException',  e => console.error(e) || process.kill(process.pid, 'SIGINT'));
        process.on('unhandledRejection', e => console.error(e) || process.kill(process.pid, 'SIGINT'));
    }

    use(...classes) {
        for (let Class of classes)
            this[_use](Class);
        return this;
    }

    name(name) {
        Object.defineProperty(this, 'name', { value: name, configurable: false, writable: false, enumerable: true });
        return this;
    }

    run() {
        return this[_walk](async (modules, name, path) => {
            if (!modules[name] || !(__init__ in modules[name]))
                return;
            if (!(__core__ in modules[name]))
                modules[name][__core__] = this;
            await modules[name][__init__]();
            return `Module [${path}] inited at [%s]s`;
        });
    }

    [_use](Class) {
        let name = Class[__name__];
        if (!name)
            name = _.lowerFirst(Class.name);
        name = '$' + name;
        if (this[name])
            throw new CoreError.ModuleNameConflict(name);
        this[name] = new Class();
        this[name][__core__] = this;
        console.log(`Module [${name}] registered`); //TODO: logs
    }

    async [_kill]() {
        await this[_walk](async (modules, name, path) => {
            if (!modules[name] || !(__kill__ in modules[name]))
                return;
            try {
                await modules[name][__kill__]();
            } catch (e) {
                console.error(e);
            }
            return `Module [${path}] killed at [%s]s`;
        });
        process.exit();
    }

    async [_walk](callback = () => {}, modules = this, subname = null) {
        let time, path, msg;
        for (let name in modules) {
            path = subname ? [subname, name].join('.') : name;
            if (typeof modules[name] !== 'object')
                continue;
            if (modules[name] instanceof Module)
                await this[_walk](callback, modules[name], path);
            time = Date.now();
            msg = await callback(modules, name, path);
            if (msg)
                console.log(util.format(msg, ((Date.now() - time) / 1000).toFixed(2))); //TODO: logs
        }
    }

}

module.exports.core     = new Core();
module.exports.Module   = Module;
module.exports.__init__ = __init__;
module.exports.__kill__ = __kill__;
module.exports.__deps__ = __deps__;
module.exports.__name__ = __name__;
module.exports.__conf__ = __conf__;
module.exports.__core__ = __core__;


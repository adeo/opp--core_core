const { __name__, __reg__, __init__, __updt__, __kill__, __parents__, __singletone__ } = require('./interfaces');
const State = require('./state');
const _ = require('lodash');
const env = require('@core/env');
const { CoreError } = require('./errors');

const singletone = Class =>
    new Proxy(Class, new class {

        #instance = null;

        construct(...args) {
            if (!this.#instance) {
                this.#instance = Reflect.construct(...args);
                this.#instance[__singletone__] = true;
            }
            return this.#instance;
        }
    });

const mod = (Class = class {}) =>
    class Module extends Class {

        #state       = new State();

        static get [__name__]() {
            return _.lowerFirst(this.name);
        }

        get [__name__]() {
            if (this[__singletone__])
                return this.constructor[__name__];
            return this.$parent ? `${this.$parent[__name__]}.${this.constructor[__name__]}` : this.constructor[__name__];
        }

        static singletone() {
            return singletone(this);
        }

        static async $run() {
            let instance = new this();
            await instance.$run();
            return instance;
        }

        async $run() {
            await this.#invoke(__reg__, false);
            await this.#invoke(__init__);
            this.#onKill();
        }

        get $parents() {
            return this[__parents__];
        }

        get $parent() {
            return this[__parents__] ? [...this[__parents__]][0] : null;
        }

        get $production() {
            return process.env.NODE_ENV === 'production';
        }

        get $root() {
            let root = this;
            while (root.$parent)
                root = root.$parent;
            return root;
        }

        $conf(path, value = undefined) {
            let val, key = `${this[__name__]}${path ? '.' + path : ''}`;
            try {
                val = _.get(env, key);
            }
            catch {
                val = value;
            }
            if (val === undefined && value === undefined)
                throw new CoreError.UndefinedConfigVarable(key);
            return val;
        }

        async $update(...args) {
            await this.#invoke(__updt__, true, [Date.now(), ...args]);
        }

        #kill = async function() {
            await this.#invoke(__kill__);
            setImmediate(() => process.exit());
        };

        #onKill = function() {
            process.on('exit', () => this.#kill());
            process.on('SIGINT', () => this.#kill());
            process.on('SIGTERM', () => this.#kill());
            process.on('uncaughtException',  e => console.error(e) || process.kill(process.pid, 'SIGINT'));
            process.on('unhandledRejection', e => console.error(e) || process.kill(process.pid, 'SIGINT'));
            console.info('App started at %ss', process.uptime().toFixed(2));
        };

        #invoke = async function(method, backward = true, args = [], object = this, parent = null) {
            if (!backward)
                await this.#state[method].process(object, parent, ...args);
            for (let field in object)
                if (object[field] && typeof object[field] === 'object' && object[field] !== parent)
                    await this.#invoke(method, backward, args, object[field], object);
            if (backward)
                await this.#state[method].process(object, parent, ...args);
        };

    };

module.exports = mod;
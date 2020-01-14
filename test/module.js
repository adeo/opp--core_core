const { __init__, __kill__, __name__, __updt__, __reg__, mod } = require('../src');

class Single extends mod() {

    num = 1;

    [__init__]() {
    }

    [__updt__]() {
    }

    [__kill__]() {
    }

}
Single = Single.singletone(Single);

class Submodule extends mod() {

    num = 1;

    [__init__]() {
    }

    [__updt__]() {
    }

    [__kill__]() {
    }

}

class Module extends mod() {

    subA = Submodule;
    subB = Submodule;
    a    = Single;
    b    = Single;

    [__reg__]() {
    }

    [__init__]() {
    }

    [__updt__]() {
    }

    [__kill__]() {
    }

}

module.exports = Module;
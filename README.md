# @core/core
This is the core module for buildind node.js applications.

#### Basic usage:
imagine that we have project that contains some files:
```
./src/index.js
./src/test_module1.js
./src/test_module2.js
./.env
```

In .env file we are define settings of our application:

*.env:*
```dotenv
testModule2_someString=test
testModule2_someNumber=(number)123
```

You can define you own module, by using symbols from @core/core package. 
__\_\_init\_\___ method will be called on application initialization, __\_\_kill\_\___ 
method will be called on destructurization, __\_\_name\_\___ static getter indicates
how you module will be named to be access in __core__ object.

*test_module1.js:*
```javascript
const { __init__, __kill__, __name__ } = require('@core/core');

module.exports = class TestModule1 {
    
    static get [__name__]() {
        return `testModule1`;
    }
    
    async [__init__]() {
        console.log(`${this.constructor[__name__]} initialized!`);
    }
    
    async [__kill__]() {
        console.log(`${this.constructor[__name__]} destructed!`);
    }
    
}
```

You can reduce a code of you module by extends from __Module__ class from @core/core
package. In this case __\_\_name\_\___ static getter will return class name with the 
first letter in lower case.

*test_module2.js:*
```javascript
const { Module, __init__, __kill__, __name__, __conf__ } = require('@core/core');

module.exports = class TestModule2 extends Module {
    
    async [__init__]() {
        console.log(`${this.constructor[__name__]} initialized!`);
        console.log('config', this[__conf__]);
    }
    
    async [__kill__]() {
        console.log(`${this.constructor[__name__]} destructed!`);
    }
    
}
```

And __this\[\_\_conf\_\_\]__ will be equal json object, witch we was describe
in .env file:

```json
{
    "someString": "test",
    "someNumber": 123
}
```

*index.js:*
```javascript
const { core }    = require('@core/core');
const TestModule1 = require('./test_module1');
const TestModule2 = require('./test_module2');

core
    .use(
        TestModule1,
        TestModule2,
    )
    .run();

console.log(core.$testModule1); // class TestModule1 {}
console.log(core.$testModule2); // class TestModule2 {}
```
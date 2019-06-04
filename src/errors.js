const { factory } = require('@core/errors');

factory('Core', [
    { code: 'VersionConflict', message: 'Core version confilct [%s] vs [%s]' },
    { code: 'ModuleNameConflict', message: 'Module name conflict [%s]' },
]);

module.exports = require('@core/errors');
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery.maskedinput.core'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery.maskedinput.core'));
    } else {
        /*root.MaskedInput =*/ factory(root.MaskedInput);
    }
}(this, function (MaskedInput) {
    var module;

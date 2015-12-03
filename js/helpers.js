"use strict";
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['handlebars'], factory);
    }
    else {
        factory(root.Handlebars);
    }
}(this, function (Handlebars) {

    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('replace', function (string) {
        var newString = getId(string)/*string.replace(/ /g,'_')*/;
        return new Handlebars.SafeString(newString);
    });

    function getId(string) {
        var res = '';
        for (let i = 0, n = string.length; i < n; i++) {
            res += string.charCodeAt(i);
        }
        return (res);
    }

    return Handlebars;
}));
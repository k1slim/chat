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
        var newString = string.replace(' ','_');
        return new Handlebars.SafeString(newString);
    });

    return Handlebars;
}));
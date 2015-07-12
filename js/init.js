require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'jquery-ui': '../bower_components/jquery-ui/jquery-ui.min',
        'io': 'https://cdn.socket.io/socket.io-1.3.5',
        'handlebars': '../bower_components/handlebars/handlebars.min',
        'text': '../bower_components/requirejs-text/text',

        'chat': 'chat',
        'interactive': 'interactive'

    },
    shim: {
        'io': {
            exports: 'io'
        }
    }
});

require(['interactive', 'chat'], function(interactive, chat){

});
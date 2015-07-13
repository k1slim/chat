require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'jquery-ui': '../bower_components/jquery-ui/jquery-ui.min',
        'io': 'http://chat-k1slim.rhcloud.com:8000/socket.io/socket.io.js',
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
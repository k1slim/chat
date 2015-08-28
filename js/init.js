require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'jquery-ui': '../bower_components/jquery-ui/jquery-ui.min',
        'io': /*http://chat-k1slim.rhcloud.com/socket.io/socket.io'*/'../socket.io/socket.io',
        'handlebars': '../bower_components/handlebars/handlebars.min',
        'text': '../bower_components/requirejs-text/text',
        'titleNotifier':'../bower_components/TitleNotifier.js/title_notifier',

        'chat': 'chat',
        'interactive': 'interactive'

    },
    shim: {
        'io': {
            exports: 'io'
        },
        'titleNotifier':{
            exports:'titleNotifier'
        }
    }
});

require(['interactive', 'chat'], function(interactive, chat){

});
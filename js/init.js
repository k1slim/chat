require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'jquery-ui': '../bower_components/jquery-ui/jquery-ui.min',
        'io': '../socket.io/socket.io',
        'handlebars': '../bower_components/handlebars/handlebars.min',
        'helpers': 'helpers',
        'text': '../bower_components/requirejs-text/text',
        'titleNotifier': '../bower_components/TitleNotifier.js/dist/title_notifier.min',

        'chat': 'chat',
        'room': 'room',
        'auth': 'auth',
        'modalWindow': 'modalWindow',
        'interactive': 'interactive'

    },
    shim: {
        'io': {
            exports: 'io'
        },
        'titleNotifier': {
            exports: 'titleNotifier'
        }
    }
});

require(['interactive', 'chat', 'room', 'auth'], function (interactive, chat, room, auth) {

});
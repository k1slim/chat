"use strict";
define(['jquery', 'io', 'modalWindow', 'titleNotifier'],
    function ($, io, modalWindow) {

        class Auth {
            constructor() {
                //Parameters
                var self = this;

                this.name = '';
                this.nickPlaceholder = $(".nickField");

                this.socket = io();

                modalWindow.createModalWindow({'placeholder': 'Nickname'});

                //Listeners
                modalWindow.getOkButton().click(function () {
                    self.auth();
                });

                modalWindow.getInputField().keypress(function (e) {
                    if (e.which === 13) {
                        self.auth();
                    }
                });
            }

            auth() {
                var pattern = /([^a-zA-Zа-яА-Я0-9-_]+?)/;
                this.name = modalWindow.getData();

                if (this.name.length <= 0) {
                    modalWindow.throwError("Enter nickname");
                    return false;
                }
                if (this.name.length > 20) {
                    modalWindow.throwError("Very long nickname");
                    return false;
                }
                if (pattern.test(this.name)) {
                    modalWindow.throwError("Incorrect symbol '" + pattern.exec(this.name)[1] + "' ");
                    return false;
                }
                this.nickPlaceholder.html(this.name);
                modalWindow.deleteModalWindow();
                this.socket.emit('nick', this.name);
            }

            getName() {
                return this.name;
            }
        }

        return new Auth();
    });

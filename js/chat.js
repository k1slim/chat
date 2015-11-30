"use strict";
define(['jquery', 'io', 'handlebars', 'helpers', 'modalWindow', 'text!../template/messageTemplate.hbs', 'text!../template/systemMessageTemplate.hbs', 'titleNotifier'],
    function ($, io, handlebars, helpers, modalWindow, messageTemplate, systemMessageTemplate) {

        class Chat {
            constructor() {
                //Parameters
                this.messages = $(".messageField ul");
                this.message = $("#textField");

                this.authNick = $("#nick");
                this.nickPlaceholder = $(".nickField");
                this.error = $(".error");
                this.authWindow = $(".auth");
                this.block = $(".block");

                this.name = '';

                var self = this;

                this.socket = io();

                //Listeners
                this.socket.on('message', function (data) {
                    self.msg(data);
                });

                this.socket.on('systemMessage', function (data) {
                    self.systemMsg({message: data, time: Chat.getTime()});
                });

                modalWindow.createModalWindow({'placeholder': 'Nickname'});

                modalWindow.getOkButton().click(function () {
                    self.auth();
                });

                modalWindow.getInputField().keypress(function (e) {
                    if (e.which === 13) {
                        self.auth();
                    }
                });

                $('#sendButton').click(function () {
                    self.send();
                });

                this.messages.click(function (e) {
                    if ($(e.target).hasClass('messageNickSpan') && self.message.val() == "") {
                        self.message.val('<b>' + $(e.target).text().trim() + '</b>, ');
                    }
                });

                this.message.keypress(function (e) {
                    if (e.which === 13) {
                        self.send();
                    }
                    if (e.ctrlKey) {
                        var text = self.message.val() + '<br>';
                        self.message.val(text);
                    }
                });

                this.message.focus(function () {
                    titlenotifier.reset();
                });
            }

            send() {
                var text = Chat.msgParsing(this.message.val());
                if (text.length <= 0) {
                    return false;
                }
                this.message.val("");
                this.socket.emit("message", {message: text, name: this.name, time: Chat.getTime()});
            }

            static msgParsing(text) {
                var url = /([-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/?[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?)/gi;
                return (text.replace(url, '<a href="$1" target="_blank">$1</a>'));
            }

            msg(data) {
                var template = handlebars.compile(messageTemplate),
                    sound = $('#audio')[0];
                this.messages.append(template(data));
                $(".messageField").scrollTop(this.messages.height());
                sound.play();
                if (!this.message.is(':focus')) {
                    titlenotifier.add();
                }
            }

            systemMsg(data) {
                var template = handlebars.compile(systemMessageTemplate);
                this.messages.append(template(data));
                $(".messageField").scrollTop(this.messages.height());
            }

            static getTime() {
                return new Date().toLocaleTimeString();
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
        }

        return new Chat();

    });
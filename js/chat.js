"use strict";
define(['jquery', 'io', 'handlebars',  'modalWindow', 'auth', 'text!../template/messageTemplate.hbs', 'text!../template/systemMessageTemplate.hbs', 'titleNotifier'],
    function ($, io, handlebars, modalWindow, auth, messageTemplate, systemMessageTemplate) {

        class Chat {
            constructor() {
                //Parameters
                this.messages = $(".messageField ul");
                this.message = $("#textField");

                var self = this;

                this.socket = io();

                //Listeners
                this.socket.on('message', function (data) {
                    self.msg(data);
                });

                this.socket.on('systemMessage', function (data) {
                    self.systemMsg({message: data, time: Chat.getTime()});
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
                this.socket.emit("message", {message: text, name: auth.getName(), time: Chat.getTime()});
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

        }

        return new Chat();

    });
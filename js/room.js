"use strict";
define(['jquery', 'io', 'handlebars', 'helpers', 'modalWindow', 'text!../template/roomsTemplate.hbs'],
    function ($, io, handlebars, helpers, modalWindow, roomsTemplate) {

        class Room {
            constructor() {
                //Parameters
                this.rooms = $(".roomContent");
                this.room = '';

                this.messages = $(".messageField ul");

                var self = this;

                this.socket = io();

                //Listeners
                this.socket.on('getRooms', function (data) {
                    self.parseRoomList(data.data);
                    if (data.activeRoom) {
                        this.room = data.activeRoom;
                    }
                });

                $('#createRoomButton').click(function () {
                    self.createRoomDialog();
                });

                this.rooms.click(function (e) {
                    if (!$(e.target).hasClass("roomContent")) {
                        self.joinRoom(e.target.textContent);
                    }
                });
            }

            joinRoom(name) {
                if (name === this.room) {
                    return;
                }
                this.room = name;
                $(".active").removeClass("active");
                $("[data-name=" + Room.getId(name) + "]").addClass("active");
                this.socket.emit('joinRoom', name);
                this.clearMessageArea();
                titlenotifier.reset();
            }

            static getId(string) {
                var res = '';
                for (let i = 0, n = string.length; i < n; i++) {
                    res += string.charCodeAt(i);
                }
                return (res);
            }

            createRoomDialog() {
                var self = this;

                modalWindow.createModalWindow({'placeholder': 'Room name', 'cancel': true});

                modalWindow.getOkButton().click(function () {
                    self.createRoom();
                });

                modalWindow.getInputField().keypress(function (e) {
                    if (e.which === 13) {
                        self.createRoom();
                    }
                });

                modalWindow.getCancelButton().click(function () {
                    modalWindow.deleteModalWindow();
                });
            }

            createRoom() {
                var pattern = /([^a-zA-Zа-яА-Я0-9-+*_ !?#№:;,.]+?)/,
                    name = modalWindow.getData();

                if (name.length <= 0) {
                    modalWindow.throwError("Enter room name");
                    return false;
                }
                if (name.length > 20) {
                    modalWindow.throwError("Very long nickname");
                    return false;
                }
                if (pattern.test(name)) {
                    modalWindow.throwError("Incorrect symbol '" + pattern.exec(name)[1] + "' ");
                    return false;
                }

                modalWindow.deleteModalWindow();
                this.socket.emit('createRoom', name);
            }

            parseRoomList(data) {
                var template = handlebars.compile(roomsTemplate);
                this.rooms.html(template({items: data}));
            }

            clearMessageArea() {
                this.messages.empty();
            }

        }

        return new Room();

    });

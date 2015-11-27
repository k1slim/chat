"use strict";
define(['jquery', 'io', 'handlebars', 'helpers','text!../template/roomsTemplate.hbs'],
    function ($, io, handlebars, helpers, roomsTemplate) {

        class Room {
            constructor() {
                this.rooms = $(".roomContent");
                this.room = '';

                this.messages = $(".messageField ul");

                var self = this;

                this.socket = io();

                this.socket.on('getRooms', function (data) {
                    self.parseRoomList(data.data);
                    if(data.activeRoom){
                        this.room = data.activeRoom;
                    }
                });

                $('#createRoomButton').click(function () {
                    self.createRoom();
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
                $("[data-name=" + name.replace(' ','_') + "]").addClass("active");
                this.socket.emit('joinRoom', name);
                this.clearMessageArea();
                titlenotifier.reset();
            }

            createRoom() {
                var r = prompt('enter room');
                this.socket.emit('createRoom', r);
            }

            parseRoomList(data) {
                var template = handlebars.compile(roomsTemplate);
                this.rooms.html(template({items: data}));
            }

            clearMessageArea(){
                this.messages.empty();
            }

        }

        return new Room();

    });

"use strict";
define(['jquery', 'io', 'handlebars', 'text!../template/messageTemplate.hbs'],
    function($, io, handlebars, messageTemplate){

        class Chat {
            constructor(){
                            //Parameters
                this.messages = $(".messageField ul");
                this.message = $("#textField");
                this.time = $(".messageTime");
                this.nick = $(".nickField");
                this.nickPlaceholder=$("#nick");
                this.name='';
                this.error=$(".error");
                this.authWindow=$(".auth");
                this.block=$(".block");

                var self=this;

                this.socket = io.connect('ws://chat-k1slim.rhcloud.com:8000');
                //this.socket = io.connect('http://localhost:8080');
                //this.socket = io();
                //было html

                            //Listeners
                this.socket.on('message', function(data){
                    self.msg(data);
                });

                $('#sendButton').on("click", function(){
                    self.send();
                });

                $('#authButton').on("click", function(){
                    self.auth();
                });

                this.message.keypress(function(e){
                    if(e.which === 13){
                        self.send();
                    }
                    /*if(e.ctrlKey){
                     var text = self.message.val() + '<br>';
                     self.message.val(text);
                     }*/
                });
            }

            send(){
                var text = this.message.val().replace(',.', ', .');
                if(text.length <= 0){
                    return false;
                }
                this.message.val("");
                this.socket.emit("message", {message: text, name: this.name, time: Chat.getTime()});
            }

            msg(data){
                var template = handlebars.compile(messageTemplate);
                this.messages.append(template(data));
                $(".messageField").scrollTop(this.messages.height());
            }

            static getTime(){
                return new Date().toLocaleTimeString();
            }

            auth(){
                var pattern = new RegExp(/([^a-zA-Zа-яА-Я0-9-_]+?)/);
                this.name=this.nickPlaceholder.val();
                if(this.name.length <= 0){
                    this.error.html("Enter nickname").show();
                    return false;
                }
                if(pattern.test(this.name)){
                    this.error.html("incorrect symbol '" + pattern.exec(this.name)[1] + "' ").show();
                    return false;
                }
                this.nick.html(this.name);
                this.authWindow.fadeOut();
                this.block.fadeOut();
            }
        }

        return new Chat();

    });


'use strict';
define(['jquery', 'jquery-ui'],
    function($){

        class Interactive {
            constructor(){
                this.resizableElements = $(".content");
                Interactive.resize(this.resizableElements);
            }

            static resize(element){
                $(element).resizable({
                    alsoResize: ".messageField",
                    minHeight: "200",
                    minWidth: "200"
                });
            }
        }

        return new Interactive();

    });

'use strict';
define(['jquery', 'jquery-ui'],
    function ($) {

        class Interactive {
            constructor() {
                var self = this;
                this.resizableElements = $(".content");
                this.roomsButton = $("#roomsButton");

                Interactive.resize(this.resizableElements);

                this.roomsButton.click(function () {
                    $(".room").toggle("slide", {direction: "left"}, 500, function () {
                        self.roomsButton
                            .toggleClass('closeArrow')
                            .toggleClass('openArrow');
                    });
                });

            }

            static resize(element) {
                $(element).resizable({
                    alsoResize: ".roomContent, .messageField",
                    minHeight: "200",
                    minWidth: "200"
                });
            }
        }

        return new Interactive();

    });

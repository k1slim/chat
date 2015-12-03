"use strict";
define(['jquery', 'handlebars', 'text!../template/modalWindowTemplate.hbs'],
    function ($, handlebars, modalWindowTemplate) {
        class ModalWindow {

            constructor() {
                //Parameters
                this.block='';
                this.modalWindow='';
                this.inputField = '';
                this.errorPlaceholder = '';
                this.okButton='';
                this.cancelButton='';
            }

            /**
             * @param data = [placeholder, cancel]
             */

            createModalWindow(data) {
                var template = handlebars.compile(modalWindowTemplate);
                $('body').append(template(data));
                this.block=$('.block');
                this.modalWindow=$('.modalWindow');
                this.inputField = $('#inputField');
                this.errorPlaceholder = $('#errorPlaceholder');
                this.okButton=$('#modalOKButton');
                if(data['cancel']){
                    this.cancelButton=$('#modalCancelButton');
                }
            }

            deleteModalWindow() {
                var self=this;

                this.modalWindow.fadeOut();
                this.block.fadeOut(function(){
                    self.okButton.off();
                    self.inputField.off();
                    if(!(self.cancelButton === '')) {
                        self.cancelButton.off();
                    }

                    self.block.remove();
                    self.modalWindow.remove();

                    self.block='';
                    self.modalWindow='';
                    self.inputField = '';
                    self.errorPlaceholder = '';
                    self.okButton='';
                    self.cancelButton='';
                });
            }

            throwError(err) {
                this.errorPlaceholder.html(err).show();
            }

            getData() {
                return this.inputField.val().trim();
            }

            getOkButton(){
                return this.okButton;
            }

            getCancelButton(){
                return this.cancelButton;
            }

            getInputField(){
                return this.inputField;
            }
        }

        return new ModalWindow();
    });

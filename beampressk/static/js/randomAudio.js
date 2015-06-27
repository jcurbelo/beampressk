/** 
* Created by Jorge R. Curbelo
**/

;(function ( $, window, document, undefined ){
    "use strict";

    // Create the defaults once
    var defaults = {
            audios: [],
            socket: null,
            currentAudio: null          
        };

    // The actual plugin constructor
    function RandomAudio( options ) {

        this.options = $.extend( {}, defaults, options);
        
        this._defaults = defaults;

        this.init();
    }

    RandomAudio.prototype.init = function () {

        var self = this;
        // Obtaining all 'srcs' from audios
        self.mediaDict = {}

        self.options.audios.forEach(function($el, i){
            self.mediaDict[$el.attr('id')] = $el.attr('src');
        });

        function playAudio($el, args, fadeIn){
            var args = $.extend({}, {'currentTime': 0, 'duration': 'slow', 'values':{'volume' : 1}}, args);
            if(!$el.attr('src'))
                $el.attr('src', self.mediaDict[$el.attr('id')]);
            $el.trigger('load');
            $el.bind('canplay', function(){
                $el.trigger('play');
                $el.prop('volume', 1);
                // Checking if media definition has curentTime                                           
                $el.prop('currentTime', args['currentTime']);
                if (typeof fadeIn !== 'undefined' && fadeIn){
                    $el.prop('volume', 0);
                    $el.animate(args['values'], args['duration']);
                }                                        
            });            
        }

        function stopCurrentAudio(args, fadeOut){
            var args = $.extend({}, {'duration': 'slow', 'values':{'volume' : 0}}, args);
            if (typeof fadeOut !== 'undefined' && fadeOut){                
                self.options.currentAudio.animate(args['values'], args['duration'], function(){
                    // Callback for removing src
                    self.options.currentAudio.attr('src', null);
                });
            } else {
                self.options.currentAudio.attr('src', null);
            }


        }

        function playNext(msg){
            if (self.options.audios.length == 0)
                return;
            if (self.options.audios.length == 1) {
                playAudio(self.options.audios[0], msg.data,args, msg.data.fadeIn);
            } else {
                var num = 0;
                do {
                    num = Math.floor(Math.random() * self.options.audios.length);
                } while (self.options.audios[num] == self.options.currentAudio);
                self.options.currentAudio = self.options.audios[num];
                playAudio(self.options.currentAudio, msg.data.args, msg.data.fadeIn);        
            }                
        }



        self.options.socket.on('play_random_audio_response', function(msg) {
            playNext(msg);
        });

        self.options.socket.on('stop_random_audio_response', function(msg) {
            stopCurrentAudio(msg.data.args, msg.data.fadeOut);
        }); 

        //Providing chaining
        return self;                 
    } 

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

        // AMD. Register as an anonymous module.
        define(function() {
            return RandomAudio;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = RandomAudio.init;
        module.exports.RandomAudio = RandomAudio;
    } else {
        window.RandomAudio = RandomAudio;
    }                    

}( jQuery, window, document ));
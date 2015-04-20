/** 
* Created by Jorge R. Curbelo
**/

;(function ( $, window, document, undefined ){
    "use strict";

    // Create the defaults once
    var defaults = {
            video : document.querySelector("#live-feed"),
            withAudio : true,
            liveFeedDisplayed : false,
            socket : null            
        };

    // The actual plugin constructor
    function LiveFeed( options ) {

        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;

        this.init();
    }

    LiveFeed.prototype.init = function () {

        var self = this;

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        if (navigator.getUserMedia) {    
            navigator.getUserMedia({video: true, audio: this.options.withAudio}, handleVideo, videoError);
        }

        function handleVideo(stream) {
            self.options.video.src = window.URL.createObjectURL(stream);
            self.options.video.pause();
        }
         
        function videoError(e) {
            // do something
        }

        function liveFeed(){
            if(self.options.liveFeedDisplayed){
                self.options.video.style.display = 'none';
                self.options.video.pause();
                    
            } else {
                self.options.video.style.display = 'block';
                self.options.video.play();
            }
            self.options.liveFeedDisplayed = !self.options.liveFeedDisplayed;              
        }

        this.options.socket.on('live_feed_response', function() {
            liveFeed();
        });

        $(document).on('keyup', function (event){
             if(event.which == 67){
                liveFeed();
             }
        });          

        //Providing chaining
        return this;                 
    } 

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

        // AMD. Register as an anonymous module.
        define(function() {
            return LiveFeed;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = LiveFeed.init;
        module.exports.LiveFeed = LiveFeed;
    } else {
        window.LiveFeed = LiveFeed;
    }                    

}( jQuery, window, document ));
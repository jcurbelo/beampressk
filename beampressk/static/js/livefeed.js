/** 
* Created by Jorge R. Curbelo
**/

;(function ( $, window, document, undefined ){
    "use strict";

    // Create the defaults once
    var defaults = {
            video : document.querySelector("#live-feed"),
            videoContainer: $(".live-feed-container"),
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
            navigator.getUserMedia({video: true, audio: {mandatory: { googAutoGainControl: false, googAutoGainControl2: false}}}, handleVideo, videoError);
        }

        function handleVideo(stream) {
            self.options.video.src = window.URL.createObjectURL(stream);
            self.options.video.pause();
        }
         
        function videoError(e) {
            // do something
        }

        function liveFeed(index){
   
            if(self.options.liveFeedDisplayed){                
                self.options.videoContainer.removeClass('md-show');
                self.options.video.pause();
                    
            } else {
                // Removing class with 'md-effect' as a prefix
                var prefix = "md-effect";
                var classes = self.options.videoContainer.attr('class').split(" ").filter(function(c) {
                    return c.lastIndexOf(prefix, 0) !== -1;
                });
                classes.forEach(function(cls, i){
                    self.options.videoContainer.removeClass(cls);
                });
                self.options.videoContainer.className = $.trim(classes.join(" "));                
                self.options.videoContainer.addClass('md-effect-' + index);
                self.options.videoContainer.addClass('md-show');
                self.options.video.play();
            }
            self.options.liveFeedDisplayed = !self.options.liveFeedDisplayed;              
        }

        this.options.socket.on('live_feed_response', function(msg) {
            var index = msg.data;
            liveFeed(index);
        });

        $(document).on('keyup', function (event){
             if(event.which == 67){
                console.log(self.options.liveFeedDisplayed);
                liveFeed('1');
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
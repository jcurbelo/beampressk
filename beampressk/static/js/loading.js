/** 
* Created by Jorge R. Curbelo
**/

;(function ( $, window, document, undefined ){
    "use strict";

    // Create the defaults once
    var defaults = {
        	$audio : $('#LETTER-65'),
			maxTime : 29000,
			interval : 100,
			currentTime : 0,
			infos : [
				'Preparándonos para iniciar',
				'Inicializando audio...',
				'Inicializando audio... OK', 
				'Inicializando imagen...',
				'Inicializando imagen... OK',
				'Revizando la hortografia...',
				'Revizando la hortografia... Hay 4 herrores',
				'Listos para empezar...',
				'Listos para empezar... OK',            
			],
			exec : null,
			flag : false,
			audioPlayed : false,
			frameDisplayed : false,
			bordersDisplayed : false,
			animateProgress : function () {
				window.loading.options.flag = true;
			}			           
        };

    // The actual plugin constructor
    function Loading( options ) {

        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;

        this.init();
    }

    Loading.prototype.init = function () {

        //Avoiding namespace confusions
        var self = this;


	    this.options.exec = setInterval(tick, this.options.interval);  

	    function tick() {
	        if(self.options.flag){

	            var value = self.options.currentTime * 1e2 / self.options.maxTime,
	                index = Math.floor(value / (1e2 / self.options.infos.length));
	                // console.log(index);	
	                
	            if(index == 1 && !self.options.audioPlayed){
	            	self.options.audioPlayed = true;
	                self.options.$audio.trigger('load');
	                self.options.$audio.bind('canplay', function(){
	                    self.options.$audio.prop('currentTime', '14');
	                    self.options.$audio.prop('volume', 0);
	                    self.options.$audio.trigger('play');
	                    self.options.$audio.animate({
	                    	'volume': 1
	                    }, 'slow');
	                });                	
	            }

	            if(index == 3 && !self.options.frameDisplayed){
	            	self.options.frameDisplayed = true;
	            	$("#frame-loading").animate({'background-color': 'white'}, 'slow');
	            	$("#logo-loading").animate({'opacity': 1}, 'slow');
	            }

	            if(index == 7 && !self.options.bordersDisplayed){
	            	self.options.bordersDisplayed = true;
	            	$("#frame-loading > h1").css('display', 'block');
	            	$("#frame-loading > h1").animate({'height': '42px', 'opacity': 1}, 'slow');

	            	$("#frame-loading > footer").animate({'height': '30px', 'opacity': 1}, 'slow');
	            }                

	            $("#loading").attr('value', value);
	            $("#info").html(self.options.infos[index]);
	            self.options.currentTime += self.options.interval;
	            if(value >= 1e2)
	                clearInterval(self.options.exec);
	        }
	    } 

		//Providing chaining
		return this;        
        
    } 

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return Loading;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Loading.init;
		module.exports.Loading = Loading;
	} else {
		window.Loading = Loading;
	}                  

}( jQuery, window, document ));
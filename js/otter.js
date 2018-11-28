

/* @Class: OTTER
 *
 * @Summary  
 *          
 *
*/
var OTTER = function () {

  let blurBehind = false;
  let overlayClose = false;
  let animatedIntro = false;

  /**
   *	@private getDeviceOS
   *	@description returns the name of the device.
   *	@returns {string} name of the device.  Currently supports "ios", "kindle", "android", "windows"
   *  @reference: https://www.whatismybrowser.com/developers/tools/user-agent-parser/browse
   */
  var getDeviceOS = function() {
    var ua = navigator.userAgent;
    if (ua.match(/Silk/i)) {
      return "kindle";
    } else if (ua.match(/Android/i)) {
      if (ua.match(/Windows Phone/i)) {
        return "windows";
      } else {
        return "android";
      }
    } else if (ua.match(/iPhone|iPad|iPod/i)) {
      return "ios";
    } else {
      return "desktop"; //or unsupported device
    }
  
  }; // getDeviceOS()


  /**
  *  @private closeOverlayModal()
  *  @description 
  */
  var closeOverlayModal = function ($thisContent) {
    $thisContent.fadeOut( 300, function() {
      if (blurBehind) { $("#" + blurBehind).removeClass('otter-blur'); }
      $("html").removeClass('otter-no-scroll');
      $( "#otter-overlay" ).fadeOut( 300, function() {
        $( "body" ).append( $thisContent ); // replace the element at the bottom of the body
        $thisContent.removeClass('o-desktop');
        $("#otter-overlay").remove();
        if (animatedIntro) {
          $thisContent.removeClass('animated ' + animatedIntro);
        }
      });
    });
  }; // closeOverlayModal()


  /**
  *  @private useDrawer()
  *  @description implements the 'drawer' version of the modal content
  */
  var useDrawer = function (thisContentID) {

    let $thisContent = $(thisContentID);

    $thisContent.addClass('o-mobile');
    $("body").prepend( $thisContent );
    scrollToo("body");
    $thisContent.slideDown( 300, function() {
      // callback?
    });
    $(thisContentID + " .otter-close").on( "click", function() {
      scrollToo("body");
      $thisContent.slideUp( 300, function() {
        $( "body" ).append( $thisContent ); // replace the element at the bottom of the body
        $thisContent.removeClass('o-mobile');
      });
      return false;
    });

  }; // useDrawer()


  /**
  *  @private useOverlay()
  *  @description implements the 'overlay' version of the modal content
  */
  var useOverlay = function (thisContentID) {

    let $thisContent = $(thisContentID);

    $("body").prepend('<div id="otter-overlay" class="otter-overlay" style="display:none;"></div>');
    $thisContent.addClass('o-desktop');
    $( "#otter-overlay" ).append( $thisContent );

    $("html").addClass('otter-no-scroll');
    
    if (blurBehind) { // blur the content on the page behind the modal
      $("#" + blurBehind).addClass('otter-blur');
    }

    if (animatedIntro) {
      $thisContent.addClass('animated ' + animatedIntro);
    }

    $( "#otter-overlay" ).fadeIn( 300, function() {      
      $thisContent.fadeIn( 300, function() {

        if (overlayClose) {
          $( "#otter-overlay" ).on( "click", function() { 
            closeOverlayModal($thisContent);
            return false;
          });
        }
      
        $(thisContentID + " .otter-close").on( "click", function() { 
          closeOverlayModal($thisContent);
          return false;
        });
  
      });
    });

  }; // useDrawer()
  
  
  /**
   * Provides a smooth in-page scroll to the target element
   * 
   */
  var scrollToo = function(target) {	
	$("html, body").animate({ scrollTop: $(target).offset().top }, 300);
    return false;
  };

  var setup = function (configObj) {

    var isMobile = false;
    if (getDeviceOS() !== 'desktop') {
      isMobile = true;
    }
    
    $("." + configObj.triggerClass).off( "click" ).on( "click", function() { 
      
      let $thisEl = $(this);
      let thisContentID = "#" + $thisEl.attr(configObj.contentHook);
      
      if (isMobile) { 

        if (configObj.mobileDrawer) { 
          useDrawer(thisContentID);
        } else {
          useOverlay(thisContentID);
        }

      } else { 

        if (configObj.desktopDrawer) { 
          useDrawer(thisContentID);
        } else {
          useOverlay(thisContentID);
        }

      }

      return false;
    });

  }; // setup()
  
  
  /**
  *  @public init()
  *  @description
  */
  this.init = function (configObj) {

    configObj = configObj || {};
   
    if (configObj.mobileDrawer === undefined) {
      configObj.mobileDrawer = false;
    }

    if (configObj.desktopDrawer === undefined) {
      configObj.desktopDrawer = false;
    }

    if (configObj.triggerClass === undefined) {
      configObj.triggerClass = "o-trigger";
    }

    if (configObj.contentHook  === undefined) {
      configObj.contentHook  = "data-content";
    }

    if (configObj.blurBehind  !== undefined) {
      blurBehind = configObj.blurBehind;
    }

    if (configObj.overlayClose !== undefined) {
      overlayClose = configObj.overlayClose;
    }

    if (configObj.animatedIntro !== undefined) {
      animatedIntro = configObj.animatedIntro;
    }

    setup(configObj);


  }; // init()
    

}; // OTTER() 


$(document).ready(function(){

  var otterdemo2 = new OTTER();
  otterdemo2.init({
    'mobileDrawer' : true,          // {boolean} use the mobile drawer feature for mobile devices? (T/F)
                                    // default: false
    'desktopDrawer' : false,        // {boolean} use the mobile drawer feature for desktop? (T/F)
                                    // default: false 
    'triggerClass' : 'demo2',       // {string} class of links that open a modal
                                    // default: 'o-trigger'
    'contentHook' : 'data-content', // {string} attribute name on each modal trigger containing the ID of the
                                    // modal container to show. Examples: 'href', 'rel', 'data-content'
                                    // default: 'data-content'
    'blurBehind' : 'page',          // {string} ID of the (required) wrapping container element of the page content
                                    // default: A boolean false
    'overlayClose' : true,          // {boolean} allow user to click on the overlay to close the modal
                                    // default: false
    'animatedIntro' : 'bounce'      // {string} name of the animation. Default is a boolean false.
  });

  var otterdemo1 = new OTTER();
  otterdemo1.init({
    'mobileDrawer' : false,         // {boolean} use the mobile drawer feature for mobile devices? (T/F)
                                    // default: false
    'desktopDrawer' : false,        // {boolean} use the mobile drawer feature for desktop? (T/F)
                                    // default: false
    'triggerClass' : 'demo1',       // {string} class of links that open a modal
                                    // default: 'o-trigger'
    'contentHook' : 'data-content', // {string} attribute name on each modal trigger containing the ID of the
                                    // modal container to show. Examples: 'href', 'rel', 'data-content'
                                    // default: 'data-content'
    'animatedIntro' : 'rubberBand'  // {string} name of the animation. Default is a boolean false.
  });

  var otterdemo3 = new OTTER();
  otterdemo3.init();

  var otterdemo4 = new OTTER();
  otterdemo4.init({
    'mobileDrawer' : true,          // {boolean} use the mobile drawer feature for mobile devices? (T/F)
                                    // default: false
    'desktopDrawer' : true,         // {boolean} use the mobile drawer feature for desktop? (T/F)
                                    // default: false
    'triggerClass' : 'demo4',       // {string} class of links that open a modal
                                    // default: 'o-trigger'
    'contentHook' : 'data-content', // {string} attribute name on each modal trigger containing the ID of the
                                    // modal container to show. Examples: 'href', 'rel', 'data-content'
                                    // default: 'data-content'
  });


  


  


  

  


});








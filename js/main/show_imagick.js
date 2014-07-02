require.config({
    baseUrl: './js'
});

require([
    'process/imagick'
], function ( Imagick ) {
    "use strict";
     Imagick.showImage();
 
});




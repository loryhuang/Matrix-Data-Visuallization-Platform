require.config({
    baseUrl: './js'
});

require([
    'process/present'
], function (present) {
     "use strict";
      present.getBirdsView();
      present.showImage();
});

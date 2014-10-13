define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/_ColorMixin',
             'dojo/_base/Color'
         ],
         function ( registerSuite, assert, _ColorMixin, Color ) {

             registerSuite ( {
                                 name: '_ColorMixin',

                                 _esriColorArrayToDojoColor: function () {
                                     assert.strictEqual ( _ColorMixin._esriColorArrayToDojoColor( [ 255, 0, 0, 255 ] ), new Color( [ 255, 0, 0, 1 ]),
                                                          '_ColorMixin._esriColorArrayToDojoColor should return an equivalent dojo Color mapping alpha values 0-255 to rgba alpha values 0-1'
                                     );
                                 }
                             }
             );

         }
);
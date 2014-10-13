define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/_ColorMixin',
             'dojo/_base/Color'
         ],
         function ( registerSuite, assert, _ColorMixin, Color ) {

             registerSuite ( {
                                 name: '_ColorMixin module test',

                                 setup: function () {
                                   _colorMixin = new _ColorMixin;
                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     // do nothing
                                 },

                                 // after the suite is done (all tests)
                                 teardown: function() {
                                     _colorMixin = null;
                                 },

                                 '_esriColorArrayToDojoColor': function () {

                                     var testArray = [ 255, 0, 0, 127.5 ];

                                     var actual = _colorMixin._esriColorArrayToDojoColor( testArray );
                                     console.log( 'actual result', actual );

                                     var expected = Color.fromArray( [ 255, 0, 0, 0.5 ] );
                                     console.log( 'expected result', expected );

                                     assert.deepEqual ( actual,
                                                          expected,
                                                          '_ColorMixin._esriColorArrayToDojoColor should return an equivalent dojo Color mapping alpha values 0-255 to rgba alpha values 0-1'
                                     );
                                 }
                             }
             );

         }
);

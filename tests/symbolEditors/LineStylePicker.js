define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/LineStylePicker'
         ],
         function ( registerSuite, assert, Widget ) {

             registerSuite ( {
                                 name: 'LineStylePicker module test',

                                 setup: function () {

                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     // do nothing
                                 },

                                 afterEach: function () {

                                     if ( this.picker ) {
                                         this.picker.destroy();
                                     };

                                 },

                                 // after the suite is done (all tests)
                                 teardown: function() {

                                     if ( this.picker ) {
                                         this.picker.destroy();
                                     };
                                 },

                                 'constructorOptionsTest': function () {

                                     var style = 'esriSLSDashDotDot';
                                     this.picker = new Widget( { lineStyle: style } );
                                     this.picker.startup();

                                     var expected = style;
                                     var actual = this.picker.get( 'lineStyle' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( lineStyle ) should return same style as passed into constructor.'
                                     );
                                 },

                                 'setStyleTest': function () {

                                     var style = 'esriSLSDashDotDot';
                                     this.picker = new Widget();
                                     this.picker.startup();
                                     this.picker.set( 'lineStyle', style );

                                     var expected = style;
                                     var actual = this.picker.get( 'lineStyle' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( lineStyle ) should return same style as passed into .set( lineStyle, style ).'
                                     );
                                 }
                             }
             );

         }
);

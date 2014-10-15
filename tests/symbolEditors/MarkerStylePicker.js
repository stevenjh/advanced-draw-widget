define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/MarkerStylePicker'
         ],
         function ( registerSuite, assert, Widget ) {

             registerSuite ( {
                                 name: 'MarkerStylePicker module test',

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

                                     var style = 'esriSMSDiamond';
                                     this.picker = new Widget( { markerStyle: style } );
                                     this.picker.startup();

                                     var expected = style;
                                     var actual = this.picker.get( 'markerStyle' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( markerStyle ) should return same style as passed into constructor.'
                                     );
                                 },

                                 'setStyleTest': function () {

                                     var style = 'esriSMSDiamond';
                                     this.picker = new Widget();
                                     this.picker.startup();
                                     this.picker.set( 'markerStyle', style );

                                     var expected = style;
                                     var actual = this.picker.get( 'markerStyle' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( markerStyle ) should return same style as passed into .set( lineStyle, style ).'
                                     );
                                 }
                             }
             );

         }
);

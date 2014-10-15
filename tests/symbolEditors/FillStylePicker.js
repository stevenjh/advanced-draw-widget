define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/FillStylePicker'
         ],
         function ( registerSuite, assert, Widget ) {

             registerSuite ( {
                                 name: 'FillStylePicker module test',

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

                                     var style = 'esriSFSCross';
                                     this.picker = new Widget( { fillStyle: style } );
                                     this.picker.startup();

                                     var expected = style;
                                     var actual = this.picker.get( 'fillStyle' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( fillStyle ) should return same style as passed into constructor.'
                                     );
                                 },

                                 'setStyleTest': function () {

                                     var style = 'esriSFSCross';
                                     this.picker = new Widget();
                                     this.picker.startup();
                                     this.picker.set( 'fillStyle', style );

                                     var expected = style;
                                     var actual = this.picker.get( 'fillStyle' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( fillStyle ) should return same style as passed into .set( fillStyle, style ).'
                                     );
                                 }
                             }
             );

         }
);

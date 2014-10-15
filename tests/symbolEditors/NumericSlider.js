define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/NumericSlider'
         ],
         function ( registerSuite, assert, Widget ) {

             registerSuite ( {
                                 name: 'NumericSlider module test',

                                 setup: function () {

                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     // do nothing
                                 },

                                 afterEach: function () {

                                     if ( this.widget ) {
                                         this.widget.destroy();
                                     };

                                 },

                                 // after the suite is done (all tests)
                                 teardown: function() {

                                     if ( this.widget ) {
                                         this.widget.destroy();
                                     };
                                 },

                                 'constructorOptionsTest': function () {

                                     var value = 12;
                                     this.widget = new Widget( { value: value } );
                                     this.widget.startup();

                                     var expected = value;
                                     var actual = this.widget.get( 'value' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( value ) should return same value as passed into constructor.'
                                     );
                                 },

                                 'setValueTest': function () {

                                     var value = 8;
                                     this.widget = new Widget();
                                     this.widget.startup();
                                     this.widget.set( 'value', value );

                                     var expected = value;
                                     var actual = this.widget.get( 'value' );

                                     assert.strictEqual ( actual,
                                                          expected,
                                                          '.get( value ) should return same value as passed into .set( value, value ).'
                                     );
                                 }
                             }
             );

         }
);

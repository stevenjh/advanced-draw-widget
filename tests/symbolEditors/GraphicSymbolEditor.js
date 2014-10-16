define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/GraphicSymbolEditor',
             'adw/widget/SMSEditor',
             'esri/graphic',
             'adw/advancedDrawConfig',
             'esri/symbols/jsonUtils'
         ],
         function ( registerSuite, assert, Widget, SMSEditor, Graphic, defaultConfig, symUtil ) {

             var widget, testGraphic;

             var getTestGraphic = function () {

                 var graphic = new Graphic(
                     null,
                     symUtil.fromJson( defaultConfig.defaultPointSymbol ),
                     { draw_type: 'point' }
                 );

                 return graphic;
             };

             registerSuite ( {
                                 name: 'GraphicSymbolEditor module tests',

                                 setup: function () {

                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     widget = new Widget( { graphic: getTestGraphic() } );
                                     widget.show();
                                 },

                                 afterEach: function() {
                                     if ( widget ) {
                                         widget = null
                                     }
                                 },

                                 // after the suite is done (all tests)
                                 teardown: function() {
                                     if ( widget ){
                                         widget = null;
                                     }
                                 },

                                 'testEditorType': function () {

                                     assert.instanceOf ( widget.editor,
                                                          SMSEditor,
                                                          'Widget.editor should be an instance of SMSEditor when graphic.attributes.draw_type = point.'
                                     );
                                 }
                             }
             );

         }
);

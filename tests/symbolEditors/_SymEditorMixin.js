define ( [
             'intern!object',
             'intern/chai!assert',
             'adw/widget/_SymEditorMixin',
             'dijit/layout/ContentPane'
         ],
         function ( registerSuite, assert, Widget, ContentPane ) {

             var widget;

             registerSuite ( {
                                 name: '_SymEditorMixin module test',

                                 setup: function () {

                                 },

                                 // before each test executes
                                 beforeEach: function() {
                                     widget = new Widget();
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

                                 '_getContentPaneTest': function () {

                                     var widgetTitle = 'Test Content Pane';

                                     var expected = new ContentPane( { title: widgetTitle } );
                                     console.log( 'expected result', expected );

                                     var actual = widget._getContentPane( widgetTitle );
                                     console.log( 'actual result', actual );

                                     assert.instanceOf ( actual,
                                                          ContentPane,
                                                          'Widget._getContent pane should return a new ContentPane.'
                                     );
                                 },

                                 '_getContentPaneTitleTest': function () {

                                     var widgetTitle = 'Test Content Pane';

                                     var actual = widget._getContentPane( widgetTitle );

                                     assert.propertyVal ( actual,
                                                         'title',
                                                         widgetTitle,
                                                         'Widget._getContent pane should return a new ContentPane with the expected title.'
                                     );
                                 }
                             }
             );

         }
);

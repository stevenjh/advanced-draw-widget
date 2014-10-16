define( [
            'dojo/_base/declare',
            'dijit/layout/ContentPane'

        ],
        function( declare,
                  ContentPane
            ) {

            var _SymEditorMixin = declare( null, {


                _getContentPane: function (title) {

                    var contentPane = new ContentPane({
                        title: title
                    });

                    return contentPane;
                }


            } );

            return _SymEditorMixin;

        }

);
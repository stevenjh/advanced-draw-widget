define( [
    'dojo/_base/declare'
], function( declare
    ) {

    var _PaneManager = declare( null, {

        _showExtensionsPane: function () {
            this.stackNode.selectChild( this.extensionsPane );
        },

        _showDefaultPane: function () {
            this.stackNode.selectChild( this.defaultPane );
        },

        _showExtension: function ( extensionContentPane ) {
            this.extensionsStackNode.selectChild( extensionContentPane );
        }




    } );

    return _PaneManager;

} );
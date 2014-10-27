define( [
    'dojo/_base/declare'
], function( declare
    ) {

    var _PaneManager = declare( null, {

        _showExtensionPane: function () {
            this.stackNode.selectChild( this.extensionsPane );
        },

        _showDefaultPane: function () {
            this.stackNode.selectChild( this.defaultPane );
        }


    } );

    return _PaneManager;

} );
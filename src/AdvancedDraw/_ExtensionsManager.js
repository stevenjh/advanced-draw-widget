define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dijit/layout/ContentPane'
        ],
        function( declare,
                  array,
                  ContentPane
            ) {

            var ExtensionsManager = declare( null, {

                constructor: function () {
                    this.registeredExtensions = [];
                },

                postCreate: function () {

                    this.inherited( arguments );

                    var extensions = this.config.extensions;
                    this.initializeExtensions( extensions );

                },

                initializeExtensions: function ( extensions ) {

                    array.forEach( extensions, function ( extension ) {

                        this.initializeExtension( extension );

                    }, this );

                },

                initializeExtension: function( Extension ) {

                    var ext = new Extension( {
                        drawLayers: this._layers
                    });

                    if ( ext.hasUI ) {
                        this.intializeExtensionContainer( ext );
                    }
                    ext.startup();

                    this.registeredExtensions.push( ext );

                },

                intializeExtensionContainer: function ( extension ) {

                    var cp = new ContentPane();
                    cp.addChild( extension );

                    this.extensionsStackNode.addChild( cp );

                }

            } );

            return ExtensionsManager;

        }

);
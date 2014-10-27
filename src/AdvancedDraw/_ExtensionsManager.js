define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dijit/layout/ContentPane',
            'dijit/form/Button'
        ],
        function( declare,
                  lang,
                  array,
                  ContentPane,
                  Button
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

                    var cp = new ContentPane( {
                        title: extension.title
                    } );
                    cp.addChild( extension );

                    this.extensionsStackNode.addChild( cp );

                    this.initializeExtensionButton( extension, cp );

                },

                initializeExtensionButton: function ( extension, container ) {

                    var buttonOptions = extension.buttonOptions || { label: 'Extension', iconClass: 'fa fa-gear iconFixedWidth' };

                    buttonOptions.onClick = lang.hitch( this, function () {
                        this._showExtension( container );
                    } );

                    var extBtn = new Button( buttonOptions );
                    this.extensionsToolbar.addChild( extBtn );

                }

            } );

            return ExtensionsManager;

        }

);
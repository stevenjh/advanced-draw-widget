define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dijit/layout/ContentPane',
            'dijit/Dialog',
            'esri/symbols/jsonUtils',
            './SMSEditor',
            './SLSEditor',
            './SFSEditor',
            'dojo/i18n!../nls/resource',
            'xstyle/css!./css/GraphicSymbolEditor.css'

        ],
        function( declare,
                  lang,
                  ContentPane,
                  ConfirmDialog,
                  symUtil,
                  SMSEditor,
                  SLSEditor,
                  SFSEditor,
                  i18n
            ) {

            var GraphicSymbolEditor = declare( ConfirmDialog, {

                title: i18n.widgets.graphicSymbolEditor.title,
                style: 'width: 300px;',
                id: 'graphicSymbolEditor',
                doLayout: false,

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                    this.editors = {
                        point: SMSEditor,
                        polyline: SLSEditor,
                        polygon: SFSEditor
                    };

                },

                startup: function () {

                    this.inherited( arguments );

                    if ( this.graphic ) {
                        this._loadEditor();
                    }

                },

                _setGraphicAttr: function ( value ) {

                    this.graphic = value;
                    this._set( 'symbol', this.graphic.symbol.toJson() );

                },

                _setSymbolAttr: function ( value ) {

                    console.dir( value );

                    this._loadEditor();

                },

                _loadEditor: function () {

                    if ( !this.symbol ) {
                        return;
                    }

                    if ( this.editor ) {
                        this.editor.destroy();
                    }

                    var widget = this.editors[ this.graphic.attributes.draw_type ];
                    if ( widget ) {
                        this._createEditor( widget );
                    }

                },

                _createEditor: function ( Editor ) {


                    this.editor = new Editor ( {
                        symbol: this.symbol
                    } );

                    this.editor.watch('symbol', lang.hitch(this, function () {

                        var value = arguments[2];

                        if ( this.symbol ) {

                            this.graphic.symbol = symUtil.fromJson( value );

                            if ( this.graphic._layer ) {
                                this.graphic._layer.refresh();
                            }

                        }

                    }));

                    var cp = new ContentPane();
                    cp.addChild( this.editor );
                    this.addChild( cp );

                    this.resize();

                }

            } );

            return GraphicSymbolEditor;

        }

);
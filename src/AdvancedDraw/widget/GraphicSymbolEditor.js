define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dijit/form/Button',
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
                  Button,
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
                id: 'graphicSymbolEditor',
                i18n: i18n,

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                    this.editors = {
                        point: { control: SMSEditor, editorLabel: i18n.widgets.smsEditor.graphicEditorLabel },
                        polyline: { control: SLSEditor, editorLabel: i18n.widgets.slsEditor.graphicEditorLabel },
                        polygon: { control: SFSEditor, editorLabel: i18n.widgets.sfsEditor.graphicEditorLabel }
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

                _createEditor: function ( widget ) {

                    var Editor = widget.control;

                    this.editor = new Editor ( {
                        editorLabel: widget.editorLabel
                    } );
                    this.editor.set( 'symbol', this.symbol );

                    this.editor.watch('symbol', lang.hitch(this, function () {

                        var value = arguments[2];
                        this._updateGraphicWithSymbol( value );

                    }));

                    this._createContainers();
                    this.editorPane.addChild( this.editor );

                    this.resize();

                },

                _updateGraphicWithSymbol: function ( value ) {

                    if ( this.graphic ) {

                        this.graphic.symbol = symUtil.fromJson( value );

                        if ( this.graphic._layer ) {
                            this.graphic._layer.refresh();
                        }

                    }

                },

                _createContainers: function () {

                    this._createEditorPane();
                    this._createActionBar();

                },

                _createEditorPane: function () {

                    if ( !this.editorPane ) {
                        this.editorPane = new ContentPane();
                        this.editorPane.id = 'graphicSymbolEditorEditorsPane';
                        this.addChild( this.editorPane );
                    }

                },

                _createActionBar: function () {

                    if ( !this.actionBar ) {
                        this.actionBar = new ContentPane( { id: 'graphicSymbolEditorActionBar' } );
                        this.addChild( this.actionBar );
                    }

                    this.okButton = new Button({
                        label: 'Apply',
                        onClick: lang.hitch( this, function(){
                            this.hide();
                        } )
                    } );

                    this.actionBar.addChild( this.okButton );

                    this.cancelButton = new Button({
                                                   label: 'Cancel',
                                                   onClick: lang.hitch( this, function(){
                                                       this._rollBackSymbolUpdates();
                                                       this.hide();
                                                   } )
                                               } );

                    this.actionBar.addChild( this.cancelButton );
                },

                _rollBackSymbolUpdates: function () {

                    if ( this.graphic ) {
                        this._updateGraphicWithSymbol( this.symbol );
                    }

                },

                destroy: function () {

                    this.editorPane.destroy();
                    this.actionBar.destroy();
                    this.inherited( arguments );

                }



            } );

            return GraphicSymbolEditor;

        }

);
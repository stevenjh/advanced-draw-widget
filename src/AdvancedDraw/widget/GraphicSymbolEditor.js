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
    '../undo/editSymbolGraphicOp',
    'dojo/i18n!../nls/resource',
    'xstyle/css!./css/GraphicSymbolEditor.css'

], function(
    declare,
    lang,
    Button,
    ContentPane,
    ConfirmDialog,
    symUtil,
    SMSEditor,
    SLSEditor,
    SFSEditor,
    EditSymbolGraphicOp,
    i18n
) {

    var GraphicSymbolEditor = declare( ConfirmDialog, {

        title: i18n.widgets.graphicSymbolEditor.title,
        id: 'graphicSymbolEditor',
        i18n: i18n,
        undoOp: null,
        colorPickerOptions: {
            type: 'simple',
            simple: {
                paletteSize  : '7x10'
            },
            closeOnChange: true
        },

        constructor: function( options ) {

            options = options || {};
            lang.mixin( this, options );

            this.editors = {
                point: { control: SMSEditor, editorLabel: i18n.widgets.smsEditor.graphicEditorLabel },
                polyline: { control: SLSEditor, editorLabel: i18n.widgets.slsEditor.graphicEditorLabel },
                polygon: { control: SFSEditor, editorLabel: i18n.widgets.sfsEditor.graphicEditorLabel }
            };

        },

        _getGraphicAttr: function () {

            var symbol = this.editor.get( 'symbol' );
            this._updateGraphicWithSymbol( symbol );
            return this.graphic;

        },

        _setGraphicAttr: function ( value ) {

            this.graphic = value;
            this._initialGraphicSymbol = lang.clone( value.symbol.toJson() );

            this.undoOp = new EditSymbolGraphicOp( {
                graphic: value,
                startSym: this._initialGraphicSymbol
            } );

            this._loadEditor();

        },

        _loadEditor: function () {

            if ( !this.graphic ) {
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
                editorLabel: widget.editorLabel,
                colorPickerOptions: this.colorPickerOptions
            } );
            this.editor.set( 'symbol', this.graphic.symbol.toJson() );

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

                this.graphic.setSymbol( symUtil.fromJson( value ) );
                this._updateUndoOpEndSym( value );

            }

        },

        _updateUndoOpEndSym: function ( symbol ) {

            if ( this.undoOp ) {
                this.undoOp.endSym = symbol;
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

            this._createApplyButton();
            this._createCancelButton();

        },

        _createApplyButton: function () {

            this.applyButton = new Button({
                label: 'Apply',
                onClick: lang.hitch( this, function(){
                    this.hide();
                } )
            } );

            this.actionBar.addChild( this.applyButton );

        },

        _createCancelButton: function () {

            this.cancelButton = new Button({
                label: 'Cancel',
                onClick: lang.hitch( this, function(){
                    this._cancelUpdates();
                } )
            } );

            this.actionBar.addChild( this.cancelButton );

        },

        _cancelUpdates: function () {

            this._rollBackSymbolUpdates();
            this.hide();

        },

        _rollBackSymbolUpdates: function () {

            if ( this.graphic ) {

                this.editor.set( 'symbol', this._initialGraphicSymbol );
                this.undoOp = null;

            }

        },

        destroy: function () {

            this.editorPane.destroy();
            this.actionBar.destroy();
            this.inherited( arguments );

        }



    } );

    return GraphicSymbolEditor;

} );
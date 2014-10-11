define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dojo/_base/Color',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dijit/layout/TabContainer',
            'dijit/layout/ContentPane',
            'src/AdvancedDraw/widget/SymColorPicker',
            'src/AdvancedDraw/widget/LineStylePicker',
            'src/AdvancedDraw/widget/FillStylePicker',
            'src/AdvancedDraw/widget/MarkerStylePicker',
            'src/AdvancedDraw/widget/NumericSlider',
            'dojo/text!./templates/SymbolEditor.html',
            'dojo/i18n!../nls/resource',
            '../modules/_defaultConfig',
            'xstyle/css!./css/SymbolEditor.css'

        ],
        function( declare,
                  lang,
                  array,
                  Color,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  TabContainer,
                  ContentPane,
                  SymColorPicker,
                  LineStylePicker,
                  FillStylePicker,
                  MarkerStylePicker,
                  NumericSlider,
                  template,
                  i18n,
                  defaultConfig
            ) {

            var SMSEditor = declare( [ _WidgetBase,
                                       _TemplatedMixin,
                                       _WidgetsInTemplateMixin
                                     ],
                                     {

                                         widgetsInTemplate: true,
                                         templateString: template,
                                         i18n: i18n,
                                         baseClass: 'symbolEditor',

                                         constructor: function( options ) {

                                             options = options || {};
                                             lang.mixin( this, options );
                                             this.defaultSymbol = defaultConfig.defaultPointSymbol;

                                         },

                                         _getDefaultSymbol: function () {

                                             var symbol = this.defaultSymbol;
                                             return symbol;

                                         },

                                         postCreate: function () {

                                             this.inherited( arguments );

                                             if ( !this.symbol ) {
                                                 this.symbol = this._getDefaultSymbol();
                                             }

                                             this._initTabContainer();
                                             this._initSymbolStylePicker();
                                             this._initSymbolColorPicker();
                                             this._initSymbolSizeSlider();

                                             this._initOutlineStylePicker();
                                             this._initOutlineColorPicker();
                                             this._initOutlineWidthSlider();

                                         },

                                         startup: function () {

                                             this.inherited( arguments );
                                             this.tabContainer.resize();

                                         },

                                         _initTabContainer: function () {

                                             this.tabContainer = new TabContainer( {
                                                    style: 'height: 100%; width: 100%;',
                                                    doLayout: false,
                                                    tabPosition: 'top'
                                             }, this.tabContainerNode );

                                             this.symbolPane = this._getContentPane( 'Symbol' );
                                             this.outlinePane = this._getContentPane( 'Outline' );
                                             this.tabContainer.addChild( this.symbolPane );
                                             this.tabContainer.addChild( this.outlinePane );
                                             this.tabContainer.startup();
                                         },

                                         _initSymbolStylePicker: function () {

                                             this.symbolStylePicker = new MarkerStylePicker( {
                                                 markerStyle: this.symbol.style,
                                                 class: 'symbolEditorControl'
                                             } );

                                             this.symbolStylePicker.watch( 'markerStyle', lang.hitch( this, function ( name, oldValue, value ) {

                                                 var symbol = lang.clone( this.symbol );
                                                 symbol.style = value;

                                                 this._set( 'symbol', symbol );

                                             } ) );

                                             this.symbolPane.addChild( this.symbolStylePicker );

                                         },

                                         _initSymbolColorPicker: function () {

                                             this.symbolColorPicker = new SymColorPicker( {
                                                 color: new Color( this.symbol.color ),
                                                 class: 'symbolEditorControl'
                                             } );

                                             this.symbolColorPicker.watch( 'color', lang.hitch( this, function ( name, oldValue, value ) {

                                                 var symbol = lang.clone( this.symbol );
                                                 var colorsArray = value.toRgba();
                                                 colorsArray[ 3 ] = Math.round( colorsArray[ 3 ] * 255 );
                                                 symbol.color = colorsArray;

                                                 this._set( 'symbol', symbol );

                                             } ) );

                                             this.symbolPane.addChild( this.symbolColorPicker );

                                         },

                                         _initSymbolSizeSlider: function () {

                                             this.symbolSizeSlider = new NumericSlider( {
                                                 value: this.symbol.size,
                                                 min: 1,
                                                 max: 100,
                                                 class: 'symbolEditorControl'
                                             })

                                             this.symbolSizeSlider.watch( 'value', lang.hitch( this, function ( name, oldValue, value ) {

                                                 var symbol = lang.clone( this.symbol );
                                                 symbol.size = value;

                                                 this._set( 'symbol', symbol );

                                             } ) );

                                             this.symbolPane.addChild( this.symbolSizeSlider );

                                         },

                                         _initOutlineStylePicker: function () {

                                             this.outlineStylePicker = new LineStylePicker( {
                                                                                                 lineStyle: this.symbol.outline.style,
                                                                                                 class: 'symbolEditorControl'
                                                                                             } );

                                             this.outlineStylePicker.watch( 'lineStyle', lang.hitch( this, function ( name, oldValue, value ) {

                                                 var symbol = lang.clone( this.symbol );
                                                 symbol.outline.style = value;

                                                 this._set( 'symbol', symbol );

                                             } ) );

                                             this.outlinePane.addChild( this.outlineStylePicker );

                                         },

                                         _initOutlineColorPicker: function () {

                                             this.outlineColorPicker = new SymColorPicker( {
                                                  color: new Color( this.symbol.outline.color ),
                                                  class: 'symbolEditorControl'
                                             } );

                                             this.outlineColorPicker.watch( 'color', lang.hitch( this, function ( name, oldValue, value ) {

                                                 var colorsArray = value.toRgba();
                                                 colorsArray[ 3 ] = Math.round( colorsArray[ 3 ] * 255 );

                                                 var symbol = lang.clone( this.symbol );
                                                 symbol.outline.color = colorsArray;

                                                 this._set( 'symbol', symbol );

                                             } ) );

                                             this.outlinePane.addChild( this.outlineColorPicker );

                                         },

                                         _initOutlineWidthSlider: function () {

                                             this.outlineWidthSlider = new NumericSlider( {
                                                 value: this.symbol.size,
                                                 min: 1,
                                                 max: 20,
                                                 class: 'symbolEditorControl'
                                             });

                                             this.outlineWidthSlider.watch( 'value', lang.hitch( this, function ( name, oldValue, value ) {

                                                 var symbol = lang.clone( this.symbol );
                                                 symbol.outline.width = value;

                                                 this._set( 'symbol', symbol );

                                             } ) );

                                             this.outlinePane.addChild( this.outlineWidthSlider );

                                         },

                                         _getContentPane: function ( title ) {

                                             var contentPane = new ContentPane( {
                                                title: title
                                             } );

                                             return contentPane;
                                         },

                                         _setSymbolAttr: function ( value ) {

                                             this.symbol = value;
                                             this.symbolColorPicker.set( 'value', new Color( this.symbol.color ) );
                                             this.sizeSlider.set( 'value', this.symbol.size );

                                         }

                                     } );

            return SMSEditor;



        }

);
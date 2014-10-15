define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/Color',
            'dojo/dom-style',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/SymColorPicker.html',
            'dojo/i18n!../nls/resource',
            'dijit/form/DropDownButton',
            'dijit/TooltipDialog',
            'dojox/widget/ColorPicker',
            'xstyle/css!dojox/widget/ColorPicker/ColorPicker.css',
            'xstyle/css!./css/SymColorPicker.css'

        ],
        function( declare,
                  lang,
                  Color,
                  domStyle,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template,
                  i18n
            ) {

            var ColorPickerDialog = declare( [ _WidgetBase,
                                                _TemplatedMixin,
                                                _WidgetsInTemplateMixin
                                             ], {

                widgetsInTemplate: true,
                templateString: template,
                color: null,
                alpha: 1,
                i18n: i18n,
                baseClass: 'colorPicker',
                label: 'Color and alpha:',

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                    if ( !this.color ){
                        this.color = new Color( '#FFFFFF' );
                    }

                },

                _setColorAttr: function ( value ) {

                    if ( this.colorPickerDijit && value ) {
                        this.colorPickerDijit.set( 'value', value.toHex() );
                    }
                    if ( this.alphaSlider ) {
                        this.alphaSlider.set( 'value', value.a );
                    }

                    this._updateColorSwatch( value.toHex() );

                    this.color = value;

                },

                _onAlphaSliderChange: function( value ) {

                    var colorsArray = this.color.toRgb();
                    colorsArray.push( value );
                    this._set( 'color', Color.fromArray( colorsArray ) );

                },

                _onColorPickerChange: function( value ) {

                    var colorsArray = Color.fromHex( value ).toRgb();

                    colorsArray.push( this._getAlphaValue() );

                    this._set( 'color', Color.fromArray( colorsArray ) );
                    this._updateColorSwatch( value );

                },

                _getAlphaValue: function () {

                    var alpha = 255;

                    if ( this.alphaSlider ) {
                        alpha = this.alphaSlider.get( 'value' );
                    }

                    return alpha;

                },

                _updateColorSwatch: function ( hexValue ) {

                    if ( this.colorSwatchNode ) {
                        domStyle.set( this.colorSwatchNode, 'backgroundColor', hexValue );
                    }

                }

            } );

            return ColorPickerDialog;

        }

);
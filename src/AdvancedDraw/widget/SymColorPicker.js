define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/Color',
            'dojo/dom-style',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dijit/popup',
            'dojo/text!./templates/SymColorPicker.html',
            'dojo/i18n!../nls/resource',
            './_ColorMixin',
            'dijit/form/DropDownButton',
            'dijit/form/HorizontalSlider',
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
                  popup,
                  template,
                  i18n,
                  _ColorMixin
            ) {

            var ColorPickerDialog = declare( [ _WidgetBase,
                                                _TemplatedMixin,
                                                _WidgetsInTemplateMixin,
                                                _ColorMixin
                                             ], {

                widgetsInTemplate: true,
                templateString: template,
                defaultColor: [ 255,0,0,255 ],
                color: null,
                alpha: 1,
                i18n: i18n,
                baseClass: 'colorPicker',
                label: 'Color and alpha:',
                buttonLabel: 'Marker color',
                sliderLabel: 'Marker transparency',

                constructor: function( options ) {

                    options = options || { color: this.defaultColor };
                    this._validateColor( options.color );
                    lang.mixin( this, options );

                },

                _validateColor: function ( color ) {

                    if ( !( color instanceof Array ) ) {
                        throw new Error( 'color is not an ESRI color array' );
                    }

                },

                startup: function () {

                    var color = this.color;
                    this.inherited( arguments );
                    this.color = color;

                },

                _updateControls: function ( color ) {

                    if ( this.colorPickerDijit && color ) {
                        this.colorPickerDijit.set( 'value', color.toHex() );
                    }

                    if ( this.alphaSlider ) {
                        this.alphaSlider.set( 'value', color.a );
                    }

                    this._updateColorSwatch( color.toHex() );

                },

                _setColorAttr: function ( value ) {

                    value = this._esriColorArrayToDojoColor( value );
                    this._updateControls( value );
                    this.color = value;

                },

                _getColorAttr: function () {

                    return this._dojoColorToEsriColorArray( this.color );

                },

                _onAlphaSliderChange: function( value ) {

                    var newColor = lang.clone( this.color );
                    newColor.a = value;
                    this._set( 'color', newColor );

                },

                _onColorPickerChange: function( value ) {

                    var newColor = Color.fromHex( value );
                    newColor.a = this._getAlphaValue();

                    this._updateColorSwatch( newColor.toHex() );

                    this._set( 'color', newColor );

                },

                _getAlphaValue: function () {

                    var alpha = 1;

                    if ( this.alphaSlider ) {
                        alpha = this.alphaSlider.get( 'value' );
                    }

                    return alpha;

                },

                _updateColorSwatch: function ( hexValue ) {

                    if ( this.colorSwatchNode ) {
                        domStyle.set( this.colorSwatchNode, 'backgroundColor', hexValue );
                    }

                },

                onClose: function () {

                    popup.close( this.colorPickerTooltipDialog );

                }

            } );

            return ColorPickerDialog;

        }

);
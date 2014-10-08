define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dojo/_base/Color',
            'dojo/dom-style',
            'dojo/Stateful',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/ColorPickerDialog.html',
            'dijit/form/DropDownButton',
            'dijit/TooltipDialog',
            'dojox/widget/ColorPicker',
            'xstyle/css!dojox/widget/ColorPicker/ColorPicker.css',
            'xstyle/css!./css/ColorPickerDialog.css'

        ],
        function( declare,
                  lang,
                  array,
                  Color,
                  domStyle,
                  Stateful,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template
            ) {

            var ColorPickerDialog = declare( [ _WidgetBase,
                                                _TemplatedMixin,
                                                _WidgetsInTemplateMixin
                                             ], {

                widgetsInTemplate: true,
                templateString: template,
                color: '#0000FF',

                constructor: function() {
                    //TODO implementation
                    this.set( 'color', new Color( '#00F000' ) );

                },

                _setColorAttr: function ( value ) {

                    if ( this.colorPickerDijit ) {
                        this.colorPickerDijit.set( 'value', value.toHex() );
                    }

                    this._updateColorSwatch( value.toHex() );

                    this._set( 'color', value );

                },

                _onColorPickerChange: function( value ) {

                    this._set( 'color', new Color( value ) );
                    this._updateColorSwatch( value );

                },

                _updateColorSwatch: function ( value ) {

                    if ( this.colorSwatchNode ) {
                        domStyle.set( this.colorSwatchNode, 'backgroundColor', value )
                    }

                }

            } );

            return ColorPickerDialog;

        }

);
define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dojo/_base/Color',
            'dojo/Stateful',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/ColorPickerDialog.html',
            'dijit/form/DropDownButton',
            'dijit/TooltipDialog',
            'dojox/widget/ColorPicker',
            'xstyle/css!dojox/widget/ColorPicker/ColorPicker.css'

        ],
        function( declare,
                  lang,
                  array,
                  Color,
                  Stateful,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template
            ) {

            var ColorPickerDialog = declare( [ _WidgetBase,
                                                _TemplatedMixin,
                                                _WidgetsInTemplateMixin,
                                             ], {

                widgetsInTemplate: true,
                templateString: template,
                color: '#0000FF',

                constructor: function() {
                    //TODO implementation
                    this.set( 'color', '#00F000' );

                },

                _setColorAttr: function ( value ) {

                    if ( this.colorPickerDijit ) {
                        this.colorPickerDijit.set( 'value', value );
                    }
                    this._set( 'color', value );

                },

                _onColorPickerChange: function( value ) {

                    this._set( 'color', value );

                }

            } );

            return ColorPickerDialog;

        }

);
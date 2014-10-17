define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/number',
            'dijit/form/HorizontalSlider',
            'dojo/text!./templates/NumericSlider.html',
            'dojo/i18n!../nls/resource',
            'xstyle/css!./css/NumericSlider.css'

        ],
        function( declare,
                  lang,
                  num,
                  HorizontalSlider,
                  template,
                  i18n
            ) {

            var NumericSlider = declare( HorizontalSlider, {

                templateString: template,

                constructor: function( options ) {

                    this.value = 0;
                    this.minimum = 0;
                    this.maximum = 1;
                    this.showButtons = false;
                    this.intermediateChanges = true;
                    this.i18n = i18n;
                    this.label = 'Line width:';

                    options = options || {};
                    lang.mixin( this, options );

                },

                _getValueAttr: function () {
                    return num.round( this.value, 1 );
                }

            } );

            return NumericSlider;

        }

);
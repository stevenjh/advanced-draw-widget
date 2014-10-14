define( [
            'dojo/_base/declare',
            'dojo/_base/Color'

        ],
        function( declare,
                  Color
            ) {

            var _ColorMixin = declare( null, {

                _esriColorArrayToDojoColor: function ( esriColor ) {

                    esriColor[ 3 ] = esriColor[ 3 ] / 255;
                    var color = Color.fromArray( esriColor );

                    return color;

                },

                _dojoColorToEsriColorArray: function ( dojoColor ) {

                    var colorsArray = dojoColor.toRgba();
                    colorsArray[ 3 ] = Math.round( colorsArray[ 3 ] * 255 );

                    return colorsArray;

                }


            } );

            return _ColorMixin;

        }

);
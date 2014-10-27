define( [
    'dojo/_base/declare',
    'dojo/topic',
    './ADWTopicRegistry'
], function(
    declare,
    topic,
    adwTopics
    ) {

    var _ADWNotifier = declare( null, {

        sendDefaultSymbolUpdatedNotification: function ( oldSymbol, newSymbol ) {

            topic.publish( adwTopics.get( 'ADW_SYMBOLS_DEFAULT_EDIT' ), { oldSymbol: oldSymbol, newSymbol: newSymbol } );

        },

        sendGraphicAddedNotification: function ( graphic ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_DRAW_ADD' ), { graphic: graphic } );

        },

        sendGraphicDeletedNotification: function ( graphic ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_DRAW_DELETE' ), { graphic: graphic }  );

        },

        sendGraphicGeometryEditedNotification: function ( graphic, oldGeom, newGeom ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_DRAW_EDIT' ), { graphic: graphic, oldGeometry: oldGeom, newGeometry: newGeom } );

        },

        sendGraphicSymbolEditedNotification: function ( graphic, oldSymbol, newSymbol ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_SYMBOL_EDIT' ), { graphic: graphic, oldSymbol: oldSymbol, newSymbol: newSymbol } );

        }

    } );

    return _ADWNotifier;

} );
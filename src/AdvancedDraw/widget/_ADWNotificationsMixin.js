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

        constructor: function () {
            this.enableLogging();
        },

        sendDefaultSymbolUpdatedNotification: function ( oldSymbol, newSymbol ) {

            topic.publish( adwTopics.get( 'ADW_SYMBOLS_DEFAULT_EDIT' ), oldSymbol, newSymbol );

        },

        sendGraphicAddedNotification: function ( graphic ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_DRAW_ADD' ), graphic );

        },

        sendGraphicDeletedNotification: function ( graphic ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_DRAW_DELETE' ), graphic );

        },

        sendGraphicGeometryEditedNotification: function ( graphic, oldGeom, newGeom ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_DRAW_EDIT' ), graphic, oldGeom, newGeom );

        },

        sendGraphicSymbolEditedNotification: function ( graphic, oldSymbol, newSymbol ) {

            topic.publish( adwTopics.get( 'ADW_GRAPHIC_SYMBOL_EDIT' ), graphic, oldSymbol, newSymbol );

        },

        enableLogging: function () {

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_DRAW_ADD' ), function () {
                console.log( adwTopics.get( 'ADW_GRAPHIC_DRAW_ADD' ), arguments );
            } );

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_SYMBOL_EDIT' ), function () {
                console.log( adwTopics.get( 'ADW_GRAPHIC_SYMBOL_EDIT' ), arguments );
            } );

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_DRAW_DELETE' ), function () {
                console.log( adwTopics.get( 'ADW_GRAPHIC_DRAW_DELETE' ), arguments );
            } );

            topic.subscribe( adwTopics.get( 'ADW_GRAPHIC_DRAW_EDIT' ), function () {
                console.log( adwTopics.get( 'ADW_GRAPHIC_DRAW_EDIT' ), arguments );
            } );

            topic.subscribe( adwTopics.get( 'ADW_SYMBOLS_DEFAULT_EDIT' ), function () {
                console.log( adwTopics.get( 'ADW_SYMBOLS_DEFAULT_EDIT' ), arguments );
            } );

        }


    } );

    return _ADWNotifier;

} );
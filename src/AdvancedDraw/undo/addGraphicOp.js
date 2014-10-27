define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'esri/OperationBase',
    'dojo/i18n!./../nls/resource',
    '../widget/_ADWNotificationsMixin'
], function (
    declare,
    lang,
    OperationBase,
    i18n,
    _ADWNotificationsMixin
) {
    return declare( [ OperationBase, _ADWNotificationsMixin ], {

        label: i18n.undoManager.addGraphic,

        constructor: function (params) {
            lang.mixin(this, params);
            // @param layer
            // @param graphic
        },

        performUndo: function () {
            this.layer.remove(this.graphic);
            this.sendGraphicDeletedNotification( this.graphic );
        },

        performRedo: function () {
            this.layer.add(this.graphic);
            this.sendGraphicAddedNotification( this.graphic );
        }

    });
});
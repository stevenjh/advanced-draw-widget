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

        label: i18n.undoManager.editGeometry,

        constructor: function (params) {
            lang.mixin(this, params);
            // @param graphic
            // @param startGeom - geometry before edit
            // @param endGeom - geometry after edit
        },

        performUndo: function () {
            this.graphic.setGeometry(this.startGeom);
            this.sendGraphicGeometryEditedNotification(
                this.graphic,
                this.endGeom,
                this.startGeom
            );
        },

        performRedo: function () {
            this.graphic.setGeometry(this.endGeom);
            this.sendGraphicGeometryEditedNotification(
                this.graphic,
                this.startGeom,
                this.endGeom
            );
        }

    });
});
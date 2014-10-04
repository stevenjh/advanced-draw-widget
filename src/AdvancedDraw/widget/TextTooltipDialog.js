define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-style',
    'dojo/on',
    'dojo/keys',
    'dijit/TooltipDialog',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./templates/TextTooltipDialog.html',
    'dijit/popup',
    'esri/symbols/jsonUtils',
    'dijit/form/TextBox',
    'dijit/form/Button'
], function (
    declare,
    lang,
    domStyle,
    on,
    keys,
    TooltipDialog,
    _WidgetsInTemplateMixin,
    template,
    popup,
    symbolJsonUtils
) {
    var TextTooltipDialog = declare([TooltipDialog, _WidgetsInTemplateMixin], {
        templateString: template,
        baseClass: 'AdvancedDrawTextTooltipDialog',
        _graphic: null,
        _isNewText: true,
        _originalText: 'New Text',
        i18n: null,

        postCreate: function () {
            this.inherited(arguments);
            on(this, 'show', lang.hitch(this, '_show'));
            // update text in real time b/c it looks bad ass
            on(this.textNode, 'change', lang.hitch(this, '_textChange'));
            // set key press evts
            this.on('keypress', lang.hitch(this, '_keyPress'));
        },

        _show: function () {
            this.textNode.focus();
            // set _originalText to graphic's text
            this._originalText = this._graphic.symbol.toJson().text;
            // disable navigation and hide slider
            var map = this._graphic.getLayer().getMap();
            map.disableMapNavigation();
            if (map._slider) {
                domStyle.set(map._slider, 'display', 'none');
            }
        },

        _textChange: function (value) {
            var symbol = this._graphic.symbol.toJson();
            if (value !== '') {
                symbol.text = value;
            } else {
                symbol.text = 'New Text';
            }
            this._graphic.setSymbol(symbolJsonUtils.fromJson(symbol));
        },

        _keyPress: function (evt) {
            // enter adds text
            if (evt.keyCode === keys.ENTER) {
                this._add();
            }
            // esc cancels
            if (evt.keyCode === keys.ESCAPE) {
                this._cancel();
            }
        },

        _add: function () {
            popup.close();
            this._resetMapNav();
            var value = this.textNode.get('value'),
                symbol = this._graphic.symbol.toJson(),
                newText; // newText will be used in the undo operation
            if (value !== '') {
                newText = symbol.text = value;
            } else {
                newText = symbol.text = 'New Text';
            }
            this._graphic.setSymbol(symbolJsonUtils.fromJson(symbol));
            this._isNewText = false;
        },

        _cancel: function () {
            popup.close();
            this._resetMapNav();
            if (this._isNewText) {
                this._graphic.getLayer().remove(this._graphic);
                this.destroy();
            }
        },

        _resetMapNav: function () {
            var map = this._graphic.getLayer().getMap();
            // enable navigation and hide slider
            map.enableMapNavigation();
            if (map._slider) {
                domStyle.set(map._slider, 'display', 'block');
            }
        }
    });

    return TextTooltipDialog;
});
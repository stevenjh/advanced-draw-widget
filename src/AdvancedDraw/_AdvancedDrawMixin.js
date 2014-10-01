define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',

    // menu
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',
], function (
    declare,
    lang,

    Menu,
    MenuItem,
    PopupMenuItem,
    MenuSeparator
) {

    var _AdvancedDrawMixin = declare([], {

        //////////////////////////////
        // options menu and friends //
        //////////////////////////////
        _optionsMenu: null,
        _initOptionsMenu: function () {
            var menu = new Menu();
            menu.addChild(new MenuItem({
                label: 'Delete All',
                title: 'Delete All Graphics'
            }));
            menu.addChild(new MenuSeparator());
            menu.addChild(new MenuItem({
                label: 'Import From File',
                title: 'Import From File',
                onClick: lang.hitch(this, '_setPane', this.importPane)
            }));
            menu.addChild(new MenuItem({
                label: 'Export To File',
                title: 'Export To File',
                onClick: lang.hitch(this, '_setPane', this.exportPane)
            }));
            menu.addChild(new MenuSeparator());
            menu.addChild(new MenuItem({
                label: 'Settings',
                title: 'Draw Settings',
                onClick: lang.hitch(this, '_setPane', this.settingsPane)
            }));
            menu.addChild(new MenuItem({
                label: 'Help',
                title: 'Draw Help',
                onClick: lang.hitch(this, '_setPane', this.helpPane)
            }));
            menu.startup();
            this.drawOptionsNode.set('dropDown', menu);
            this._optionsMenu = menu;
        },
        // select a stack pane
        _setPane: function (pane) {
            this.stackNode.selectChild(pane);
        },
        // default to draw pane
        _setDrawPane: function () {
            this.stackNode.selectChild(this.drawPane);
        },

        //////////////////////////////
        // options menu and friends //
        //////////////////////////////
        _drawMenu: null,
        _initDrawMenu: function () {
            var menu = new Menu();
            menu.addChild(new MenuItem({
                label: 'Point',
                onClick: lang.hitch(this, '_draw', 'point', 'Point')
            }));
            menu.addChild(new MenuItem({
                label: 'Polyline',
                onClick: lang.hitch(this, '_draw', 'polyline', 'Polyline')
            }));
            menu.addChild(new MenuItem({
                label: 'Polygon',
                onClick: lang.hitch(this, '_draw', 'polygon', 'Polygon')
            }));
            menu.addChild(new MenuItem({
                label: 'Text',
                onClick: lang.hitch(this, '_draw', 'text', 'Text')
            }));
            var freehand = new Menu();
            freehand.addChild(new MenuItem({
                label: 'Polyline',
                onClick: lang.hitch(this, '_draw', 'freehandpolyline', 'Freehand Polyline')
            }));
            freehand.addChild(new MenuItem({
                label: 'Polygon',
                onClick: lang.hitch(this, '_draw', 'freehandpolygon', 'Freehand Polygon')
            }));
            freehand.startup();
            menu.addChild(new PopupMenuItem({
                label: 'Freehand',
                popup: freehand
            }));
            var shapes = new Menu();
            shapes.addChild(new MenuItem({
                label: 'Rectangle',
                onClick: lang.hitch(this, '_draw', 'extent', 'Rectangle')
            }));
            shapes.addChild(new MenuItem({
                label: 'Circle',
                onClick: lang.hitch(this, '_draw', 'circle', 'Circle')
            }));
            shapes.startup();
            menu.addChild(new PopupMenuItem({
                label: 'Shapes',
                popup: shapes
            }));
            menu.startup();
            this.drawButtonNode.set('dropDown', menu);
            this._drawMenu = menu;
        }

    });

    return _AdvancedDrawMixin;
});
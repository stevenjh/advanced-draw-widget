Internal development notes

ADW should support developers being able to register external extensions to ADW.  These extensions might be used to provide a UI for sending the graphics
to a service on some server, add attributes to graphics, download graphics as shape files or geojson et.  Extensions can provide an optional UI
which will be displayed in the Extension pane of the main ADW interface.  Extensions do not need to provide a UI but must include a 'hasUI' flag 
to tell ADW to create a pane for it.

Extensions can subscribe to the following topics to receive notifications and act of relevant events

adw/graphic/draw/add - triggered when a new graphic has been added to a layer, carries new graphic as payload
adw/graphic/draw/delete - triggered when a graphic has been deleted from a layer, carries the deleted graphic as  payload
adw/graphic/symbol/edit - triggered when the symbol for a graphic has been updated, carries the graphic and json representation of previous symbol
adw/symbols/default/change - triggered when the default symbology has been updated, carries old and new symbology as payload
adw/load - triggered when ADW has finished loading
adw/unload - triggered when ADW before ADW unloads

10/26/14
Pushed new feature branch (adw-extension-topics).  Contains an ADWNotificationsMixin class that widgets can include with methods for
sending defined topic notifications.  It wraps topic and ADWTopicRegistry and includes a function to
enable logging of topic publications for testing purposes.

Applied the mixin to several ADW classes to enable sending of relevant ADW notifications including:
- Default symbols edited
- Graphic symbol edited
- Graphic added or removed
- Graphic geometry edited

Also implemented a fully passing test suite for ADWNotificationsMixin.




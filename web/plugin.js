(function () {
 goog.events.listenOnce(workspace, sync.api.Workspace.EventType.BEFORE_EDITOR_LOADED, 
function() {
  /**
 *
 * @param {goog.events.BrowserEvent} e The event to dispatch.
 */
sync.view.KeyHandler.prototype.dispatchEvent = function(e) {
  var be = e.getBrowserEvent();
  if ((goog.userAgent.WEBKIT || goog.userAgent.GECKO || goog.userAgent.EDGE_OR_IE) && e.keyCode === -1) {
    // On Safari, Chrome, IE & Edge, the keyCode is not identified correctly by the
    // Clojure library.
    e.keyCode = be.keyCode;
    if (e.charCode === 0 && be.charCode !== 0 && !e.ctrlKey && !e.metaKey) {
      // WA-1189: If the user presses the '/' key near left-Shift, the charCode is incorrectly
      // identified as '0'.
      // Also, do not set the charCode if the key seems to be a shortcut (e.g. Ctrl+Smth)
      e.charCode = be.charCode;
    }
  }

  // WA-1189: Some character like the 'Euro sign' on a Finnish keyboard,
  // are typed using shortcuts as 'AltGr. + E' or 'Ctrl +  Alt + E'.
  // In these cases, some browsers, set charCode = 0.
  if (e.ctrlKey && e.altKey) {
    // The event has both Ctrl & Alt pressed (or AltGr.)
    if (be.key && e.charCode === 0) {
      // We try to identify the char code from the original browser event,
      // even if closure library was not able to identify it.
      e.charCode = be.key.charCodeAt(0);
    } else {
      // The shortcut will not produce any character.
    }
  }

  // WA-2009: On Chrome on Mac, there was a problem when pressing Meta+B then Meta+I
  // without un-pressing the Meta key.
  if (this.oldLastKey_ === goog.events.KeyCodes.META && e.metaKey) {
    this.lastKey_ = this.oldLastKey_;
  }

  if (e.keyCode !== -1) {
    // On IE10, pressing ENTER results in a KEY event with keyCode -1. We ignore it.
    sync.view.KeyHandler.superClass_.dispatchEvent.call(this, e);
  }
};

});
})();
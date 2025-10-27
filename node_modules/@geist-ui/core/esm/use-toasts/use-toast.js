import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import { useEffect } from 'react';
import { defaultToastLayout, useGeistUIContext } from '../utils/use-geist-ui-context';
import { getId } from '../utils/collections';
var defaultToast = {
  delay: 2000,
  type: 'default'
};

var useToasts = function useToasts(layout) {
  var _useGeistUIContext = useGeistUIContext(),
      updateToasts = _useGeistUIContext.updateToasts,
      toasts = _useGeistUIContext.toasts,
      updateToastLayout = _useGeistUIContext.updateToastLayout,
      updateLastToastId = _useGeistUIContext.updateLastToastId;

  useEffect(function () {
    if (!layout) return;
    updateToastLayout(function () {
      return layout ? _extends({}, defaultToastLayout, layout) : defaultToastLayout;
    });
  }, []);

  var cancel = function cancel(internalId) {
    updateToasts(function (currentToasts) {
      return currentToasts.map(function (item) {
        if (item._internalIdent !== internalId) return item;
        return _extends({}, item, {
          visible: false
        });
      });
    });
    updateLastToastId(function () {
      return internalId;
    });
  };

  var removeAll = function removeAll() {
    updateToasts(function (last) {
      return last.map(function (toast) {
        return _extends({}, toast, {
          visible: false
        });
      });
    });
  };

  var findToastOneByID = function findToastOneByID(id) {
    return toasts.find(function (t) {
      return t.id === id;
    });
  };

  var removeToastOneByID = function removeToastOneByID(id) {
    updateToasts(function (last) {
      return last.map(function (toast) {
        if (toast.id !== id) return toast;
        return _extends({}, toast, {
          visible: false
        });
      });
    });
  };

  var setToast = function setToast(toast) {
    var internalIdent = "toast-".concat(getId());
    var delay = toast.delay || defaultToast.delay;

    if (toast.id) {
      var hasIdent = toasts.find(function (t) {
        return t.id === toast.id;
      });

      if (hasIdent) {
        throw new Error('Toast: Already have the same key: "ident"');
      }
    }

    updateToasts(function (last) {
      var newToast = {
        delay: delay,
        text: toast.text,
        visible: true,
        type: toast.type || defaultToast.type,
        id: toast.id || internalIdent,
        actions: toast.actions || [],
        _internalIdent: internalIdent,
        _timeout: window.setTimeout(function () {
          cancel(internalIdent);

          if (newToast._timeout) {
            window.clearTimeout(newToast._timeout);
            newToast._timeout = null;
          }
        }, delay),
        cancel: function (_cancel) {
          function cancel() {
            return _cancel.apply(this, arguments);
          }

          cancel.toString = function () {
            return _cancel.toString();
          };

          return cancel;
        }(function () {
          return cancel(internalIdent);
        })
      };
      return [].concat(_toConsumableArray(last), [newToast]);
    });
  };

  return {
    toasts: toasts,
    setToast: setToast,
    removeAll: removeAll,
    findToastOneByID: findToastOneByID,
    removeToastOneByID: removeToastOneByID
  };
};

export default useToasts;
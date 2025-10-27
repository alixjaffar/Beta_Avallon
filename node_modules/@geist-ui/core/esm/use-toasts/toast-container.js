import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _JSXStyle from "../styled-jsx.es.js";
import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import usePortal from '../utils/use-portal';
import useTheme from '../use-theme';
import { useGeistUIContext } from '../utils/use-geist-ui-context';
import ToastItem from './toast-item';
import useClasses from '../use-classes';
import { isLeftPlacement, isTopPlacement } from './helpers';
import useCurrentState from '../utils/use-current-state';

var ToastContainer = function ToastContainer() {
  var theme = useTheme();
  var portal = usePortal('toast');

  var _useCurrentState = useCurrentState(false),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      setHovering = _useCurrentState2[1],
      hoveringRef = _useCurrentState2[2];

  var _useGeistUIContext = useGeistUIContext(),
      toasts = _useGeistUIContext.toasts,
      updateToasts = _useGeistUIContext.updateToasts,
      toastLayout = _useGeistUIContext.toastLayout,
      lastUpdateToastId = _useGeistUIContext.lastUpdateToastId;

  var memoizedLayout = useMemo(function () {
    return toastLayout;
  }, [toastLayout]);
  var toastElements = useMemo(function () {
    return toasts.map(function (toast) {
      return /*#__PURE__*/React.createElement(ToastItem, {
        toast: toast,
        layout: memoizedLayout,
        key: toast._internalIdent
      });
    });
  }, [toasts, memoizedLayout]);
  var classNames = useMemo(function () {
    return useClasses('toasts', {
      top: isTopPlacement(toastLayout.placement),
      left: isLeftPlacement(toastLayout.placement)
    });
  }, [memoizedLayout]);

  var hoverHandler = function hoverHandler(isHovering) {
    setHovering(isHovering);

    if (isHovering) {
      return updateToasts(function (last) {
        return last.map(function (toast) {
          if (!toast.visible) return toast;
          toast._timeout && window.clearTimeout(toast._timeout);
          return _extends({}, toast, {
            timeout: null
          });
        });
      });
    }

    updateToasts(function (last) {
      return last.map(function (toast, index) {
        if (!toast.visible) return toast;
        toast._timeout && window.clearTimeout(toast._timeout);
        return _extends({}, toast, {
          _timeout: function () {
            var timer = window.setTimeout(function () {
              toast.cancel();
              window.clearTimeout(timer);
            }, toast.delay + index * 100);
            return timer;
          }()
        });
      });
    });
  };

  useEffect(function () {
    var index = toasts.findIndex(function (r) {
      return r._internalIdent === lastUpdateToastId;
    });
    var toast = toasts[index];
    if (!toast || toast.visible || !hoveringRef.current) return;
    var hasVisible = toasts.find(function (r, i) {
      return i < index && r.visible;
    });
    if (hasVisible || !hoveringRef.current) return;
    hoverHandler(false);
  }, [toasts, lastUpdateToastId]);
  useEffect(function () {
    var timeout = null;
    var timer = window.setInterval(function () {
      if (toasts.length === 0) return;
      timeout = window.setTimeout(function () {
        var allInvisible = !toasts.find(function (r) {
          return r.visible;
        });
        allInvisible && updateToasts(function () {
          return [];
        });
        timeout && clearTimeout(timeout);
      }, 350);
    }, 5000);
    return function () {
      timer && clearInterval(timer);
      timeout && clearTimeout(timeout);
    };
  }, [toasts]);
  if (!portal) return null;
  if (!toasts || toasts.length === 0) return null;
  return /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement("div", {
    onMouseEnter: function onMouseEnter() {
      return hoverHandler(true);
    },
    onMouseLeave: function onMouseLeave() {
      return hoverHandler(false);
    },
    className: _JSXStyle.dynamic([["622610754", [theme.layout.gap, theme.layout.gap, theme.layout.gap, theme.layout.gap]]]) + " " + (classNames || "")
  }, toastElements, /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "622610754",
    dynamic: [theme.layout.gap, theme.layout.gap, theme.layout.gap, theme.layout.gap]
  }, ".toasts.__jsx-style-dynamic-selector{position:fixed;width:auto;max-width:100%;right:".concat(theme.layout.gap, ";bottom:").concat(theme.layout.gap, ";z-index:2000;-webkit-transition:all 400ms ease;transition:all 400ms ease;box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}.top.__jsx-style-dynamic-selector{bottom:unset;-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;top:").concat(theme.layout.gap, ";}.left.__jsx-style-dynamic-selector{right:unset;left:").concat(theme.layout.gap, ";}"))), portal);
};

export default ToastContainer;
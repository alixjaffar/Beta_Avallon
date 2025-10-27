import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useMemo, useState } from 'react';
import { GeistUIContent, defaultToastLayout } from '../utils/use-geist-ui-context';
import ThemeProvider from './theme-provider';
import useCurrentState from '../utils/use-current-state';
import ToastContainer from '../use-toasts/toast-container';

var GeistProvider = function GeistProvider(_ref) {
  var themes = _ref.themes,
      themeType = _ref.themeType,
      children = _ref.children;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      lastUpdateToastId = _useState2[0],
      setLastUpdateToastId = _useState2[1];

  var _useCurrentState = useCurrentState([]),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 3),
      toasts = _useCurrentState2[0],
      setToasts = _useCurrentState2[1],
      toastsRef = _useCurrentState2[2];

  var _useCurrentState3 = useCurrentState(defaultToastLayout),
      _useCurrentState4 = _slicedToArray(_useCurrentState3, 3),
      toastLayout = _useCurrentState4[0],
      setToastLayout = _useCurrentState4[1],
      toastLayoutRef = _useCurrentState4[2];

  var updateToasts = function updateToasts(fn) {
    var nextToasts = fn(toastsRef.current);
    setToasts(nextToasts);
  };

  var updateToastLayout = function updateToastLayout(fn) {
    var nextLayout = fn(toastLayoutRef.current);
    setToastLayout(nextLayout);
  };

  var updateLastToastId = function updateLastToastId(fn) {
    setLastUpdateToastId(fn());
  };

  var initialValue = useMemo(function () {
    return {
      toasts: toasts,
      toastLayout: toastLayout,
      updateToasts: updateToasts,
      lastUpdateToastId: lastUpdateToastId,
      updateToastLayout: updateToastLayout,
      updateLastToastId: updateLastToastId
    };
  }, [toasts, toastLayout, lastUpdateToastId]);
  return /*#__PURE__*/React.createElement(GeistUIContent.Provider, {
    value: initialValue
  }, /*#__PURE__*/React.createElement(ThemeProvider, {
    themes: themes,
    themeType: themeType
  }, children, /*#__PURE__*/React.createElement(ToastContainer, null)));
};

export default GeistProvider;
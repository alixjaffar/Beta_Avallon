import React from 'react';
export var defaultToastLayout = {
  padding: '12px 16px',
  margin: '8px 0',
  width: '420px',
  maxWidth: '90vw',
  maxHeight: '75px',
  placement: 'bottomRight'
};
var defaultParams = {
  toasts: [],
  toastLayout: defaultToastLayout,
  updateToastLayout: function updateToastLayout(t) {
    return t;
  },
  updateToasts: function updateToasts(t) {
    return t;
  },
  lastUpdateToastId: null,
  updateLastToastId: function updateLastToastId() {
    return null;
  }
};
export var GeistUIContent = /*#__PURE__*/React.createContext(defaultParams);
export var useGeistUIContext = function useGeistUIContext() {
  return React.useContext(GeistUIContent);
};
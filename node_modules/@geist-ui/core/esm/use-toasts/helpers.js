import React from 'react';
import Button from '../button';
import { tuple } from '../utils/prop-types';
export var makeToastActions = function makeToastActions(actions, cancelHandle) {
  var handler = function handler(event, userHandler) {
    userHandler && userHandler(event, cancelHandle);
  };

  if (!actions || !actions.length) return null;
  return actions.map(function (action, index) {
    return /*#__PURE__*/React.createElement(Button, {
      auto: true,
      scale: 1 / 3,
      font: "13px",
      type: action.passive ? 'default' : 'secondary',
      key: "action-".concat(index),
      onClick: function onClick(event) {
        return handler(event, action.handler);
      }
    }, action.name);
  });
};
export var getColors = function getColors(palette, type) {
  var colors = {
    "default": palette.background,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error
  };
  var isDefault = !type || type === 'default';
  if (isDefault) return {
    bgColor: colors["default"],
    color: palette.foreground
  };
  /**
   * Prevent main color change in special types.
   * The color will only follow the theme when it is in the default type.
   */

  return {
    bgColor: colors[type],
    color: 'white'
  };
};
var toastPlacement = tuple('topLeft', 'topRight', 'bottomLeft', 'bottomRight');
export var isTopPlacement = function isTopPlacement(placement) {
  return "".concat(placement).toLowerCase().startsWith('top');
};
export var isLeftPlacement = function isLeftPlacement(placement) {
  return "".concat(placement).toLowerCase().endsWith('left');
};
export var getTranslateByPlacement = function getTranslateByPlacement(placement) {
  var translateInByPlacement = {
    topLeft: 'translate(-60px, -60px)',
    topRight: 'translate(60px, -60px)',
    bottomLeft: 'translate(-60px, 60px)',
    bottomRight: 'translate(60px, 60px)'
  };
  var translateOutByPlacement = {
    topLeft: 'translate(-50px, 15px) scale(0.85)',
    topRight: 'translate(50px, 15px) scale(0.85)',
    bottomLeft: 'translate(-50px, -15px) scale(0.85)',
    bottomRight: 'translate(50px, -15px) scale(0.85)'
  };
  return {
    enter: translateInByPlacement[placement],
    leave: translateOutByPlacement[placement]
  };
};
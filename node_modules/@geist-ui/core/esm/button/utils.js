import _extends from "@babel/runtime/helpers/esm/extends";
import _JSXStyle from "../styled-jsx.es.js";
import React from 'react';
import ButtonIcon from './button-icon';
import useClasses from '../use-classes';
export var getButtonChildrenWithIcon = function getButtonChildrenWithIcon(auto, children, icons) {
  var icon = icons.icon,
      iconRight = icons.iconRight;
  var hasIcon = icon || iconRight;
  var isRight = Boolean(iconRight);
  var paddingForAutoMode = auto ? "calc(var(--geist-ui-button-height) / 2 + var(--geist-ui-button-icon-padding) * .5)" : 0;
  var classes = useClasses('text', isRight ? 'right' : 'left');
  if (!hasIcon) return /*#__PURE__*/React.createElement("div", {
    className: "text"
  }, children);

  if (React.Children.count(children) === 0) {
    return /*#__PURE__*/React.createElement(ButtonIcon, {
      isRight: isRight,
      isSingle: true
    }, hasIcon);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ButtonIcon, {
    isRight: isRight
  }, hasIcon), /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["3568181479", [paddingForAutoMode, paddingForAutoMode]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "3568181479",
    dynamic: [paddingForAutoMode, paddingForAutoMode]
  }, ".left.__jsx-style-dynamic-selector{padding-left:".concat(paddingForAutoMode, ";}.right.__jsx-style-dynamic-selector{padding-right:").concat(paddingForAutoMode, ";}"))));
};
export var filterPropsWithGroup = function filterPropsWithGroup(props, config) {
  if (!config.isButtonGroup) return props;
  return _extends({}, props, {
    auto: true,
    shadow: false,
    ghost: config.ghost || props.ghost,
    type: config.type || props.type,
    disabled: config.disabled || props.disabled
  });
};
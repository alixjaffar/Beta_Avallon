'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styledJsx_cjs = require('../styled-jsx.cjs.js');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var _excluded = ["component", "children", "span", "offset", "className"];
var defaultProps = {
  span: 24,
  offset: 0,
  component: 'div',
  className: ''
};

var Col = function Col(_ref) {
  var component = _ref.component,
      children = _ref.children,
      span = _ref.span,
      offset = _ref.offset,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded);

  var Component = component;
  return /*#__PURE__*/React__default["default"].createElement(Component, _extends({}, props, {
    className: styledJsx_cjs.style.dynamic([["540733280", [100 / 24 * span, 100 / 24 * offset]]]) + " " + (props && props.className != null && props.className || "col ".concat(className))
  }), children, /*#__PURE__*/React__default["default"].createElement(styledJsx_cjs.style, {
    id: "540733280",
    dynamic: [100 / 24 * span, 100 / 24 * offset]
  }, ".col.__jsx-style-dynamic-selector{float:left;box-sizing:border-box;padding-left:calc(var(--row-gap) / 2);padding-right:calc(var(--row-gap) / 2);width:".concat(100 / 24 * span, "%;margin-left:").concat(100 / 24 * offset, "%;}")));
};

Col.defaultProps = defaultProps;
Col.displayName = 'GeistCol';
var Col$1 = Col;

exports["default"] = Col$1;

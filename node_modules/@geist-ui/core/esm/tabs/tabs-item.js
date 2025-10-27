import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _JSXStyle from "../styled-jsx.es.js";
import React, { useEffect, useMemo, useRef } from 'react';
import { useTabsContext } from './tabs-context';
import useTheme from '../use-theme';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  disabled: false
};

var TabsItemComponent = function TabsItemComponent(_ref) {
  var children = _ref.children,
      value = _ref.value,
      label = _ref.label,
      disabled = _ref.disabled;

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useTabsContext = useTabsContext(),
      register = _useTabsContext.register,
      currentValue = _useTabsContext.currentValue;

  var isActive = useMemo(function () {
    return currentValue === value;
  }, [currentValue, value]);

  var TabsInternalCell = function TabsInternalCell(_ref2) {
    var _useClasses;

    var onClick = _ref2.onClick,
        onMouseOver = _ref2.onMouseOver,
        activeClassName = _ref2.activeClassName,
        activeStyle = _ref2.activeStyle,
        hideBorder = _ref2.hideBorder;
    var theme = useTheme();
    var ref = useRef(null);

    var _useTabsContext2 = useTabsContext(),
        currentValue = _useTabsContext2.currentValue;

    var active = currentValue === value;
    var classes = useClasses('tab', (_useClasses = {
      active: active,
      disabled: disabled
    }, _defineProperty(_useClasses, activeClassName, active), _defineProperty(_useClasses, 'hide-border', hideBorder), _useClasses));

    var clickHandler = function clickHandler() {
      if (disabled) return;
      onClick && onClick(value);
    };

    return /*#__PURE__*/React.createElement("div", {
      ref: ref,
      role: "button",
      key: value,
      onMouseOver: onMouseOver,
      onClick: clickHandler,
      style: active ? activeStyle : {},
      "data-geist": "tab-item",
      className: _JSXStyle.dynamic([["2444688710", [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.875), SCALES.pr(0.55), SCALES.pb(0.875), SCALES.pl(0.55), SCALES.mt(0), SCALES.mr(0.2), SCALES.mb(0), SCALES.ml(0.2), SCALES.pl(0.28), SCALES.pr(0.28), theme.palette.foreground, theme.palette.foreground, theme.palette.foreground, theme.palette.accents_3, label]]]) + " " + (classes || "")
    }, label, /*#__PURE__*/React.createElement(_JSXStyle, {
      id: "2444688710",
      dynamic: [theme.palette.accents_5, SCALES.font(0.875), SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0.875), SCALES.pr(0.55), SCALES.pb(0.875), SCALES.pl(0.55), SCALES.mt(0), SCALES.mr(0.2), SCALES.mb(0), SCALES.ml(0.2), SCALES.pl(0.28), SCALES.pr(0.28), theme.palette.foreground, theme.palette.foreground, theme.palette.foreground, theme.palette.accents_3, label]
    }, ".tab.__jsx-style-dynamic-selector{position:relative;box-sizing:border-box;cursor:pointer;outline:0;text-transform:capitalize;white-space:nowrap;background-color:transparent;color:".concat(theme.palette.accents_5, ";-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:").concat(SCALES.font(0.875), ";line-height:normal;width:").concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0.875), " ").concat(SCALES.pr(0.55), " ").concat(SCALES.pb(0.875), " ").concat(SCALES.pl(0.55), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0.2), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0.2), ";z-index:1;--tabs-item-hover-left:calc(-1 * ").concat(SCALES.pl(0.28), ");--tabs-item-hover-right:calc(-1 * ").concat(SCALES.pr(0.28), ");}.tab.__jsx-style-dynamic-selector:hover{color:").concat(theme.palette.foreground, ";}.tab.__jsx-style-dynamic-selector:after{position:absolute;content:'';bottom:-1px;left:0;right:0;width:100%;height:2px;border-radius:4px;-webkit-transform:scaleX(0.75);-ms-transform:scaleX(0.75);transform:scaleX(0.75);background-color:").concat(theme.palette.foreground, ";-webkit-transition:opacity,-webkit-transform 200ms ease-in;-webkit-transition:opacity,transform 200ms ease-in;transition:opacity,transform 200ms ease-in;opacity:0;}.active.__jsx-style-dynamic-selector:after{opacity:1;-webkit-transform:scaleX(1);-ms-transform:scaleX(1);transform:scaleX(1);}.tab.__jsx-style-dynamic-selector svg{max-height:1em;margin-right:5px;}.tab.__jsx-style-dynamic-selector:first-of-type{margin-left:0;}.active.__jsx-style-dynamic-selector{color:").concat(theme.palette.foreground, ";}.disabled.__jsx-style-dynamic-selector{color:").concat(theme.palette.accents_3, ";cursor:not-allowed;}.hide-border.__jsx-style-dynamic-selector:before{display:block;content:").concat(label, ";font-weight:500;height:0;overflow:hidden;visibility:hidden;}.hide-border.__jsx-style-dynamic-selector:after{display:none;}.hide-border.active.__jsx-style-dynamic-selector{font-weight:500;}")));
  };

  TabsInternalCell.displayName = 'GeistTabsInternalCell';
  useEffect(function () {
    register && register({
      value: value,
      cell: TabsInternalCell
    });
  }, [value, label, disabled]);
  /* eslint-disable react/jsx-no-useless-fragment */

  return isActive ? /*#__PURE__*/React.createElement(React.Fragment, null, children) : null;
};

TabsItemComponent.defaultProps = defaultProps;
TabsItemComponent.displayName = 'GeistTabsItem';
var TabsItem = withScale(TabsItemComponent);
export default TabsItem;
/* eslint-enable */
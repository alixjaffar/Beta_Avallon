import _extends from "@babel/runtime/helpers/esm/extends";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["initialValue", "value", "hideDivider", "hideBorder", "children", "onChange", "className", "leftSpace", "highlight", "hoverHeightRatio", "hoverWidthRatio", "activeClassName", "activeStyle", "align"];
import _JSXStyle from "../styled-jsx.es.js";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useTheme from '../use-theme';
import { TabsContext } from './tabs-context';
import useScale, { withScale } from '../use-scale';
import Highlight from '../shared/highlight';
import { useRect } from '../utils/layouts';
import { isGeistElement } from '../utils/collections';
import useClasses from '../use-classes';
var defaultProps = {
  className: '',
  hideDivider: false,
  highlight: true,
  leftSpace: '12px',
  hoverHeightRatio: 0.7,
  hoverWidthRatio: 1.15,
  activeClassName: '',
  activeStyle: {},
  align: 'left'
};

var TabsComponent = function TabsComponent(_ref) {
  var userCustomInitialValue = _ref.initialValue,
      value = _ref.value,
      hideDivider = _ref.hideDivider,
      hideBorder = _ref.hideBorder,
      children = _ref.children,
      onChange = _ref.onChange,
      className = _ref.className,
      leftSpace = _ref.leftSpace,
      highlight = _ref.highlight,
      hoverHeightRatio = _ref.hoverHeightRatio,
      hoverWidthRatio = _ref.hoverWidthRatio,
      activeClassName = _ref.activeClassName,
      activeStyle = _ref.activeStyle,
      align = _ref.align,
      props = _objectWithoutProperties(_ref, _excluded);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      tabs = _useState2[0],
      setTabs = _useState2[1];

  var _useState3 = useState(userCustomInitialValue),
      _useState4 = _slicedToArray(_useState3, 2),
      selfValue = _useState4[0],
      setSelfValue = _useState4[1];

  var ref = useRef(null);

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      displayHighlight = _useState6[0],
      setDisplayHighlight = _useState6[1];

  var _useRect = useRect(),
      rect = _useRect.rect,
      setRect = _useRect.setRect;

  var register = function register(next) {
    setTabs(function (last) {
      var hasItem = last.find(function (item) {
        return item.value === next.value;
      });
      if (!hasItem) return [].concat(_toConsumableArray(last), [next]);
      return last.map(function (item) {
        if (item.value !== next.value) return item;
        return _extends({}, item, next);
      });
    });
  };

  var initialValue = useMemo(function () {
    return {
      register: register,
      currentValue: selfValue,
      inGroup: true,
      leftSpace: leftSpace
    };
  }, [selfValue, leftSpace]);
  useEffect(function () {
    if (typeof value === 'undefined') return;
    setSelfValue(value);
  }, [value]);

  var clickHandler = function clickHandler(value) {
    setSelfValue(value);
    onChange && onChange(value);
  };

  var tabItemMouseOverHandler = function tabItemMouseOverHandler(event) {
    if (!isGeistElement(event.target)) return;
    setRect(event, function () {
      return ref.current;
    });

    if (highlight) {
      setDisplayHighlight(true);
    }
  };

  return /*#__PURE__*/React.createElement(TabsContext.Provider, {
    value: initialValue
  }, /*#__PURE__*/React.createElement("div", _extends({}, props, {
    className: _JSXStyle.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]]) + " " + (props && props.className != null && props.className || useClasses('tabs', className) || "")
  }), /*#__PURE__*/React.createElement("header", {
    ref: ref,
    onMouseLeave: function onMouseLeave() {
      return setDisplayHighlight(false);
    },
    className: _JSXStyle.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]])
  }, /*#__PURE__*/React.createElement(Highlight, {
    rect: rect,
    visible: displayHighlight,
    hoverHeightRatio: hoverHeightRatio,
    hoverWidthRatio: hoverWidthRatio
  }), /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]]) + " " + (useClasses('scroll-container', {
      'hide-divider': hideDivider
    }) || "")
  }, tabs.map(function (_ref2) {
    var Cell = _ref2.cell,
        value = _ref2.value;
    return /*#__PURE__*/React.createElement(Cell, {
      key: value,
      onClick: clickHandler,
      onMouseOver: tabItemMouseOverHandler,
      activeClassName: activeClassName,
      activeStyle: activeStyle,
      hideBorder: hideBorder,
      className: _JSXStyle.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]])
    });
  }))), /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["1340018565", [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]]]) + " " + "content"
  }, children), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "1340018565",
    dynamic: [SCALES.font(1), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), align, theme.palette.border, leftSpace]
  }, ".tabs.__jsx-style-dynamic-selector{font-size:".concat(SCALES.font(1), ";width:").concat(SCALES.width(1, 'initial'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}header.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow-y:hidden;overflow-x:scroll;-webkit-scrollbar-width:none;-moz-scrollbar-width:none;-ms-scrollbar-width:none;scrollbar-width:none;position:relative;}.scroll-container.__jsx-style-dynamic-selector{width:100%;height:100%;-webkit-flex:1;-ms-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:").concat(align, ";-webkit-justify-content:").concat(align, ";-ms-flex-pack:").concat(align, ";justify-content:").concat(align, ";border-bottom:1px solid ").concat(theme.palette.border, ";padding-left:").concat(leftSpace, ";}header.__jsx-style-dynamic-selector::-webkit-scrollbar{display:none;}.hide-divider.__jsx-style-dynamic-selector{border-color:transparent;}.content.__jsx-style-dynamic-selector{padding-top:0.625rem;}"))));
};

TabsComponent.defaultProps = defaultProps;
TabsComponent.displayName = 'GeistTabs';
var Tabs = withScale(TabsComponent);
export default Tabs;
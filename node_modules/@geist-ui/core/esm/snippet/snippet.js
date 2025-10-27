import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["type", "filled", "children", "symbol", "toastText", "toastType", "text", "copy", "className"];
import _JSXStyle from "../styled-jsx.es.js";
import React, { useMemo, useRef } from 'react';
import useTheme from '../use-theme';
import { getStyles } from './styles';
import SnippetIcon from './snippet-icon';
import useClipboard from '../utils/use-clipboard';
import useToasts from '../use-toasts';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  filled: false,
  symbol: '$',
  toastText: 'Copied to clipboard!',
  toastType: 'success',
  copy: 'default',
  type: 'default',
  className: ''
};

var textArrayToString = function textArrayToString(text) {
  return text.reduce(function (pre, current) {
    if (!current) return pre;
    return pre ? "".concat(pre, "\n").concat(current) : current;
  }, '');
};

var SnippetComponent = function SnippetComponent(_ref) {
  var type = _ref.type,
      filled = _ref.filled,
      children = _ref.children,
      symbol = _ref.symbol,
      toastText = _ref.toastText,
      toastType = _ref.toastType,
      text = _ref.text,
      copyType = _ref.copy,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, _excluded);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var _useClipboard = useClipboard(),
      copy = _useClipboard.copy;

  var _useToasts = useToasts(),
      setToast = _useToasts.setToast;

  var ref = useRef(null);
  var isMultiLine = text && Array.isArray(text);
  var style = useMemo(function () {
    return getStyles(type, theme.palette, filled);
  }, [type, theme.palette, filled]);
  var showCopyIcon = useMemo(function () {
    return copyType !== 'prevent';
  }, [copyType]);
  var childText = useMemo(function () {
    if (isMultiLine) return textArrayToString(text);
    if (!children) return text;
    if (!ref.current) return '';
    return ref.current.textContent;
  }, [ref.current, children, text]);
  var symbolBefore = useMemo(function () {
    var str = symbol.trim();
    return str ? "".concat(str, " ") : '';
  }, [symbol]);

  var clickHandler = function clickHandler() {
    if (!childText || !showCopyIcon) return;
    copy(childText);
    if (copyType === 'silent') return;
    setToast({
      text: toastText,
      type: toastType
    });
  };

  return /*#__PURE__*/React.createElement("div", _extends({}, props, {
    className: _JSXStyle.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]]) + " " + (props && props.className != null && props.className || useClasses('snippet', className) || "")
  }), isMultiLine ? text.map(function (t, index) {
    return /*#__PURE__*/React.createElement("pre", {
      key: "snippet-".concat(index, "-").concat(t),
      className: _JSXStyle.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]])
    }, t);
  }) : /*#__PURE__*/React.createElement("pre", {
    ref: ref,
    className: _JSXStyle.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]])
  }, children || text), showCopyIcon && /*#__PURE__*/React.createElement("div", {
    onClick: clickHandler,
    className: _JSXStyle.dynamic([["2394272060", [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]]]) + " " + "copy"
  }, /*#__PURE__*/React.createElement(SnippetIcon, null)), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "2394272060",
    dynamic: [style.color, style.bgColor, style.border, theme.layout.radius, SCALES.font(0.8125), SCALES.pt(0.667), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.pt(0.667), SCALES.pr(2.667), SCALES.pb(0.667), SCALES.pl(0.667), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), style.color, symbolBefore, style.bgColor, isMultiLine ? 'flex-start' : 'center', theme.layout.radius, isMultiLine ? 'var(--snippet-padding-top)' : 0]
  }, ".snippet.__jsx-style-dynamic-selector{position:relative;max-width:100%;color:".concat(style.color, ";background-color:").concat(style.bgColor, ";border:1px solid ").concat(style.border, ";border-radius:").concat(theme.layout.radius, ";--snippet-font-size:").concat(SCALES.font(0.8125), ";--snippet-padding-top:").concat(SCALES.pt(0.667), ";font-size:var(--snippet-font-size);width:").concat(SCALES.width(1, 'initial'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0.667), " ").concat(SCALES.pr(2.667), " ").concat(SCALES.pb(0.667), " ").concat(SCALES.pl(0.667), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}pre.__jsx-style-dynamic-selector{margin:0;padding:0;border:none;background-color:transparent;color:").concat(style.color, ";font-size:inherit;}pre.__jsx-style-dynamic-selector::before{content:'").concat(symbolBefore, "';-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}pre.__jsx-style-dynamic-selector *{margin:0;padding:0;font-size:inherit;color:inherit;}.copy.__jsx-style-dynamic-selector{position:absolute;right:0;top:0;bottom:0;height:calc(100% - 2px);background-color:").concat(style.bgColor, ";display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:").concat(isMultiLine ? 'flex-start' : 'center', ";-webkit-box-align:").concat(isMultiLine ? 'flex-start' : 'center', ";-ms-flex-align:").concat(isMultiLine ? 'flex-start' : 'center', ";align-items:").concat(isMultiLine ? 'flex-start' : 'center', ";width:calc(3.281 * var(--snippet-font-size));color:inherit;-webkit-transition:opacity 150ms ease 0s;transition:opacity 150ms ease 0s;border-radius:").concat(theme.layout.radius, ";cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding-top:").concat(isMultiLine ? 'var(--snippet-padding-top)' : 0, ";opacity:0.65;}.copy.__jsx-style-dynamic-selector:hover{opacity:1;}")));
};

SnippetComponent.defaultProps = defaultProps;
SnippetComponent.displayName = 'GeistSnippet';
var Snippet = withScale(SnippetComponent);
export default Snippet;
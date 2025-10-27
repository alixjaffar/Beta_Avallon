import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["children", "block", "className", "name", "classic"];
import _JSXStyle from "../styled-jsx.es.js";
import React, { useMemo } from 'react';
import useScale, { withScale } from '../use-scale';
import useTheme from '../use-theme';
import { addColorAlpha } from '../utils/color';
var defaultProps = {
  block: false,
  className: '',
  name: '',
  classic: false
};

var CodeComponent = function CodeComponent(_ref) {
  var children = _ref.children,
      block = _ref.block,
      className = _ref.className,
      name = _ref.name,
      classic = _ref.classic,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var theme = useTheme();

  var _useMemo = useMemo(function () {
    if (!classic) return {
      border: theme.palette.accents_1,
      background: addColorAlpha(theme.palette.accents_1, 0.75)
    };
    return {
      border: theme.palette.accents_2,
      background: theme.palette.background
    };
  }, [classic, theme.palette]),
      background = _useMemo.background,
      border = _useMemo.border;

  if (!block) return /*#__PURE__*/React.createElement("code", props, children);
  return /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]]) + " " + "pre"
  }, name && /*#__PURE__*/React.createElement("header", {
    className: _JSXStyle.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]])
  }, /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]]) + " " + "name"
  }, name)), /*#__PURE__*/React.createElement("pre", _extends({}, props, {
    className: _JSXStyle.dynamic([["2383620185", [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]]]) + " " + (props && props.className != null && props.className || className || "")
  }), children), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "2383620185",
    dynamic: [border, SCALES.font(0.875), SCALES.width(1, 'initial'), SCALES.height(1, 'auto'), SCALES.mt(1.3), SCALES.mr(0), SCALES.mb(1.3), SCALES.ml(0), theme.layout.radius, background, SCALES.pt(1.1), SCALES.pr(1), SCALES.pb(1.1), SCALES.pl(1), theme.layout.radius, theme.palette.accents_2, theme.palette.accents_2, theme.palette.accents_5, SCALES.font(0.8125), SCALES.font(0.32), SCALES.font(0.5), SCALES.font(0.32), SCALES.font(0.5), theme.layout.radius, theme.layout.radius]
  }, ".pre.__jsx-style-dynamic-selector{max-width:100%;border:1px solid ".concat(border, ";font-size:").concat(SCALES.font(0.875), ";width:").concat(SCALES.width(1, 'initial'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(1.3), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(1.3), " ").concat(SCALES.ml(0), ";border-radius:").concat(theme.layout.radius, ";background-color:").concat(background, ";}pre.__jsx-style-dynamic-selector{max-width:100%;font-size:inherit;border:none;margin:0;line-height:1.5em;padding:").concat(SCALES.pt(1.1), " ").concat(SCALES.pr(1), " ").concat(SCALES.pb(1.1), " ").concat(SCALES.pl(1), ";}.dark.__jsx-style-dynamic-selector{color:white;background:black;}.dark.__jsx-style-dynamic-selector code.__jsx-style-dynamic-selector{color:white;}header.__jsx-style-dynamic-selector{height:auto;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;border-radius:").concat(theme.layout.radius, ";background-color:transparent;}.name.__jsx-style-dynamic-selector{border:1px solid ").concat(theme.palette.accents_2, ";background-color:").concat(theme.palette.accents_2, ";color:").concat(theme.palette.accents_5, ";height:auto;line-height:1.35em;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:").concat(SCALES.font(0.8125), ";padding:").concat(SCALES.font(0.32), " ").concat(SCALES.font(0.5), " ").concat(SCALES.font(0.32), " ").concat(SCALES.font(0.5), ";width:auto;border-top-left-radius:calc(").concat(theme.layout.radius, " - 1px);border-bottom-right-radius:").concat(theme.layout.radius, ";}")));
};

CodeComponent.defaultProps = defaultProps;
CodeComponent.displayName = 'GeistCode';
var Code = withScale(CodeComponent);
export default Code;
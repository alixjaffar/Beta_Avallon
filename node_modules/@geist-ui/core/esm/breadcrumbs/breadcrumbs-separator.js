import _JSXStyle from "../styled-jsx.es.js";
import React from 'react';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  className: ''
};

var Separator = function Separator(_ref) {
  var children = _ref.children,
      className = _ref.className;

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses('separator', className);
  return /*#__PURE__*/React.createElement("div", {
    className: _JSXStyle.dynamic([["1571781185", [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0.5), SCALES.mb(0), SCALES.ml(0.5)]]]) + " " + (classes || "")
  }, children, /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "1571781185",
    dynamic: [SCALES.width(1, 'auto'), SCALES.height(1, 'auto'), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.mt(0), SCALES.mr(0.5), SCALES.mb(0), SCALES.ml(0.5)]
  }, ".separator.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:".concat(SCALES.width(1, 'auto'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0.5), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0.5), ";}")));
};

Separator.defaultProps = defaultProps;
Separator.displayName = 'GeistBreadcrumbsSeparator';
var BreadcrumbsSeparator = withScale(Separator);
export default BreadcrumbsSeparator;
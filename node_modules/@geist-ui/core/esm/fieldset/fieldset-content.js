import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["className", "children"];
import _JSXStyle from "../styled-jsx.es.js";
import React from 'react';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  className: ''
};

var FieldsetContentComponent = function FieldsetContentComponent(_ref) {
  var className = _ref.className,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var classes = useClasses('content', className);
  return /*#__PURE__*/React.createElement("div", _extends({}, props, {
    className: _JSXStyle.dynamic([["2403982542", [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1.3), SCALES.pr(1.3), SCALES.pb(1.3), SCALES.pl(1.3), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "2403982542",
    dynamic: [SCALES.width(1, '100%'), SCALES.height(1, 'auto'), SCALES.pt(1.3), SCALES.pr(1.3), SCALES.pb(1.3), SCALES.pl(1.3), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0)]
  }, ".content.__jsx-style-dynamic-selector{width:".concat(SCALES.width(1, '100%'), ";height:").concat(SCALES.height(1, 'auto'), ";padding:").concat(SCALES.pt(1.3), " ").concat(SCALES.pr(1.3), " ").concat(SCALES.pb(1.3), " ").concat(SCALES.pl(1.3), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";}.content.__jsx-style-dynamic-selector > *:first-child{margin-top:0;}.content.__jsx-style-dynamic-selector > *:last-child{margin-bottom:0;}")));
};

FieldsetContentComponent.defaultProps = defaultProps;
FieldsetContentComponent.displayName = 'GeistFieldsetContent';
var FieldsetContent = withScale(FieldsetContentComponent);
export default FieldsetContent;
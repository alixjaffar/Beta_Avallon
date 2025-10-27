import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["href", "color", "underline", "children", "className", "block", "icon"];
import _JSXStyle from "../styled-jsx.es.js";
import React from 'react';
import useTheme from '../use-theme';
import LinkIcon from './icon';
import { addColorAlpha } from '../utils/color';
import useScale, { withScale } from '../use-scale';
import useClasses from '../use-classes';
var defaultProps = {
  href: '',
  color: false,
  icon: false,
  underline: false,
  block: false,
  className: ''
};
var LinkComponent = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var href = _ref.href,
      color = _ref.color,
      underline = _ref.underline,
      children = _ref.children,
      className = _ref.className,
      block = _ref.block,
      icon = _ref.icon,
      props = _objectWithoutProperties(_ref, _excluded);

  var theme = useTheme();

  var _useScale = useScale(),
      SCALES = _useScale.SCALES;

  var linkColor = color || block ? theme.palette.link : 'inherit';
  var hoverColor = color || block ? theme.palette.successLight : 'inherit';
  var decoration = underline ? 'underline' : 'none';
  var classes = useClasses('link', {
    block: block
  }, className);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, props, {
    ref: ref,
    className: _JSXStyle.dynamic([["442871747", [linkColor, block ? theme.layout.radius : 0, SCALES.font(1, 'inherit'), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.pt(0.125), SCALES.pr(0.25), SCALES.pb(0.125), SCALES.pl(0.25), SCALES.mt(0), SCALES.mr(-0.125), SCALES.mb(0), SCALES.ml(-0.125), decoration, block ? addColorAlpha(theme.palette.link, 0.1) : 'unset', hoverColor]]]) + " " + (props && props.className != null && props.className || classes || "")
  }), children, icon && /*#__PURE__*/React.createElement(LinkIcon, null), /*#__PURE__*/React.createElement(_JSXStyle, {
    id: "442871747",
    dynamic: [linkColor, block ? theme.layout.radius : 0, SCALES.font(1, 'inherit'), SCALES.width(1, 'fit-content'), SCALES.height(1, 'auto'), SCALES.mt(0), SCALES.mr(0), SCALES.mb(0), SCALES.ml(0), SCALES.pt(0), SCALES.pr(0), SCALES.pb(0), SCALES.pl(0), SCALES.pt(0.125), SCALES.pr(0.25), SCALES.pb(0.125), SCALES.pl(0.25), SCALES.mt(0), SCALES.mr(-0.125), SCALES.mb(0), SCALES.ml(-0.125), decoration, block ? addColorAlpha(theme.palette.link, 0.1) : 'unset', hoverColor]
  }, ".link.__jsx-style-dynamic-selector{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:baseline;-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline;line-height:inherit;color:".concat(linkColor, ";-webkit-text-decoration:none;text-decoration:none;border-radius:").concat(block ? theme.layout.radius : 0, ";-webkit-transition:color 200ms ease 0ms;transition:color 200ms ease 0ms;font-size:").concat(SCALES.font(1, 'inherit'), ";width:").concat(SCALES.width(1, 'fit-content'), ";height:").concat(SCALES.height(1, 'auto'), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(0), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(0), ";padding:").concat(SCALES.pt(0), " ").concat(SCALES.pr(0), " ").concat(SCALES.pb(0), " ").concat(SCALES.pl(0), ";}.block.__jsx-style-dynamic-selector{padding:").concat(SCALES.pt(0.125), " ").concat(SCALES.pr(0.25), " ").concat(SCALES.pb(0.125), " ").concat(SCALES.pl(0.25), ";margin:").concat(SCALES.mt(0), " ").concat(SCALES.mr(-0.125), " ").concat(SCALES.mb(0), " ").concat(SCALES.ml(-0.125), ";}.link.__jsx-style-dynamic-selector:hover,.link.__jsx-style-dynamic-selector:active,.link.__jsx-style-dynamic-selector:focus{-webkit-text-decoration:").concat(decoration, ";text-decoration:").concat(decoration, ";}.link.__jsx-style-dynamic-selector:hover{background-color:").concat(block ? addColorAlpha(theme.palette.link, 0.1) : 'unset', ";color:").concat(hoverColor, ";}")));
});
LinkComponent.defaultProps = defaultProps;
LinkComponent.displayName = 'GeistLink';
var Link = withScale(LinkComponent);
export default Link;
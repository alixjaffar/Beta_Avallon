export var transformDataSource = function transformDataSource(src) {
  var left = "".concat(src).slice(0, 4);

  if (encodeURIComponent(left) === '%3Csvg') {
    return "data:image/svg+xml;utf8,".concat(src);
  }

  return src;
};
export var getHostFromUrl = function getHostFromUrl(url) {
  try {
    return new URL(url).host;
  } catch (e) {
    return url;
  }
};
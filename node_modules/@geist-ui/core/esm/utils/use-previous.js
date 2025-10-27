import { useEffect, useRef } from 'react';

var usePrevious = function usePrevious(state) {
  var ref = useRef(null);
  useEffect(function () {
    ref.current = state;
  });
  return ref ? ref.current : null;
};

export default usePrevious;
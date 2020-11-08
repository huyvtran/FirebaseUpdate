const callOnce = (functionTobeCalled, interval = 3000) => {
  let isCalled = false;
  let timer;
  return (...args) => {
    if (!isCalled) {
      isCalled = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        isCalled = false;
      }, interval);
      return functionTobeCalled(...args);
    }
    return;
  };
};

export { callOnce };

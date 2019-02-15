export const awaitFilter = (callback, asyncFn) => ({
  use,
  result,
  error,
  args
}) => {
  if (error) {
    return {
      error: callback.direct({
        use: false,
        error,
        args
      }),
      use: false,
      args
    }
  } else if (use) {
    return {
      result: Promise.resolve(result)
        .then(r => asyncFn(r, args))
        .then(use => ({
          use: !!use,
          result,
          args
        }))
        .catch(e => ({
          use,
          error: e,
          args
        }))
        .then(callback.direct),
      use,
      args
    }
  } else {
    return {
      result: callback.direct({
        use,
        result,
        args
      }),
      use,
      args
    }
  }
}

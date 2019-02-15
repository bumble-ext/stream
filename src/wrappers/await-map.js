export const awaitMap = (callback, asyncFn) => ({
  use,
  result,
  error,
  args
}) => {
  if (error) {
    return {
      error: callback.direct({
        use,
        error,
        args
      }),
      use,
      args
    }
  } else if (use) {
    return {
      result: Promise.resolve(result)
        .then(r => asyncFn(r, args))
        .then(r => ({ use, args, result: r }))
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

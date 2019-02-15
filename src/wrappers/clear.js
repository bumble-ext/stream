export const clear = clearFn => predFn => ({
  use,
  error,
  result,
  args
}) => {
  try {
    if (use && !error && predFn(result, args)) {
      clearFn()
    }

    return { use, result, error, args }
  } catch (error) {
    return { error, use, args }
  }
}

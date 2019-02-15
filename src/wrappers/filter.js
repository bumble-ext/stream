export const filter = predFn => ({
  use,
  error,
  result,
  args
}) => {
  try {
    if (error) {
      return { use: false, result, error, args }
    } else if (use) {
      return {
        use: predFn(result, args),
        result,
        args
      }
    } else {
      return { use, result, error, args }
    }
  } catch (error) {
    return { error, use, args }
  }
}

export const forEach = forEachFn => ({
  use,
  result,
  error,
  args
}) => {
  try {
    if (use && !error) {
      forEachFn(result, args)
    }

    return { use, result, error, args }
  } catch (error) {
    return { error, use, args }
  }
}

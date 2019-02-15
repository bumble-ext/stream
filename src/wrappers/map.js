export const map = mapFn => ({ use, result, error, args }) => {
  try {
    if (use && !error) {
      return {
        use,
        args,
        result: mapFn(result, args)
      }
    } else {
      return { use, result, error, args }
    }
  } catch (error) {
    return { error, use, args }
  }
}

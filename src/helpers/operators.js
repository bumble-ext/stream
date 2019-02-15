/* ------------------ BOOLEAN ----------------- */

export const not = fn => (...x) => !fn(...x)
export const bool = fn => (...x) => !!fn(...x)

/* ------------------ CONSOLE ----------------- */

export const log = msg => x => {
  console.log(msg, x)
  return x
}

export const error = msg => x => {
  console.error(msg, x)
  return x
}

const path = p => obj => {
  if (p.length === 0) {
    return obj
  }
  const [x, ...xs] = p

  return isUndefined(obj) ? undefined : path(xs)(prop(x)(obj))
}
const prop = p => x => isUndefined(x) ? undefined : x[p]
const isUndefined = x => typeof x === 'undefined'

module.exports = {
  path
}

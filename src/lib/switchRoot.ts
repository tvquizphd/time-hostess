const findParams = (staticPaths, slug) => {
  return staticPaths.find(({params}) => {
    if (slug.length === params.slug.length) {
      return params.slug.every((v,i)=> v === slug[i]);
    }
    return false
  })?.params || null
}

const switchRoot = (staticPaths, slug) => {
  return findParams(staticPaths, slug)
}

export {
  switchRoot
}

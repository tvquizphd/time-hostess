import i18nConfig from '../../i18.next.config'

const cutI18nPaths = (slug) => {
  const {locales, defaultLocale} = i18nConfig.i18n
  if (slug.length && locales.includes(slug[0])) {
    return {
      locale: slug[0],
      slug: slug.slice(1)
    }
  }
  return {
     locale: defaultLocale,
     slug
  }
}

const getI18nPaths = (params) => {
  const {locales, defaultLocale} = i18nConfig.i18n
  return locales.map((locale) => {
    const isDefault = locale == defaultLocale
    const prefix = isDefault ? [] : [locale]
    return {
      params: {
        ...params,
        slug: prefix.concat(params.slug)
      }
    }
  })
}

export {
  cutI18nPaths,
  getI18nPaths 
}

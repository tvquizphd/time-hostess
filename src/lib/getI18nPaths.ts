import i18nConfig from '../../i18.next.config'

const remapLocale = (locale) => {
  return {
    'en-US': 'en'
  }[locale] || locale
}

const getI18nPaths = (params) => {
  const {locales, defaultLocale} = i18nConfig.i18n
  return locales.map((locale) => {
    const isDefaultLocale = locale == defaultLocale
    const prefix = isDefaultLocale ? [] : [locale]
    return {
      params: {
        ...params,
        publicSlug: params.publicSlug,
        slug: prefix.concat(params.publicSlug)
      }
    }
  })
}

export {
  getI18nPaths 
}

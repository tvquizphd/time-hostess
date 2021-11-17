import i18nConfig from '../../i18.next.config'

const getShortLocale = (locale) => {
  return {
    'en-US': 'en',
    'en-UK': 'en'
  }[locale] || locale
}

const getPrefix = (locale) => {
  const {defaultLocale} = i18nConfig.i18n
  const isDefaultLocale = locale == defaultLocale
  return isDefaultLocale ? [] : [locale]
}

const getI18nPaths = (params) => {
  const {locales} = i18nConfig.i18n
  return locales.map((locale) => {
    const prefix = getPrefix(locale)
    const shortPrefix = getPrefix(getShortLocale(locale))
    return {
      params: {
        ...params,
        slug: prefix.concat(params.slug),
        shortSlug: shortPrefix.concat(params.slug)
      }
    }
  })
}

export {
  getI18nPaths 
}

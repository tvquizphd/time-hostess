import Page from '../components/page'

function staticRegenerationError(message) {
  this.message = message
  this.name = 'staticRegenerationError'
}

const impossibleRouteMessage = (publicSlug) => {
  return `No route possible for /${publicSlug.join('/')}`
}

const switchFirst = (publicSlug) => {
  switch(publicSlug[0]) {
    case 'test':
      return Page
    default:
      throw new staticRegenerationError(
        impossibleRouteMessage(publicSlug)
      )
  }
}

const switchRoot = (publicSlug) => {

  switch(publicSlug.length) {
    case 0:
      return Page
    case 1:
      return switchFirst(publicSlug)
    default:
      throw new staticRegenerationError(
        impossibleRouteMessage(publicSlug)
      )
  }
}

export {
  switchRoot
}

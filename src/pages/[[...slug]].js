import { select } from 'unist-util-select'
import { findSentimentGuide } from '../lib/guide'
import { useRouter } from 'next/router'
import Page from '../components/page'
import process from 'process'
import path from 'path'
// internationalization
import { 
  cutI18nPaths, getI18nPaths
} from '../lib/getI18nPaths'
// Use filesystem only in getStaticProps
import dotenv from 'dotenv'
import fs from 'fs'
import {
  retextSentiment
} from 'hot-cold-retext'

function staticRegenerationError(message) {
  this.message = message
  this.name = 'staticRegenerationError'
}

const impossibleRouteMessage = (slug) => {
  return `No route possible for /${slug.join('/')}`
}

const switchFirst = (slug) => {
  switch(slug[0]) {
    case 'test':
      return Page
    default:
      throw new staticRegenerationError(
        impossibleRouteMessage(slug)
      )
  }
}

const switchRoot = (_slug) => {

  const {slug, locale}  = cutI18nPaths(_slug)

  switch(slug.length) {
    case 0:
      return Page
    case 1:
      return switchFirst(slug)
    default:
      throw new staticRegenerationError(
        impossibleRouteMessage(slug)
      )
  }
}

export const getStaticPaths = () => {
  return {
    paths: [
      ...getI18nPaths({ slug: [] }),
      ...getI18nPaths({ slug: ['test'] })
    ],
    fallback: false
  }
}

const makePropsDefault = (body) => {
  return {
    body,
    SECRET: null
  }
}

export const getStaticProps = async (context) => {

  const revalidate = 60
  const { locale, params } = context
  const slug = params.slug || []

  // Handle ISR of invalid pages
  try {
    switchRoot(slug)
  }
  catch {
    return {
      notFound: true,
      revalidate
    }
  }

  // Load environment
  const {error} = dotenv.config()
  if (error) {
    throw new staticRegenerationError(
      `Cannot load .env at ${error.path}`
    )
  }
  const { SECRET } = process.env

  const filePath = path.join(
    './public/', ...slug, 'index.html'
  )
  const text = fs.readFileSync(filePath, {
    encoding:'utf8', flag:'r'
  })
  // Run html page through all of the guides
  const sentimentGuide = findSentimentGuide({
    lang: 'en',
    steps: [
			[retextSentiment, {}]
    ]
  })
  const root = await sentimentGuide(text)
  const body = select('[tagName=body]', root)
  body.tagName = "div"

  return {
    props: {
      ...makePropsDefault(body),
      SECRET: SECRET || null
    },
    revalidate
  }
}

const Index = (props) => {
  const router = useRouter()
  const slug = router.query.slug || []

  // Render any component given by switchRoot
  const Component = switchRoot(slug)
  return <Component {...props}/>
}

export default Index

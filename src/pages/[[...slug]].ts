import React from 'react'
import { select } from 'unist-util-select'
import { useRouter } from 'next/router'
import { switchRoot } from '../lib/switchRoot'
import process from 'process'
import path from 'path'
// internationalization
import { 
  getI18nPaths
} from '../lib/getI18nPaths'
// Use filesystem only in getStaticProps
import { findSentimentGuide } from '../lib/guide'
import dotenv from 'dotenv'
import fs from 'fs'

export const getStaticPaths = () => {
  return {
    paths: [
      ...getI18nPaths({ publicSlug: [] }),
      ...getI18nPaths({ publicSlug: ['test'] })
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
  const publicContent = ['public', 'content']
  const publicSlug = params.publicSlug || []

  // Handle ISR of invalid pages
  try {
    switchRoot(publicSlug)
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
    ...publicContent, ...publicSlug, 'index.html'
  )
  const text = fs.readFileSync(filePath, {
    encoding:'utf8', flag:'r'
  })
  const lang = 'en'
  // Run html page through all of the guides
  const sentimentGuide = findSentimentGuide({lang})
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
  const publicSlug = router.query.publicSlug || []

  // Render any component given by switchRoot
  const Component = switchRoot(publicSlug)
  return React.createElement(Component, props)
}

export default Index

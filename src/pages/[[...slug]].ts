import React from 'react'
import { useRouter } from 'next/router'
import { select } from 'unist-util-select'
import { switchRoot } from '../lib/switchRoot'
import process from 'process'
import path from 'path'
// internationalization
import { 
  getI18nPaths
} from '../lib/getI18nPaths'
import MultiplePersonalityPage from '../components/multiplePersonalityPage'
import BipolarPage from '../components/bipolarPage'
// Use filesystem only in getStaticProps
import {
  findGuide,
  findProps
} from '../lib/guide'
import dotenv from 'dotenv'
import fs from 'fs'
// Types
import type {
  Entries
} from '../lib/util'
import type {
  HastParent
} from 'tree-guards'
import type {
  PropOptions,
  FoundProps
} from '../lib/guide'

type GuideAPI = FoundProps 
type PropNames<T> = (keyof T)[]
type AllEntries = Entries<FoundProps>

type SomeOptions<T> = PropOptions & {
  propNames: PropNames<T>
}

interface FilterProps {
  (n: PropNames<GuideAPI>, e: AllEntries): Entries<GuideAPI>;
}
interface FindSomeProps {
  (params: SomeOptions<GuideAPI>): GuideAPI;
}

function staticRegenerationError(message) {
  this.message = message
  this.name = 'staticRegenerationError'
}

const staticPaths = [
  ...getI18nPaths({ 
    page: BipolarPage,
    propNames: ['metric', 'keys'],
    guide: 'sentiment',
    slug: []
  }),
  ...getI18nPaths({
    page: MultiplePersonalityPage,
    propNames: ['metric', 'keys'],
    guide: 'personas',
    slug: ['test']
  })
]

const filterProps: FilterProps = (propNames, allEntries) => {
  const filter = ([key, _]) => {
    return propNames.includes(key)
  }
  return allEntries.filter(filter)
}

const findSomeProps: FindSomeProps  = ({propNames, ...params}) => {
  const allEntries = Object.entries(findProps(params)) as AllEntries
  return Object.fromEntries(filterProps(propNames, allEntries))
}

export const getStaticPaths = () => {
  return {
    paths: staticPaths,
    fallback: false
  }
}

export const getStaticProps = async (context) => {

  const revalidate = 60
  const slug = context.params.slug || []

  // Handle ISR of invalid pages
  const params = switchRoot(staticPaths, slug) || {}
  const guide = await findGuide(params)
  if (!guide) {
    return {
      notFound: true,
      revalidate
    }
  }
  const publicContent = [
    'public', 'content',
    ...params.shortSlug, 'index.html'
  ]

  // Load environment
  const {error} = dotenv.config()
  if (error) {
    throw new staticRegenerationError(`Cannot load .env`)
  }
  const { SECRET } = process.env

  const filePath = path.join(...publicContent)
  const text = fs.readFileSync(filePath, {
    encoding:'utf8', flag:'r'
  })
  // Run html page through all of the guides
  const root = await guide(text)
  const body = select('[tagName=body]', root) as HastParent
  body.tagName = "div"

  return {
    props: {
      ...findSomeProps(params),
      SECRET: SECRET || null,
      body: body
    },
    revalidate
  }
}

const Index = (props) => {
  const router = useRouter()
  const slug = router.query.slug || []

  // Render any component given by switchRoot
  const {page} = switchRoot(staticPaths, slug)
  return React.createElement(page, props)
}

export default Index

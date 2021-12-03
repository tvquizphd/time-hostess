import {
  retextSentiment,
  makeRetextClassify
} from 'hot-cold-retext'
import fs from 'fs'
import path from 'path'
import { findHotColdGuide } from 'hot-cold-guide'
// Types
import type {
  UnaryFn
} from './util'

export type PropOptions = {
  guide: string 
}
type Key = {
  root: string | void,
  domain: string | void,
  value: string,
}
export type FoundProps = {
  keys: Key[]
}
type FindProps = UnaryFn<PropOptions, FoundProps>

const readFileSync = (path) => {
  return fs.readFileSync(path, {
    encoding:'utf8', flag:'r'
  })
}
const readExamples = (partialPath) => {
  const rootPath = ['public', 'training']
  const filePath = [...rootPath, ...partialPath]
  return readFileSync(path.join(...filePath)).split('\n')
}

const domainLists = {
  'personas': [{
    intents: {
      kenm: readExamples(['comedy', 'kenm.txt'])
    },
    domain: 'comedy',
    lang: 'en'
  }, {
    intents: {
      confucius: readExamples(['advice', 'confucius.txt']),
      laozi: readExamples(['advice', 'laozi.txt']),
      buddha: readExamples(['advice', 'buddha.txt'])
    },
    domain: 'advice',
    lang: 'en'
  }]
}

const makeKeyword = ({root, domain, value}) => {
  const scope = [
    root, domain, value
  ].filter(x=>!!x).join('.')
  return {
    input: `${scope}.hitMean`,
    weight: `${scope}.hitCount`,
    output: [value],
  }
}

const makeKeys = ({domains, root}) => {
  if (!domains) {
    return [{
      root: null,
      domain: null,
      value: root,
    }]
  }
  return [].concat(...domains.map(({domain, intents}) => {
    return Object.keys(intents).map((value) => {
      // Compute scope
      return {
        root, domain, value
      }
    })
  }))
}

const makeKeywords = (options) => {
  return makeKeys(options).map(makeKeyword)
}

const findRoot = ({guide}) => {
  if (guide in domainLists) {
    return 'classification'
  }
  return guide
}

const findPropsKeys = ({guide}) => {
  const domains = domainLists[guide] || null
  const root = findRoot({guide})
  return makeKeys({
    domains, root
  })
}

const findProps: FindProps = (params) => {
  return {
    keys: findPropsKeys(params)
  }
}

const findClassifyGuide = async ({domains}) => {
  const keywords = makeKeywords({
    domains, root: 'classification'
  }) 
  const retextClassify = await makeRetextClassify()
  return findHotColdGuide({
    steps: [
      [retextClassify, { domains }]
    ],
    keywords
  })
}

const findSentimentGuide = async ({lang}) => {
  return findHotColdGuide({
    steps: [
      [retextSentiment, {lang}]
    ],
    keywords: makeKeywords({
      domains: null, root: 'sentiment'
    }) 
  })
}

const findGuide = async ({guide}) => {
  const domains = domainLists[guide] || null
  if (!!domains) {
    return await findClassifyGuide({
      domains
    })
  }
  // Default to sentiment guide
  return await findSentimentGuide({
    lang: 'en'
  })
}

export {
  findGuide,
  findProps
}

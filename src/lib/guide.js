import { findHotColdGuide } from 'hot-cold-guide/lib/fromHast'

const findSentimentGuide = ({lang, steps}) => {
  return findHotColdGuide({
    lang,
    steps,
    keywords: [{
      input: 'sentiment.hitMean',
      weight: 'sentiment.hitCount',
      output: ['sentiment'],
    }]
  })
}

export {
  findSentimentGuide
}

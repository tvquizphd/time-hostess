import {
  retextSentiment
} from 'hot-cold-retext'
import { findHotColdGuide } from 'hot-cold-guide'

const findSentimentGuide = ({lang}) => {
  return findHotColdGuide({
    steps: [
      [retextSentiment, {lang}]
    ],
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

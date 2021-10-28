import fs from 'fs'
import { findHotColdGuide } from 'hot-cold-guide'

const readFileSync = (path) => {
  return fs.readFileSync(path, {
    encoding:'utf8', flag:'r'
  })
}

export const applyGuide = async (path) => {

  const enSentimentGuide = findHotColdGuide({
    keys: ['sentiment'],
    lang: 'en'
  })
  return await enSentimentGuide(readFileSync(path))

}

import {takeWeightedMean} from 'hot-cold-guide'

const extractGuidance = ({node, metric, weighKey, keys}) => {
  const defaultData = 0
  const resultList = keys.map((key) => {
    return {
      __w: weighKey(key),
      [metric]: defaultData,
      ...node?.data?.textData[key.value]
    }
  })
  return takeWeightedMean(resultList, metric, '__w').mean
}

export {
  extractGuidance
}

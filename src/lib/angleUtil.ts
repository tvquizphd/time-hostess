import {
  toRange,
  toDomain
} from './rangeSetter'
// Types
import type {
  Fn,
  UnaryFn
} from './util'

type Angle = number
type Float = number
type Vector = number[]
type Range<T> = Record<'min' | 'max', T>
type Between<T> = Record<'diff' | 'mean', T>

type VectorSimilarity = Fn<[Vector, Vector, Range<Float>], number>
type AngleBetween = UnaryFn<Range<Angle>, Between<Angle>>
type AngleRange = UnaryFn<Between<Angle>, Range<Angle>>

const modulo = (v, n) => {
  return ((v % n) + n) % n
}

const getPrevNext = (list, i) => {
  return {
    prev: list[modulo(i - 1, list.length)],
    next: list[modulo(i + 1, list.length)]
  }
}

const mod360 = (v) => {
  return modulo(v, 360)
}

const radianToAngle = (r) => {
  return 180 * r / Math.PI
}

const angleToRadian = (a) => {
  return a * Math.PI / 180
}

const radianDifference = (r1, r2) =>  {
  return Math.atan2(Math.sin(r1-r2), Math.cos(r1-r2))
}

const angleDifference = (a1, a2) =>  {
  const r1 = angleToRadian(a1)
  const r2 = angleToRadian(a2)
  const r3 = radianDifference(r1, r2)
  return mod360(radianToAngle(r3))
}

const angleRange:AngleRange = ({diff, mean}) => {
  return {
    min: angleDifference(mean, diff/2),
    max: angleDifference(mean, -diff/2)
  }
}

const angleBetween:AngleBetween = ({min, max}) => {
  const diff = angleDifference(max, min)
  return {
    diff, mean: angleDifference(max, diff/2)
  }
}

const takeAngleVector = (a) => {
  const rad = angleToRadian(a)
  return [Math.cos(rad), Math.sin(rad)]
}

const takeSum = (a, b) => a + b

const takeDot = (a, b) => {
  return a.map((_, i) => a[i] * b[i]).reduce(takeSum, 0)
}

const takeDist = (a) => {
  return Math.sqrt(a.map(x=> x ** 2).reduce(takeSum, 0))
}

const vectorSimilarity: VectorSimilarity = (v1, v2, range) => {
  const normalization = takeDist(v1) * takeDist(v2)
  const similarity = takeDot(v1, v2) / normalization
  if (normalization === 0) {
    return range.min
  }
  // Scale similarity to be within output range
  const positiveSimilarity = toDomain([-1, 1], similarity)
  return toRange([range.min, range.max], positiveSimilarity)
}

const distributeAngles = (num, min, max) => {
  const numArray = Array.from(Array(num).keys()) 
  return numArray.map((i) => {
    return toRange([min, max], (i + 0.5) / num)
  })
}

const compareVectorSimilarity = ([v1, v2], v3) => {
  const range = {min: 1, max: 0}
  return (
    vectorSimilarity(v1, v3, range) -
    vectorSimilarity(v2, v3, range)
  )
}

const sortVectorSimilarity = (list, vector) => {
  return [...list].sort((a, b) => {
    return compareVectorSimilarity([a.vector, b.vector], vector)
  })
}

export {
  modulo,
  getPrevNext,
  vectorSimilarity,
  takeAngleVector,
  angleDifference,
  angleRange,
  angleBetween,
  radianToAngle,
  angleToRadian,
  distributeAngles,
  sortVectorSimilarity
}

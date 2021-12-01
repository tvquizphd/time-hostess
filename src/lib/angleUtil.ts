import {
  toRange
} from './rangeSetter'
// Types
import type {
  Fn
} from './util'

type Angle = number
type Range = Record<'min' | 'max', number>
type AngleSimilarity = Fn<[Angle, Angle, Range], number>

const modulo = (v, n) => {
  return ((v % n) + n) % n
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
  return radianToAngle(r3)
}

const angleSimilarity: AngleSimilarity = (a1, a2, range) => {
  const cos = Math.cos(angleDifference(a1, a2))
  return toRange([range.min, range.max], cos)
}

const distributeAngles = (num, min, max) => {
  const numArray = Array.from(Array(num).keys()) 
  return numArray.map((i) => {
    return toRange([min, max], (i + 0.5) / num)
  })
}

const compareAngleDifference = ([a1, a2], a3) => {
  const diff1 = angleDifference(a1, a3)
  const diff2 = angleDifference(a2, a3)
  return Math.abs(diff1) - Math.abs(diff2)
}

const sortAngleDifference = (list, angle) => {
  return list.sort((a, b) => {
    return compareAngleDifference([a.angle, b.angle], angle)
  })
}

export {
  angleSimilarity,
  radianToAngle,
  angleToRadian,
  distributeAngles,
  sortAngleDifference
}

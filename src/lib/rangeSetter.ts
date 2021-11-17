import {
  Fn, UnaryFn
} from './util'
/*
 * Map domain of [0 to 1] to range of [Y to 0]
 */
type Point = [number, number]
type Slope = Fn<[Point, Point], number>
type Clamp = Fn<[Point, number], number>
type Num2to1 = Fn<[number, number], number>
type Setter = UnaryFn<number, void>
type SetterOptions = {
  limit: number,
  setter: Setter
}
type MakeSetter = UnaryFn<SetterOptions, Setter>

const slope:Slope = ([x0, y0], [x1, y1]) => {
  return (y1 - y0) / (x1 - x0)
}
const clamp:Clamp = ([min, max], value) => {
  return Math.max(min, Math.min(max, value))
}

const domainToRange = ({b, m, x}) => {
  return m * x + b
}
const rangeToDomain = ({b, m, y}) => {
  return ( y - b ) / m
}
const toRange:Num2to1 = (yIntercept, xInput) => {
  const x = clamp([0, 1], xInput)
  const m = slope([0, yIntercept], [1, 0])
  return domainToRange({m, x, b: yIntercept})
}
const toDomain:Num2to1 = (yIntercept, y) => {
  const m = slope([0, yIntercept], [1, 0])
  const x = rangeToDomain({m, y, b: yIntercept})
  return clamp([0, 1], x)
}

const makeRangeSetter:MakeSetter = ({limit, setter}) => {
  return (x) => {
    setter(toRange(limit, x))
  }
}

export {
  toDomain,
  makeRangeSetter
}

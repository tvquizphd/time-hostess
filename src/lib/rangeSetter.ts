import {
  Fn, UnaryFn
} from './util'
/*
 * Map domain of [0 to 1] to range of [Y to 0]
 */
export type Point = [number, number]
type Slope = Fn<[Point, Point], number>
type SlopeFixed = UnaryFn<Point, number>
type Clamp = Fn<[Point, number], number>
type Num2to1 = Fn<[Point, number], number>
type Setter = UnaryFn<number, void>
type SetterOptions = {
  limit: Point,
  setter: Setter
}
type MakeSetter = UnaryFn<SetterOptions, Setter>

const slope:Slope = ([x0, y0], [x1, y1]) => {
  return (y1 - y0) / (x1 - x0)
}
const slopeFixed:SlopeFixed = ([y0, y1]) => {
  return slope([0, y0], [1, y1])
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
const toRange:Num2to1 = (yLimit, xInput) => {
  const a = ({
    b: yLimit[0],
    x: clamp([0, 1], xInput),
    m: slopeFixed(yLimit)
  })
  return domainToRange(a)
}
const toDomain:Num2to1 = (yLimit, yInput) => {
  const x = rangeToDomain({
    b: yLimit[0],
    y: yInput,
    m: slopeFixed(yLimit)
  })
  return clamp([0, 1], x)
}

const makeRangeSetter:MakeSetter = ({limit, setter}) => {
  return (x) => {
    setter(toRange(limit, x))
  }
}

export {
  toRange,
  toDomain,
  makeRangeSetter
}

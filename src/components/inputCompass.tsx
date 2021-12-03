import React from 'react'
import InputCompassWedge from './inputCompassWedge'
import styles from './inputCompass.module.scss'
import {
  clicker 
} from '../lib/clicker'

const charTransform = ({vector, font, size, scalar}) => {
  const xOff = - font / 50
  const ratio = 100 / size
  const half = 50 * ratio
  const pc = v => `${v}%`
  const [x0, y0] = [xOff, 0].map((v) => v + half-50)
  const [x1, y1] = vector.map(v=>Math.round(scalar * half * v))
  return [
    `translate(${pc(x0)},${pc(y0)})`,
    'rotate(90deg)',
    `translate(${pc(x1)},${pc(y1)})`
  ].join(' ')
}

const InputCompass = (props) => {
  const {
    range,
    steps,
    angle,
    wedges,
    needleClass,
    compassClass
  }= props
  const needleStyle = {
    transform: `rotate(${angle}deg)`
  }
  const compassRootClass = [
    styles['root-grid'],
    compassClass.fill
  ].join(' ')

  const needleEdgeClass = [
    needleClass.outline,
    styles.needle
  ].join(' ')
  const needleFillClass = [
    needleClass.fill,
    styles.needleFill
  ].join(' ')

  return (
    <>
    <div style={{lineHeight: 0, position: 'relative', height: '100%', width: '100%'}}>
      {wedges.map(({category, wedgeClass}, i) => {
        const {vector, canClear} = category
        const size = 15 //%
        const font = 150 //%
        const scalar = 0.7
        const xStyle = {
          width: `${size}%`,
          height: `${size}%`,
          fontSize: `${font}%`,
          display: canClear? '': 'none',
          transform: charTransform({
            vector, size, font, scalar
          }),
        }
        const closeX = '×'
        const xClass = [
          styles.hasX,
          ...wedgeClass.hasX
        ].join(' ')
        const toggleClick = clicker({category, range, steps})

        return (
          <button key={i} style={xStyle}
            onClick={toggleClick} className={xClass}>
            {closeX}
          </button>
        )
      })}
    </div>
    <div className={compassRootClass}>
      {wedges.map((wedgeProps, i) => {
        return <InputCompassWedge key={i} {...wedgeProps}/>
      })}
      <div style={needleStyle} className={needleEdgeClass}/>
      <div style={needleStyle} className={needleFillClass}/>
    </div>
    </>
  )
}

export default InputCompass

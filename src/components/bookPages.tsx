import React from 'react'

const BookPages = (props) => {
  const {pageClass} = props
  const className = [
    ...pageClass
  ].join(' ')
  const {children} = props
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default BookPages

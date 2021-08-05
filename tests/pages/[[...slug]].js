import React from 'react'
import ReactDOM from 'react-dom'
import Index from '../../src/pages/[[...slug]]'
import {
  getStaticProps, getStaticPaths
} from '../../src/pages/[[...slug]]'

const mockProps = async (idx) => {
  const {props} = await getStaticProps({
    ...getStaticPaths().paths[idx]
  })
  return props
}

it('renders without crashing', async () => {
  const div = document.createElement('div')
  const props = await mockProps(0)
  ReactDOM.render(<Index {...props}/>, div)
})

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { slug: [] },
  }),
}))

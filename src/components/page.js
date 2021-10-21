import React, { useState } from 'react'
import { useQuery } from "@apollo/client"
import { hastToReact } from 'hot-cold-guide'
import { getFeeling } from '../../lib/queries'
import Happiness from './happiness'
import {
  GuideElement
} from './guide'

const Page = (props) => {

  const [inputText, setInputText] = useState('Welcome')

  const { loading, error, data } = useQuery(getFeeling, {
		variables: { text: inputText },
		notifyOnNetworkStatusChange: true
	});

  const content = hastToReact(props.body, {
    components: {
      a: GuideElement('a'),
      p: GuideElement('p'),
      h1: GuideElement('h1'),
      h2: GuideElement('h2'),
      h3: GuideElement('h3'),
      h4: GuideElement('h4'),
      h5: GuideElement('h5'),
      h6: GuideElement('h6'),
      div: GuideElement('div'),
      span: GuideElement('span')
    }
  })
  return (
    <div>
      <div>
      Secret: {props.SECRET || 'SECRET'}
      </div>
      <div>
        <Happiness
          data={data}
          error={error}
        />
        {loading? '(loading)' : ''}
      </div>
      <div>
        <textarea value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
      </div>
      {content}
    </div>
  )
}

export default Page 

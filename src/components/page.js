import React, { useState } from 'react'
import { useQuery } from "@apollo/client"
import { hastToReact } from 'hot-cold-guide'
import { getFeeling } from '../../lib/queries'
import Happiness from './happiness'
import {
  GuideDiv
} from './guide'

const Page = (props) => {

  const [inputText, setInputText] = useState('Welcome')

  const { loading, error, data } = useQuery(getFeeling, {
		variables: { text: inputText },
		notifyOnNetworkStatusChange: true
	});

  const content = hastToReact(props.body, {
    components: {
      div: GuideDiv
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

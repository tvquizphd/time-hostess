import React, { useState } from 'react'
import { useQuery } from "@apollo/client"
import { getFeeling } from '../../lib/queries'
import Happiness from './happiness'

const Page = (props) => {

  const [inputText, setInputText] = useState('Welcome')

  const { loading, error, data } = useQuery(getFeeling, {
		variables: { text: inputText },
		notifyOnNetworkStatusChange: true
	});

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
    </div>
  )
}

export default Page 

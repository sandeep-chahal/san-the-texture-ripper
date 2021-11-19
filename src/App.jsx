import React from 'react'
import {useStoreState} from "easy-peasy"

function App() {
  const {text} = useStoreState(state => state)
  return (
    <div className="bg-red-500 font-sniglet font-bold">
     {text}
    </div>
  )
}

export default App

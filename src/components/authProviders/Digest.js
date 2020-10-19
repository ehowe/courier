import React from 'react'

import type { Element } from 'react'

type PropsT = {
  onChange: Function,
}

function Digest(props: PropsT): Element<'div'> {
  // const {
  // onChange,
  // } = props

  return (
    <div>
      Digest
    </div>
  )
}

export default Digest

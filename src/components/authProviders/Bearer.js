import React from 'react'

import type { Element } from 'react'

type PropsT = {
  onChange: Function,
}

function Bearer(props: PropsT): Element<'div'> {
  // const {
  // onChange,
  // } = props

  return (
    <div>
      Bearer
    </div>
  )
}

export default Bearer

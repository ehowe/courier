// @flow

import React from 'react'

import upperCase from 'lodash/upperCase'

type PropsT = {
  request: string,
}

function RequestLabel(props: PropsT) {
  function getRequestColor(): string {
    switch (props.request) {
      case 'get':
        return 'DarkCyan'
      case 'post':
        return 'DarkOrchid'
      case 'put':
        return 'ForestGreen'
      case 'patch':
        return 'IndianRed'
      case 'delete':
        return 'SandyBrown'
      case 'head':
        return 'SlateGray'
      case 'options':
        return 'DodgerBlue'
      default:
        return 'Gold'
    }
  }

  return (
    <span style={{ color: getRequestColor(), minWidth: '75px' }}>{upperCase(props.request)}</span>
  )
}

export default RequestLabel

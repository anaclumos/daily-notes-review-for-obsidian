import { TFile } from 'obsidian'
import React from 'react'

type Props = {
  key: string
  file: TFile
}

export const DayView = (props: Props) => {
  const { file } = props
  return (
    <div>
      <h1>{file.name}</h1>
    </div>
  )
}

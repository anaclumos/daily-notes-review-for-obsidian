import { TFile } from 'obsidian'
import React from 'react'
import { DayView } from './DayView'

type Props = {
  files?: TFile[]
}

export const ListView = (props: Props) => {
  const { files } = props
  const data = files?.map((file) => {
    return (
      <div key={file.path}>
        <DayView key={file.path} file={file} />
      </div>
    )
  }) ?? <div>No files</div>
  return (
    <>
      <h1>Week</h1>
      {data}
    </>
  )
}

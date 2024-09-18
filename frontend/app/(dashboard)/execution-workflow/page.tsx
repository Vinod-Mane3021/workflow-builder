"use client"

import { FileUploader } from '@/components/file-uploader'
import React from 'react'

const ExecutionWorkflowPage = () => {
 
  const onValueChange = (files: File[]) => {
    console.log({files})
  }

  return (
    <div>
      <div className="space-y-6">
        <FileUploader
          maxSize={4 * 1024 * 1024}
          onValueChange={onValueChange}
        />
        {/* <UploadedFilesCard uploadedFiles={uploadedFiles} /> */}
      </div>
    </div>
  )
}

export default ExecutionWorkflowPage
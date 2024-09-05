import { FileUploader } from '@/components/file-uploader'
import React from 'react'

const ExecutionWorkflow = () => {
  return (
    <div>
      
      <div className="space-y-6">
        <FileUploader
          maxFileCount={4}
          maxSize={4 * 1024 * 1024}
          // progresses={progresses}
          // onUpload={onUpload}
          // disabled={isUploading}
        />
        {/* <UploadedFilesCard uploadedFiles={uploadedFiles} /> */}
      </div>
    </div>
  )
}

export default ExecutionWorkflow
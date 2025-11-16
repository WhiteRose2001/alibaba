import { useState } from 'react';
import { callServer } from '../../api/clients/callServer';

export interface UseUploadFileResult {
  file: File | null;
  uploadStatus: string | null;
  isUploading: boolean;
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>, userId: number) => Promise<void>;
}

export const useUploadFile = (fetchFiles: () => Promise<void>): UseUploadFileResult => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, userId: number) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) {
      setUploadStatus('❌ No file found');
      return;
    };

    setFile(uploadedFile);
    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {
      const result = await callServer({
        mode: 'UPLOAD',
        method: 'POST',
        file: uploadedFile,
        additionalData: { userId },
      });

      if (result.success) {
        setUploadStatus(`✅ Uploaded: ${result.data.params.fileUrl || 'no URL returned'}`);
        fetchFiles();
      } else {
        setUploadStatus(`❌ Error ${result.status}: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('❌ Upload failed: unexpected error');
    } finally {
      setIsUploading(false);
    }
  };

  return { file, uploadStatus, isUploading, handleUpload };
};

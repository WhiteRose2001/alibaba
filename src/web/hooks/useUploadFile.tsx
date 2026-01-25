import { useState } from 'react';
import { callServer } from '../../api/clients/callServer';

export interface UseUploadFileResult {
  file: File | null;
  uploadStatus: string | null;
  isUploading: boolean;
  handleUpload: (uploadedFile: File | null, userId: number) => Promise<void>;
  clearUploadStatus: () => void;
}

export const useUploadFile = (
  fetchFiles: () => Promise<void>,
): UseUploadFileResult => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const clearUploadStatus = () => setUploadStatus(null);

  const handleUpload = async (uploadedFile: File | null, userId: number) => {
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsUploading(true);

    try {
      const result = await callServer({
        mode: 'UPLOAD',
        method: 'POST',
        file: uploadedFile,
        additionalData: { userId },
      });

      if (result.success) {
        setUploadStatus(result.data.message);
        await fetchFiles();
      } else {
        setUploadStatus(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('❌ Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    uploadStatus,
    isUploading,
    handleUpload,
    clearUploadStatus,
  };
};

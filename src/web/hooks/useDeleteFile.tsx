import { useCallback, useState } from 'react';
import { callServer } from '../../api/clients/callServer';

export type useDeleteFileResult = {
  handleDelete: (
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string
  ) => Promise<void>;
  deleteStatus: string | null;
};

export const useDeleteFile = (
  fetchFiles: () => Promise<void>
): useDeleteFileResult => {
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>, filename: string) => {
      try {
        const response = await callServer({
          mode: 'DELETE_FILE',
          method: 'POST',
          filename,
        });

        if (response.success) {
          setDeleteStatus(
            // `✅ Uploaded: ${result.data.params.fileUrl || 'no URL returned'}`
            '✅ File deleted successfully'
          );

          console.log(`File ${filename} deleted successfully`);
          await fetchFiles();
        } else {
          console.error('Error deleting file:', response.message);
        }
      } catch (error) {
        console.error('Delete operation failed:', error);
      }
    },
    [fetchFiles]
  );

  return { handleDelete, deleteStatus };
};

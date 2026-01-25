import { useCallback, useState } from 'react';
import { callServer } from '../../api/clients/callServer';

export type UseDeleteFileResult = {
  handleDelete: (
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
  ) => Promise<void>;
  deleteStatus: string | null;
  clearDeleteStatus: () => void;
};

export const useDeleteFile = (
  fetchFiles: () => Promise<void>,
): UseDeleteFileResult => {
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  const clearDeleteStatus = () => setDeleteStatus(null);

  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>, filename: string) => {
      try {
        const response = await callServer({
          mode: 'DELETE_FILE',
          method: 'POST',
          filename,
        });

        if (response.success) {
          setDeleteStatus('✅ File deleted successfully');
          await fetchFiles();
        } else {
          setDeleteStatus(`❌ ${response.message}`);
        }
      } catch (error) {
        console.error('Delete operation failed:', error);
        setDeleteStatus('❌ Delete failed');
      }
    },
    [fetchFiles],
  );

  return { handleDelete, deleteStatus, clearDeleteStatus };
};

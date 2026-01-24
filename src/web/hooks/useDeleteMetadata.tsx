import { useCallback, useState } from 'react';
import { callServer } from '../../api/clients/callServer';

export type UseRemoveMetadataResult = {
  handleDeleteMetadata: (
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
  ) => Promise<void>;
  deleteMetadataStatus: string | null;
};

export const useDeleteMetadata = (
  fetchFiles: () => Promise<void>,
): UseRemoveMetadataResult => {
  const [deleteMetadataStatus, setRemoveStatus] = useState<string | null>(null);

  const handleDeleteMetadata = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>, filename: string) => {
      try {
        const response = await callServer({
          mode: 'DELETE_METADATA',
          method: 'POST',
          filename,
        });

        if (response.success) {
          setRemoveStatus('✅ Metadata removed successfully');
          await fetchFiles();
        } else {
          console.error('Error removing metadata:', response.message);
        }
      } catch (error) {
        console.error('Remove metadata failed:', error);
      }
    },
    [fetchFiles],
  );

  return { handleDeleteMetadata, deleteMetadataStatus };
};

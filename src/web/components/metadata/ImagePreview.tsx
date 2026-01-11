import { Box } from '@mui/material';

type Props = {
  src: string;
  alt?: string;
};

export default function ImagePreview({ src, alt }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: 420,
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}

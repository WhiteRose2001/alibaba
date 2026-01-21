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
        backgroundColor: 'background.paper',
        boxShadow: 2,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          maxWidth: '100%',
          maxHeight: 420,
          objectFit: 'contain',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}

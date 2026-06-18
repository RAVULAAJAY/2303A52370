import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';

export function ErrorScreen({ title = 'Something went wrong', message, onRetry }) {
  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
      <Stack spacing={2.5}>
        <Alert severity="error" variant="outlined">
          {title}
        </Alert>
        <Box>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {message}
          </Typography>
        </Box>
        {onRetry ? (
          <Box>
            <Button variant="contained" onClick={onRetry}>
              Retry
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
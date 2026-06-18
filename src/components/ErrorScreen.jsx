import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';

export function ErrorScreen({ title = 'Unable to reach API. Showing demo data.', message, onRetry }) {
  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
      <Stack spacing={2.5}>
        <Alert severity="info" variant="outlined">
          {title}
        </Alert>
        <Box>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {message ?? 'Unable to reach API. Showing demo data.'}
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
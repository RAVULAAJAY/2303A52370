import { Box, Grid, Paper, Skeleton, Stack } from '@mui/material';

export function LoadingScreen() {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Skeleton variant="rounded" height={140} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={32} width="36%" />
          <Skeleton variant="rounded" height={64} />
          <Skeleton variant="rounded" height={64} />
          <Skeleton variant="rounded" height={64} />
        </Stack>
      </Paper>
    </Stack>
  );
}
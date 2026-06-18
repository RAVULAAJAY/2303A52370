import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { ErrorScreen } from '../components/ErrorScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { NotificationCard } from '../components/NotificationCard';
import { PrioritySelector } from '../components/PrioritySelector';
import { useNotifications } from '../context/NotificationContext';
import { Log } from '../services/logger';
import { getPriorityScore } from '../utils/notificationHelpers';

export function PriorityPage() {
  const { notifications, loading, error, getPriorityNotifications } = useNotifications();
  const [limit, setLimit] = useState(10);

  const priorityNotifications = useMemo(() => getPriorityNotifications(limit), [getPriorityNotifications, limit]);

  useEffect(() => {
    void Log('frontend', 'info', 'priority', `Calculated top ${limit} priority notifications`);
  }, [limit, priorityNotifications.length]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && notifications.length === 0) {
    return <ErrorScreen message={error} />;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2 }}>
          Priority Notifications
        </Typography>
        <Typography variant="h4">Top priority routing</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Placement notifications rank first, followed by Result and Event based on score.
        </Typography>
      </Box>

      <PrioritySelector value={limit} onChange={setLimit} />

      <Grid container spacing={3}>
        {priorityNotifications.map((notification, index) => (
          <Grid item xs={12} md={6} lg={4} key={notification.id}>
            <NotificationCard
              notification={notification}
              rank={index + 1}
              score={getPriorityScore(notification)}
              onToggleRead={() => undefined}
              onOpen={() => void Log('frontend', 'info', 'user', `Opened priority notification ${notification.id}`)}
            />
          </Grid>
        ))}
      </Grid>

      {priorityNotifications.length === 0 ? (
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px dashed rgba(15, 23, 42, 0.2)',
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}
        >
          <Typography variant="h6">No priority notifications found.</Typography>
        </Box>
      ) : null}
    </Stack>
  );
}
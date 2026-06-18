import { useEffect, useMemo } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { NotificationCard } from '../components/NotificationCard';
import { useNotifications } from '../context/NotificationContext';
import { Log } from '../services/logger';
import { sortByPriority } from '../utils/notificationHelpers';

export function PriorityPage() {
  const { notifications, loading } = useNotifications();
  const limit = 10;

  const priorityNotifications = useMemo(() => sortByPriority(notifications).slice(0, limit), [notifications]);

  useEffect(() => {
    void Log('frontend', 'info', 'priority', `Calculated top ${limit} priority notifications`);
  }, [limit, priorityNotifications.length]);

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

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Top 10 notifications
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Priority score = (weight × 1000) - age in minutes. Placement = 3, Result = 2, Event = 1.
          </Typography>
        </CardContent>
      </Card>

      {loading ? (
        <Typography sx={{ color: 'text.secondary' }}>Loading priority notifications...</Typography>
      ) : (
        <Grid container spacing={3}>
          {priorityNotifications.map((notification, index) => (
            <Grid item xs={12} md={6} lg={4} key={notification.id}>
              <NotificationCard
                notification={notification}
                rank={index + 1}
                score={notification.priorityScore}
                onToggleRead={() => undefined}
                onOpen={() => void Log('frontend', 'info', 'user', `Opened priority notification ${notification.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

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
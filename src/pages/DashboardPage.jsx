import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { NotificationCard } from '../components/NotificationCard';
import { ErrorScreen } from '../components/ErrorScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { useNotifications } from '../context/NotificationContext';
import { Log } from '../services/logger';
import { formatDateTime, sortByNewest } from '../utils/notificationHelpers';

function SummaryCard({ label, value, tone }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Chip label={label} color={tone} size="small" sx={{ width: 'fit-content' }} />
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { notifications, stats, loading, error, refreshNotifications, markAsRead, lastSyncedAt } =
    useNotifications();

  const recentNotifications = sortByNewest(notifications).slice(0, 4);

  const handleRefresh = async () => {
    await Log('frontend', 'info', 'user', 'Dashboard refresh requested');
    await refreshNotifications();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && notifications.length === 0) {
    return <ErrorScreen message={error} onRetry={refreshNotifications} />;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2 }}>
              Dashboard
            </Typography>
            <Typography variant="h4">Notification command center</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Monitor high-level notification health and unread activity in one place.
            </Typography>
          </Box>

          <Button variant="contained" startIcon={<RefreshOutlinedIcon />} onClick={handleRefresh}>
            Refresh data
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <SummaryCard label="Total Notifications" value={stats.total} tone="primary" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SummaryCard label="Unread Notifications" value={stats.unread} tone="warning" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SummaryCard label="Placement Notifications" value={stats.Placement} tone="success" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SummaryCard label="Result Notifications" value={stats.Result} tone="info" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SummaryCard label="Event Notifications" value={stats.Event} tone="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SummaryCard
            label="Last Sync"
            value={lastSyncedAt ? formatDateTime(lastSyncedAt) : 'Pending'}
            tone="default"
          />
        </Grid>
      </Grid>

      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5">Recent notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              The latest alerts sorted by newest first.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {recentNotifications.map((notification, index) => (
            <Grid item xs={12} md={6} key={notification.id}>
              <NotificationCard
                notification={notification}
                rank={index + 1}
                onToggleRead={() => void markAsRead(notification.id, !notification.isRead)}
                onOpen={() => void Log('frontend', 'info', 'user', `Opened dashboard notification ${notification.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
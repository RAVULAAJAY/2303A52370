import { useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import { ErrorScreen } from '../components/ErrorScreen';
import { FilterBar } from '../components/FilterBar';
import { LoadingScreen } from '../components/LoadingScreen';
import { NotificationTable } from '../components/NotificationTable';
import { useNotifications } from '../context/NotificationContext';
import { Log } from '../services/logger';
import { filterNotifications, formatDateTime } from '../utils/notificationHelpers';

export function NotificationsPage() {
  const { notifications, loading, error, refreshNotifications, markAsRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filteredRows = useMemo(
    () => filterNotifications(notifications, searchQuery, typeFilter),
    [notifications, searchQuery, typeFilter],
  );

  const handleReset = async () => {
    await Log('frontend', 'info', 'filter', 'User reset notification filters');
    setSearchQuery('');
    setTypeFilter('All');
  };

  const openNotification = async (notification) => {
    setSelectedNotification(notification);
    await Log('frontend', 'info', 'user', `Viewed notification ${notification.id}`);
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
        <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2 }}>
          All Notifications
        </Typography>
        <Typography variant="h4">Search, filter, and manage notifications</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Use the table to review message details, filter by type, and keep unread items highlighted.
        </Typography>
      </Box>

      <FilterBar
        searchValue={searchQuery}
        typeValue={typeFilter}
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onReset={handleReset}
      />

      <NotificationTable
        rows={filteredRows}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onToggleRead={(notification) => void markAsRead(notification.id, !notification.isRead)}
        onOpen={openNotification}
      />

      {filteredRows.length === 0 ? (
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px dashed rgba(15, 23, 42, 0.2)',
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}
        >
          <Typography variant="h6">No notifications matched your filters.</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Clear the search or type filter to restore the full list.
          </Typography>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={handleReset}>
            Clear filters
          </Button>
        </Box>
      ) : null}

      <Dialog open={Boolean(selectedNotification)} onClose={() => setSelectedNotification(null)} fullWidth maxWidth="sm">
        {selectedNotification ? (
          <>
            <DialogTitle>{selectedNotification.title}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Typography variant="body1">{selectedNotification.message}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Type
                    </Typography>
                    <Typography variant="body2">{selectedNotification.notificationType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Received
                    </Typography>
                    <Typography variant="body2">{formatDateTime(selectedNotification.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Read state
                    </Typography>
                    <Typography variant="body2">
                      {selectedNotification.isRead ? 'Read' : 'Unread'}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedNotification(null)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => {
                  void markAsRead(selectedNotification.id, true);
                  setSelectedNotification((current) => (current ? { ...current, isRead: true } : current));
                }}
              >
                Mark as read
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Stack>
  );
}
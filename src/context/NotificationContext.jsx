import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadNotificationsDataset } from '../api/notificationsApi';
import { Log } from '../services/logger';
import { buildNotificationStats, getPriorityScore, sortByNewest, sortByPriority } from '../utils/notificationHelpers';
import { readJSON, writeJSON } from '../utils/storage';

const NotificationContext = createContext(null);
const READ_STATE_KEY = 'campus-notifications-read-state';

function applyReadState(notifications, readState) {
  return notifications.map((notification) => ({
    ...notification,
    isRead: Boolean(readState[notification.id] ?? notification.isRead),
  }));
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [readState, setReadState] = useState(() => readJSON(READ_STATE_KEY, {}));

  const readStateRef = useRef(readState);
  const warningShownRef = useRef(false);

  useEffect(() => {
    readStateRef.current = readState;
    writeJSON(READ_STATE_KEY, readState);
  }, [readState]);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((current) => ({
      ...current,
      open: false,
    }));
  }, []);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      await Log('frontend', 'info', 'app', 'Loading notifications from API');
      const response = await loadNotificationsDataset({ limit: 100 });
      const hydrated = applyReadState(response.items, readStateRef.current);
      const ordered = sortByNewest(hydrated);

      setNotifications(ordered);
      setUsingDemoData(response.source === 'mock');
      setLastSyncedAt(new Date().toISOString());
      await Log('frontend', 'info', 'app', `Loaded ${ordered.length} notifications`);

      if (response.source === 'mock' && response.warning && !warningShownRef.current) {
        showSnackbar(response.warning, 'warning');
        warningShownRef.current = true;
      }

      if (response.source === 'api') {
        warningShownRef.current = false;
      }
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ??
        requestError?.message ??
        'Unable to reach API. Showing demo data.';

      const fallback = await loadNotificationsDataset({ limit: 100 });
      const hydrated = applyReadState(fallback.items, readStateRef.current);

      setNotifications(sortByNewest(hydrated));
      setUsingDemoData(true);

      if (!warningShownRef.current) {
        showSnackbar(fallback.warning || message, 'warning');
        warningShownRef.current = true;
      }

      await Log('frontend', 'warn', 'app', `Notification load failed: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  const markAsRead = useCallback(
    async (notificationId, nextRead = true) => {
      const nextState = {
        ...readStateRef.current,
        [notificationId]: nextRead,
      };

      readStateRef.current = nextState;
      setReadState(nextState);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: nextRead,
              }
            : notification,
        ),
      );

      await Log(
        'frontend',
        'info',
        'user',
        `${nextRead ? 'Marked' : 'Restored'} notification ${notificationId}`,
      );
      showSnackbar(
        nextRead ? 'Notification marked as read' : 'Notification marked as unread',
        'success',
      );
    },
    [showSnackbar],
  );

  const toggleReadState = useCallback(
    (notificationId) => {
      const currentNotification = notifications.find((item) => item.id === notificationId);
      return markAsRead(notificationId, !(currentNotification?.isRead ?? false));
    },
    [markAsRead, notifications],
  );

  const getPriorityNotifications = useCallback(
    (limit) =>
      sortByPriority(notifications).slice(0, limit),
    [notifications],
  );

  const stats = useMemo(() => buildNotificationStats(notifications), [notifications]);

  const recentNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      loading,
      error,
      lastSyncedAt,
      stats,
      unreadCount: stats.unread,
      recentNotifications,
      refreshNotifications,
      markAsRead,
      toggleReadState,
      getPriorityNotifications,
      snackbar,
      showSnackbar,
      closeSnackbar,
      usingDemoData,
    }),
    [
      notifications,
      loading,
      error,
      lastSyncedAt,
      stats,
      recentNotifications,
      refreshNotifications,
      markAsRead,
      toggleReadState,
      getPriorityNotifications,
      snackbar,
      showSnackbar,
      closeSnackbar,
      usingDemoData,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
}
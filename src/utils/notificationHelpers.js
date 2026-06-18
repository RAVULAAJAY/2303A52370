export const NOTIFICATION_TYPES = ['All', 'Placement', 'Result', 'Event'];

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function normalizeNotificationType(value) {
  const type = String(value ?? 'Event').trim();
  const match = NOTIFICATION_TYPES.find(
    (candidate) => candidate.toLowerCase() === type.toLowerCase(),
  );

  return match ?? 'Event';
}

export function normalizeNotification(notification, index = 0) {
  const createdAt =
    notification.created_at ??
    notification.createdAt ??
    notification.timestamp ??
    notification.date ??
    notification.time ??
    new Date().toISOString();

  const message =
    notification.message ??
    notification.content ??
    notification.text ??
    notification.description ??
    '';

  const title =
    notification.title ??
    notification.subject ??
    message.slice(0, 72) ??
    'Notification';

  const id =
    notification.id ??
    notification.notification_id ??
    notification._id ??
    `${normalizeNotificationType(notification.notification_type ?? notification.type ?? 'Event')}-${index}-${createdAt}`;

  return {
    id: String(id),
    title: String(title || 'Notification'),
    message: String(message),
    notificationType: normalizeNotificationType(
      notification.notification_type ?? notification.type ?? notification.category,
    ),
    createdAt,
    isRead: Boolean(notification.isRead ?? notification.read ?? notification.is_read),
    raw: notification,
  };
}

export function getAgeInMinutes(createdAt) {
  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - createdDate.getTime()) / 60000));
}

export function getPriorityScore(notification) {
  const weight = TYPE_WEIGHTS[notification.notificationType] ?? 1;
  const ageInMinutes = getAgeInMinutes(notification.createdAt);

  return weight * 1000 - ageInMinutes;
}

export function sortByPriority(notifications) {
  return [...notifications]
    .map((notification) => ({
      ...notification,
      priorityScore: getPriorityScore(notification),
    }))
    .sort((left, right) => right.priorityScore - left.priorityScore);
}

export function buildNotificationStats(notifications) {
  return notifications.reduce(
    (accumulator, notification) => {
      accumulator.total += 1;
      accumulator[notification.notificationType] += 1;

      if (!notification.isRead) {
        accumulator.unread += 1;
      }

      return accumulator;
    },
    {
      total: 0,
      unread: 0,
      Placement: 0,
      Result: 0,
      Event: 0,
    },
  );
}

export function filterNotifications(notifications, query, typeFilter) {
  const normalizedQuery = query.trim().toLowerCase();

  return notifications.filter((notification) => {
    const matchesType = typeFilter === 'All' || notification.notificationType === typeFilter;
    const haystack = [notification.title, notification.message, notification.notificationType]
      .join(' ')
      .toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

    return matchesType && matchesQuery;
  });
}

export function sortByNewest(notifications) {
  return [...notifications].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function getNotificationTone(notificationType) {
  if (notificationType === 'Placement') {
    return 'success';
  }

  if (notificationType === 'Result') {
    return 'warning';
  }

  return 'info';
}
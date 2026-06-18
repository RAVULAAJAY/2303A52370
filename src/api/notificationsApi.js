import axios from 'axios';
import { Log } from '../services/logger';
import { normalizeNotification } from '../utils/notificationHelpers';

const baseUrl =
  import.meta.env.VITE_NOTIFICATIONS_API_BASE_URL ??
  'http://4.224.186.213/evaluation-service/notifications';

const notificationClient = axios.create({
  baseURL: baseUrl,
  timeout: 20000,
});

function parseNotificationPayload(payload) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: payload.length,
    };
  }

  const items =
    payload?.notifications ?? payload?.data ?? payload?.results ?? payload?.items ?? [];

  const total =
    payload?.total ??
    payload?.count ??
    payload?.meta?.total ??
    payload?.pagination?.total ??
    payload?.data?.total ??
    null;

  return {
    items: Array.isArray(items) ? items : [],
    total: typeof total === 'number' ? total : null,
  };
}

export async function fetchNotificationsPage({ page = 1, limit = 100, notificationType }) {
  const params = {
    page,
    limit,
  };

  if (notificationType && notificationType !== 'All') {
    params.notification_type = notificationType;
  }

  await Log('frontend', 'info', 'api', `Fetching notifications page ${page}`);

  try {
    const response = await notificationClient.get('', { params });
    const parsed = parseNotificationPayload(response.data);
    const items = parsed.items.map((notification, index) =>
      normalizeNotification(notification, index + (page - 1) * limit),
    );

    await Log('frontend', 'info', 'api', `Fetched ${items.length} notifications page ${page}`);

    return {
      items,
      total: parsed.total,
      page,
      limit,
    };
  } catch (error) {
    await Log('frontend', 'error', 'api', `Failed to fetch notifications page ${page}`);
    throw error;
  }
}

export async function fetchAllNotifications({ notificationType = 'All', limit = 100, maxPages = 50 } = {}) {
  const items = [];
  let total = null;

  for (let page = 1; page <= maxPages; page += 1) {
    const response = await fetchNotificationsPage({ page, limit, notificationType });
    items.push(...response.items);

    if (typeof response.total === 'number') {
      total = response.total;

      if (items.length >= response.total) {
        break;
      }
    } else if (response.items.length < limit) {
      break;
    }
  }

  return {
    items,
    total: total ?? items.length,
  };
}
import apiClient, { getAuthorizationHeadersPreview, hasAuthorizationMaterial } from '../services/api';
import { Log } from '../services/logger';
import { mockNotifications } from '../data/mockNotifications';
import { normalizeNotification, sortByNewest, sortByPriority } from '../utils/notificationHelpers';

function parseNotificationPayload(payload) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: payload.length,
    };
  }

  const items = payload?.notifications ?? payload?.data ?? payload?.results ?? payload?.items ?? [];
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

function filterMockNotifications(notificationType) {
  return mockNotifications.filter((notification) =>
    notificationType && notificationType !== 'All'
      ? notification.notification_type === notificationType
      : true,
  );
}

function createMockPage({ page, limit, notificationType, warning }) {
  const filtered = filterMockNotifications(notificationType);
  const pageItems = filtered
    .slice((page - 1) * limit, page * limit)
    .map((notification, index) => normalizeNotification(notification, index + (page - 1) * limit));

  return {
    items: pageItems,
    total: filtered.length,
    page,
    limit,
    source: 'mock',
    warning,
    authorizationHeaders: getAuthorizationHeadersPreview(),
  };
}

export async function fetchNotificationsPage({ page = 1, limit = 100, notificationType }) {
  const params = { page, limit };

  if (notificationType && notificationType !== 'All') {
    params.notification_type = notificationType;
  }

  await Log('frontend', 'info', 'api', `Fetching notifications page ${page}`);

  if (!hasAuthorizationMaterial()) {
    await Log('frontend', 'warn', 'api', 'API authorization missing. Showing demo data.');
    return createMockPage({
      page,
      limit,
      notificationType,
      warning: 'API authorization missing. Showing demo data.',
    });
  }

  try {
    const response = await apiClient.get('', { params });
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
      source: 'api',
      warning: '',
      authorizationHeaders: getAuthorizationHeadersPreview(),
    };
  } catch (error) {
    const warning = [401, 403].includes(error?.response?.status)
      ? 'API authorization missing. Showing demo data.'
      : 'Unable to reach API. Showing demo data.';

    await Log('frontend', 'warn', 'api', `${warning} Page ${page}`);

    return createMockPage({
      page,
      limit,
      notificationType,
      warning,
    });
  }
}

export async function loadNotificationsDataset({ notificationType = 'All', limit = 100, maxPages = 50 } = {}) {
  const items = [];
  let total = null;
  let source = 'api';
  let warning = '';

  for (let page = 1; page <= maxPages; page += 1) {
    const response = await fetchNotificationsPage({ page, limit, notificationType });
    items.push(...response.items);
    source = response.source ?? source;
    warning = response.warning ?? warning;

    if (typeof response.total === 'number') {
      total = response.total;

      if (items.length >= response.total) {
        break;
      }
    } else if (response.items.length < limit) {
      break;
    }
  }

  const orderedItems =
    notificationType === 'All'
      ? sortByNewest(items)
      : sortByNewest(items.filter((item) => item.notificationType === notificationType));

  return {
    items: orderedItems,
    total: total ?? orderedItems.length,
    source,
    warning,
    authorizationHeaders: getAuthorizationHeadersPreview(),
  };
}

export async function loadPriorityNotifications(limit = 10) {
  const dataset = await loadNotificationsDataset({ limit: 100 });
  return {
    ...dataset,
    items: sortByPriority(dataset.items).slice(0, limit),
  };
}
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Chip, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatDateTime, getNotificationTone } from '../utils/notificationHelpers';

export function NotificationTable({
  rows,
  loading,
  paginationModel,
  onPaginationModelChange,
  onToggleRead,
  onOpen,
}) {
  const columns = [
    {
      field: 'readState',
      headerName: 'State',
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Chip
          label={row.isRead ? 'Read' : 'Unread'}
          color={row.isRead ? 'default' : 'warning'}
          size="small"
          variant={row.isRead ? 'outlined' : 'filled'}
        />
      ),
    },
    {
      field: 'title',
      headerName: 'Message',
      flex: 1.6,
      minWidth: 280,
      renderCell: ({ row }) => (
        <Box sx={{ py: 1 }}>
          <Box sx={{ fontWeight: 700 }}>{row.title}</Box>
          <Box sx={{ color: 'text.secondary', whiteSpace: 'normal' }}>{row.message}</Box>
        </Box>
      ),
    },
    {
      field: 'notificationType',
      headerName: 'Type',
      width: 140,
      renderCell: ({ row }) => (
        <Chip label={row.notificationType} color={getNotificationTone(row.notificationType)} size="small" />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Received',
      width: 180,
      valueGetter: ({ value }) => formatDateTime(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton
            aria-label="toggle read state"
            onClick={(event) => {
              event.stopPropagation();
              onToggleRead?.(row);
            }}
          >
            <MarkEmailReadOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="view details"
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.(row);
            }}
          >
            <OpenInNewOutlinedIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 15, 20]}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        disableRowSelectionOnClick
        getRowClassName={({ row }) => (row.isRead ? 'row-read' : 'row-unread')}
        sx={{
          borderRadius: 4,
          border: 'none',
          backgroundColor: 'rgba(255,255,255,0.92)',
          '& .row-unread': {
            backgroundColor: 'rgba(15, 118, 110, 0.05)',
          },
          '& .row-read': {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(15, 23, 42, 0.04)',
          },
        }}
        onRowClick={({ row }) => onOpen?.(row)}
      />
    </Box>
  );
}
export const isEnabled = process.env.NODE_ENV === 'production' &&
  (!!process.env.GCLOUD_OPERATIONS_ENABLED || !!process.env.GCLOUD_STRUCLOG_ENABLED)

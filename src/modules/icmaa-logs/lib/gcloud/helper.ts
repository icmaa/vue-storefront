export const isEnabled = process.env.NODE_ENV === 'production' && !!process.env.GCLOUD_OPERATIONS_ENABLED

export function getErrorMessage(error) {
  if (!error.response) {
    return 'Cannot reach the server. Please try again.'
  }
  const detail = error.response.data?.detail
  if (typeof detail === 'string') {
    return detail
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0]
    const field = first.loc?.[first.loc.length - 1]
    const message = first.msg.replace(/^Value error, /, '')
    return field ? `${field}: ${message}` : message
  }
  return 'Something went wrong. Please try again.'
}
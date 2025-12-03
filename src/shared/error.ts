import { notification } from 'ant-design-vue'
const [notify, contextHolder] = notification.useNotification()

function notifyError(message: string, description?: string) {
  notify.error({
    message,
    description,
    placement: 'bottom',
    duration: 2,
  })
}
export {
  contextHolder,
  notifyError,
}

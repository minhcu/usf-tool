import { openNewOrExistedTab } from "@/shared/chrome-api"
import { useCredentialsStore } from "@/shared/store"

export async function openAdminTool() {
  const credentialsStore = useCredentialsStore()

  await openNewOrExistedTab(credentialsStore.credentials.emailLookupUrl)
}

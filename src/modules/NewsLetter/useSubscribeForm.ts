import axios from 'axios'
import { useMutation } from 'react-query'

interface ISubscribeForm {
  apiEndpoint: string
  onAPICallSuccess: (data?: any) => any
}
function useSubscribeForm({
  onAPICallSuccess,
  apiEndpoint
}: ISubscribeForm) {
  const { mutate, error, isLoading } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const payload = {
        email
      }
      const response = await axios.post(apiEndpoint, payload)

      await onAPICallSuccess(response?.data?.data)

      return payload
    }
  })
  return {
    create: mutate,
    error: error ? (error as Error).message : null,
    isLoading: isLoading
  }
}

export default useSubscribeForm

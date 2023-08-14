import { getUserId } from 'lib/token'
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { Socket, io } from 'socket.io-client'
import { store } from 'store'
import { setNewPosts } from 'store/slices/notification.slice'
import { ENV } from 'lib/env'
import {
  setBalance,
  setSelectedAccount
} from 'store/slices/auth.slice'

type socketContextType = {
  socket: Socket | null
}

const socketContextDefaultValues: socketContextType = {
  socket: null
}

const SocketContext = createContext<socketContextType>(
  socketContextDefaultValues
)

export function useSocket() {
  return useContext(SocketContext)
}

type Props = {
  children: ReactNode
}

const WS_URL = ENV.WS_URL

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const userId = getUserId()

  useEffect(() => {
    const socketInstance = io(WS_URL)
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      // console.log('Connected!!!')
    })

    socketInstance.on('connect_error', err => {
      //   console.log(`connect_error due to ${err}`)
    })

    socketInstance.on('newPost', data => {
      if (!data.user || !data.postId) return
      store.dispatch(setNewPosts(data))
    })

    if (userId && socketInstance) {
      socketInstance.emit('joinRoom', userId)
      socketInstance.on('notification', (data: any) => {
        store.dispatch(setSelectedAccount(data.user))
        store.dispatch(setBalance(data.user?.balance))
      })
    }

    return () => {
      socketInstance.emit('leaveRoom', userId)
      socketInstance.removeAllListeners()
      socketInstance.disconnect()
    }
  }, [userId])

  const value = {
    socket
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

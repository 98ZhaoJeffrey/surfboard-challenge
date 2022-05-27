import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthProvider';

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const { user } = useAuth();

  useEffect(() => {
    if(user === null) return;
    if(socket) return;
      const newSocket = io(
          'http://localhost:5000', {query:{ 
            'name': user.name, 
            'id': user.id,
            'code': user.roomcode,
          }});
      setSocket(newSocket)

    return () => {newSocket.disconnect()}
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { User } from '@/types/auth';

interface SignalRConnectionHook {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  error: Error | null;
  registerHandler: (methodName: string, handler: (...args: any[]) => void) => void;
  removeHandler: (methodName: string, handler: (...args: any[]) => void) => void;
}

export const useSignalRConnection = (user: User | null): SignalRConnectionHook => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const handlersRef = useRef<Map<string, ((...args: any[]) => void)[]>>(new Map());

  // Function to register a handler for a specific method name
  const registerHandler = useCallback((methodName: string, handler: (...args: any[]) => void) => {
    console.log(`useSignalRConnection: Registering handler for method: ${methodName}`);
    if (!handlersRef.current.has(methodName)) {
      handlersRef.current.set(methodName, []);
    }
    handlersRef.current.get(methodName)?.push(handler);
    if (connection) {
      connection.on(methodName, handler);
      console.log(`useSignalRConnection: Handler registered on connection for method: ${methodName}`);
    } else {
      console.warn(`useSignalRConnection: Connection not available when trying to register handler for method: ${methodName}`);
    }
  }, [connection]);

  // Function to remove a handler for a specific method name
  const removeHandler = useCallback((methodName: string, handler: (...args: any[]) => void) => {
    const handlers = handlersRef.current.get(methodName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length === 0) {
        handlersRef.current.delete(methodName);
      }
    }
    connection?.off(methodName, handler);
  }, [connection]);

  useEffect(() => {
    let currentConnection: signalR.HubConnection | null = null;

    const startSignalRConnection = async () => {
      if (!user) {
        console.log('useSignalRConnection: User not authenticated, skipping connection setup.');
        if (connection) {
          await connection.stop();
          setConnection(null);
          setIsConnected(false);
        }
        return;
      }

      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        console.log('useSignalRConnection: Connection already established and connected.');
        setIsConnected(true);
        return;
      }

      if (connection && connection.state === signalR.HubConnectionState.Connecting) {
        console.log('useSignalRConnection: Connection already in connecting state.');
        return;
      }

      try {
        console.log('useSignalRConnection: Attempting to negotiate SignalR connection...');
        const response = await fetch('http://localhost:7071/api/negotiate', {
          method: 'POST',
        });
        const connectionInfo = await response.json();

        currentConnection = new signalR.HubConnectionBuilder()
          .withUrl(connectionInfo.url, {
            accessTokenFactory: () => connectionInfo.accessToken,
          })
          .withAutomaticReconnect()
          .build();

        currentConnection.onreconnecting((err) => {
          console.warn('useSignalRConnection: Reconnecting...', err);
          setIsConnected(false);
        });

        currentConnection.onreconnected(() => {
          console.log('useSignalRConnection: Reconnected.');
          setIsConnected(true);
          // Re-register all handlers on re-connection
          handlersRef.current.forEach((handlers, methodName) => {
            handlers.forEach(handler => currentConnection?.on(methodName, handler));
          });
        });

        currentConnection.onclose((err) => {
          console.error('useSignalRConnection: Connection closed.', err);
          setIsConnected(false);
          setError(err);
        });

        // Register all existing handlers to the new connection
        handlersRef.current.forEach((handlers, methodName) => {
          handlers.forEach(handler => currentConnection?.on(methodName, handler));
        });

        await currentConnection.start();
        console.log('useSignalRConnection: SignalR Connected.');
        setConnection(currentConnection);
        setIsConnected(true);
        setError(null);
      } catch (err: any) {
        console.error('useSignalRConnection: SignalR Connection Error:', err);
        setError(err);
        setIsConnected(false);
        setConnection(null);
      }
    };

    startSignalRConnection();

    return () => {
      console.log('useSignalRConnection: Cleanup running.');
      if (currentConnection) {
        currentConnection.stop();
        console.log('useSignalRConnection: SignalR Disconnected.');
      }
    };
  }, [user]); // Re-run effect only when user changes

  return { connection, isConnected, error, registerHandler, removeHandler };
};

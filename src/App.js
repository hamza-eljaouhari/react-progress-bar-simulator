import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const ProgressBar = ({ progress }) => (
  <div style={{ width: '100%', backgroundColor: '#ddd' }}>
    <div style={{ width: `${progress}%`, backgroundColor: 'green', height: '20px' }} />
  </div>
);

const App = () => {
  const [progress, setProgress] = useState(0);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7104/progressHub') // Replace with your server URL
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Connected to SignalR Hub!');
          connection.invoke('StartTask'); // Start the simulated task

          connection.on('ReceiveProgress', (progress) => {
            setProgress(progress); // Update progress state
          });
        })
        .catch(error => console.error('SignalR Connection Error: ', error));
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  return (
    <div>
      <h1>Task Progress</h1>
      <ProgressBar progress={progress} />
    </div>
  );
};

export default App;

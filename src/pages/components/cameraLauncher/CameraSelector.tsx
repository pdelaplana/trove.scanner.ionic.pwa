import React, { useState, useEffect } from 'react';
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';

interface CameraDevice {
  deviceId: string;
  label: string;
}

interface CameraSelectorProps {
  onSelectCamera: (deviceId: string) => void;
}

const CameraSelector: React.FC<CameraSelectorProps> = ({ onSelectCamera }) => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  const getCameras = async () => {
    try {
      // First request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach((track) => track.stop());

      setPermissionGranted(true);

      // Now enumerate all devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${cameras.length + 1}`,
        }));

      setCameras(videoDevices);

      // Select the first camera by default
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
        onSelectCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting cameras:', error);
    }
  };

  useEffect(() => {
    getCameras();
  }, []);

  const handleCameraChange = (event: CustomEvent) => {
    const deviceId = event.detail.value;
    setSelectedCamera(deviceId);
    onSelectCamera(deviceId);
  };

  return (
    <>
      <div className='ion-flex'>
        {!permissionGranted ? (
          <IonButton expand='block' onClick={getCameras}>
            Allow Camera Access
          </IonButton>
        ) : cameras.length === 0 ? (
          <IonLabel>No cameras found</IonLabel>
        ) : (
          <IonSelect
            value={selectedCamera}
            interface='popover'
            onIonChange={handleCameraChange}
            style={{ background: '#f5f5f5' }}
          >
            {cameras.map((camera) => (
              <IonSelectOption key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        )}
      </div>
    </>
  );
};

export default CameraSelector;

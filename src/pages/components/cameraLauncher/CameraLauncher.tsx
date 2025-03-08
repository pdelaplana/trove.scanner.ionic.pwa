import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonText,
  IonLoading,
} from '@ionic/react';
import { camera, close } from 'ionicons/icons';
import jsQR from 'jsqr';
import './cameraLauncher.css';
import BasePageLayout from '../layouts/BasePageLayout';
import CenterContainer from '../layouts/CenterContainer';
import CameraSelector from './CameraSelector';

const CameraLauncher: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const history = useHistory();
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const handleCameraSelect = (deviceId: string) => {
    setSelectedCameraId(deviceId);
  };

  const startScanner = async () => {
    setError(null);
    setLoading(true);
    setScanning(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera access");
      }

      // Modified to work better with laptops - no explicit facing mode preference
      // This will typically select the default camera (front-facing on laptops)
      let stream = null;

      try {
        // Use the selected camera if available
        const constraints = {
          video: selectedCameraId
            ? { deviceId: { exact: selectedCameraId } }
            : true,
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (initialError) {
        console.log(
          'Unable to access default camera, trying specific options:',
          initialError
        );

        // If that fails, try with explicit options
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );

        if (videoDevices.length === 0) {
          throw new Error('No camera found on your device');
        }

        // Try to use the first available camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoDevices[0].deviceId },
        });
      }

      streamRef.current = stream;

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');

          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setScanning(true);
            setLoading(false);
            scanQRCode();
          };
        }
      }, 1000);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setLoading(false);
    }
  };

  const stopScanner = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setScanning(false);
  };

  const scanQRCode = () => {
    if (!scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          // Successfully found a QR code
          stopScanner();

          // Process the QR code data here
          handleQRCodeData(code.data);
          return;
        }
      }
    }

    // Continue scanning if no QR code was found
    animationRef.current = requestAnimationFrame(scanQRCode);
  };

  const handleQRCodeData = (data: string) => {
    try {
      // Check if the data is a URL
      const url = new URL(data);

      // Process the URL
      if (url.pathname.includes('scan')) {
        // Extract parameters from the URL
        const params = new URLSearchParams(url.search);
        const memberno = params.get('memberno');
        const businessid = params.get('businessid');

        // Navigate to a route in your app with the parameters
        history.push(`/scan?memberno=${memberno}&businessid=${businessid}`);
      } else if (url.pathname.includes('redeem')) {
        // Extract parameters from the URL
        const params = new URLSearchParams(url.search);
        const rewardcode = params.get('rewardcode');
        const businessid = params.get('businessid');

        // Navigate to a route in your app with the parameters
        history.push(
          `/redeem?rewardcode=${rewardcode}&businessid=${businessid}`
        );
      } else {
        // Handle other URLs
        window.open(data, '_blank');
      }
    } catch (e) {
      // Not a URL, handle as plain text
      console.log('Scanned data:', data);
    }
  };

  useEffect(() => {
    if (scanning) {
      scanQRCode();
    }
  }, [scanning]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <>
      <div className='scanner-container'>
        {scanning ? (
          <>
            <video ref={videoRef} className='scanner-video' playsInline />
            <canvas ref={canvasRef} className='scanner-canvas' />
            <div className='scan-region-highlight'></div>

            <IonFab vertical='bottom' horizontal='center' slot='fixed'>
              <IonFabButton onClick={stopScanner} color='danger'>
                <IonIcon icon={close} />
              </IonFabButton>
            </IonFab>
          </>
        ) : (
          <div className='scanner-placeholder'>
            <IonText color='medium'>
              <p>
                Select a camera on your device and press the button to scan a QR
                code
              </p>
            </IonText>
            <CameraSelector onSelectCamera={handleCameraSelect} />

            <IonButton
              expand='block'
              onClick={startScanner}
              className='scanner-button'
            >
              <IonIcon slot='start' icon={camera} />
              Start Scanner
            </IonButton>

            {error && (
              <IonText color='danger'>
                <p>{error}</p>
              </IonText>
            )}
          </div>
        )}
      </div>
      <IonLoading isOpen={loading} message='Accessing camera...' />
    </>
  );
};

export default CameraLauncher;

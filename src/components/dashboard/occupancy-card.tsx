
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectOccupancy } from "@/app/actions";
import type { Appliance } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import emailjs from '@emailjs/browser';

type OccupancyCardProps = {
  setOccupancy: (count: number) => void;
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
};

export function OccupancyCard({ setOccupancy, setAppliances }: OccupancyCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    } else {
      console.error("EmailJS Public Key is not set.");
      toast({
        variant: "destructive",
        title: "EmailJS Not Configured",
        description: "The EmailJS Public Key is missing from the environment variables.",
      });
    }
  }, [toast]);


  const sendEmailNotification = (message: string) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName") || "User";
    
    if (!userEmail) {
      console.log("No user email found for notification.");
      return;
    }
    
    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are not set.");
      toast({
        variant: "destructive",
        title: "Email Not Sent",
        description: "EmailJS configuration is missing.",
      });
      return;
    }

    const templateParams = {
      to_name: userName,
      to_email: userEmail,
      from_name: "EcoTrack AI",
      message: message,
    };

    emailjs.send(serviceId, templateId, templateParams)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        toast({
          title: "Notification Sent",
          description: `An alert has been sent to ${userEmail}.`,
        });
      }, (err) => {
        console.error('FAILED...', err);
        toast({
          variant: "destructive",
          title: "Notification Failed",
          description: "Could not send the email alert. Please check EmailJS configuration and credentials.",
        });
      });
  };

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  const handleAnalyze = async () => {
    if (!videoRef.current || !hasCameraPermission) return;

    setLoading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const context = canvas.getContext("2d");
      if (videoRef.current.videoWidth > 0) {
        context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg", 0.8);
        
        const result = await detectOccupancy({ photoDataUri: dataUri });
        setOccupancy(result.occupantCount);

        if (result.occupantCount === 0 && result.fanInMotion) {
           setAppliances((prev) =>
            prev.map((app) =>
              app.name.toLowerCase().includes("fan")
                ? { ...app, status: "Off" }
                : app
            )
          );
          const notificationMessage = "The AI detected an empty room and turned off the fan to save energy.";
          toast({
            title: "Room Empty: Fan Turned Off",
            description: notificationMessage,
          });

          // Send a notification via EmailJS
          sendEmailNotification(notificationMessage);

        } else if (result.occupantCount > 0) {
           toast({
            title: "Occupancy Detected",
            description: `The AI detected ${result.occupantCount} occupant(s) in the room.`,
          });
        }
      }
    } catch (error)
      {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Could not analyze the image. Please try again.";
      if (!errorMessage.includes('overloaded')) {
        toast({
          variant: "destructive",
          title: "Detection Failed",
          description: errorMessage,
        });
      }
      setOccupancy(0);
    } 
    finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (hasCameraPermission) {
      const interval = setInterval(() => {
        handleAnalyze();
      }, 15000); // Analyze every 15 seconds

      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCameraPermission]);


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Occupancy Detection</CardTitle>
            <CardDescription>
              Continuously analyzing the camera feed.
            </CardDescription>
          </div>
          {loading && <Loader2 className="animate-spin text-primary" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
          {!hasCameraPermission && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Alert variant="destructive" className="w-auto">
                <Camera className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectOccupancy } from "@/app/actions";
import type { Appliance } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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
    if (!videoRef.current) return;

    setLoading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL("image/jpeg");
      
      const result = await detectOccupancy({ photoDataUri: dataUri });
      setOccupancy(result.occupantCount);

      if (result.occupantCount === 0) {
        setAppliances((prev) =>
          prev.map((app) => ({ ...app, status: "Off" }))
        );
        toast({
          title: "Room Empty",
          description: "All appliances have been turned off automatically.",
        });
      } else {
        toast({
          title: "Occupancy Detected",
          description: `The AI detected ${result.occupantCount} occupant(s) in the room.`,
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Detection Failed",
        description: "Could not analyze the image. Please try again.",
      });
      setOccupancy(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Detection</CardTitle>
        <CardDescription>
          Analyze a live camera feed to determine room occupancy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
          {!hasCameraPermission && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Alert variant="destructive" className="w-auto">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAnalyze}
          disabled={loading || !hasCameraPermission}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Camera className="mr-2" />
          )}
          <span>{loading ? "Analyzing..." : "Analyze Camera Feed"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

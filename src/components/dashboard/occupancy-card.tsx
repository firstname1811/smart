"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectOccupancy } from "@/app/actions";

type OccupancyCardProps = {
  setOccupancy: (count: number) => void;
};

export function OccupancyCard({ setOccupancy }: OccupancyCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const roomImage = PlaceHolderImages.find((img) => img.id === "living-room");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        const result = await detectOccupancy({ photoDataUri: dataUri });
        setOccupancy(result.occupantCount);
        toast({
          title: "Occupancy Detected",
          description: `The AI detected ${result.occupantCount} occupant(s) in the room.`,
        });
      };
      reader.readAsDataURL(file);
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Detection</CardTitle>
        <CardDescription>
          Analyze a camera feed to determine room occupancy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          {roomImage && (
            <Image
              src={roomImage.imageUrl}
              alt={roomImage.description}
              fill
              className="object-cover"
              data-ai-hint={roomImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Upload className="mr-2" />
          )}
          <span>{loading ? "Analyzing..." : "Upload Image & Analyze"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

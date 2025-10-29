
"use client";

import { ApplianceControl } from "@/components/dashboard/appliance-control";
import { AutomatedAdjustments } from "@/components/dashboard/automated-adjustments";
import { OccupancyCard } from "@/components/dashboard/occupancy-card";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import type { Appliance } from "@/lib/types";
import { Fan } from "lucide-react";
import { useState, useEffect } from "react";

const initialAppliances: Appliance[] = [
  { id: "fan-1", name: "Ceiling Fan", icon: Fan, status: "On", power: 75 },
];

export default function DashboardPage() {
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    if (typeof window !== 'undefined') {
      const savedAppliances = localStorage.getItem('appliances');
      if (savedAppliances) {
        try {
          const parsed = JSON.parse(savedAppliances);
          // The icon property can't be stored in JSON, so we need to re-assign it.
          return parsed.map((app: Appliance) => ({...app, icon: Fan}));
        } catch (e) {
          console.error("Failed to parse appliances from localStorage", e);
          return initialAppliances;
        }
      }
    }
    return initialAppliances;
  });

  const [occupancy, setOccupancy] = useState(0);
  const [energyThreshold, setEnergyThreshold] = useState(500); // Default threshold in Watts

  useEffect(() => {
    if (typeof window !== 'undefined') {
       // We need to strip out non-serializable parts like the icon component before saving.
      const appliancesToSave = appliances.map(({ icon, ...rest }) => rest);
      localStorage.setItem('appliances', JSON.stringify(appliancesToSave));
    }
  }, [appliances]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your smart energy management hub.</p>
      </div>

      <OverviewStats appliances={appliances} occupancy={occupancy} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplianceControl appliances={appliances} setAppliances={setAppliances} />
        </div>
        <div className="flex flex-col gap-6">
          <OccupancyCard setOccupancy={setOccupancy} setAppliances={setAppliances} />
          <AutomatedAdjustments 
            appliances={appliances}
            occupancy={occupancy}
            energyThreshold={energyThreshold}
            setAppliances={setAppliances}
          />
        </div>
      </div>
    </div>
  );
}

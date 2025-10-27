"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import type { Appliance } from "@/lib/types";
import { cn } from "@/lib/utils";

type ApplianceControlProps = {
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
};

export function ApplianceControl({
  appliances,
  setAppliances,
}: ApplianceControlProps) {
  const handleToggle = (id: string, checked: boolean) => {
    setAppliances((prev) =>
      prev.map((appliance) =>
        appliance.id === id
          ? { ...appliance, status: checked ? "On" : "Off" }
          : appliance
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appliance Control</CardTitle>
        <CardDescription>Monitor and control your smart appliances in real-time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead>Appliance</TableHead>
              <TableHead className="text-right">Power</TableHead>
              <TableHead className="w-[100px] text-right">Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appliances.map((appliance) => (
              <TableRow key={appliance.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-2 w-2 rounded-full", {
                        "bg-green-500": appliance.status === "On",
                        "bg-muted-foreground": appliance.status === "Off",
                      })}
                    />
                    <span className="text-sm font-medium">{appliance.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <appliance.icon className="h-6 w-6 text-muted-foreground" />
                    <span className="font-medium">{appliance.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{appliance.power}W</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={appliance.status === "On"}
                    onCheckedChange={(checked) =>
                      handleToggle(appliance.id, checked)
                    }
                    aria-label={`Toggle ${appliance.name}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

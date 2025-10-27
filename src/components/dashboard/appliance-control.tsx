
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
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ApplianceControlProps = {
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
};

export function ApplianceControl({
  appliances,
  setAppliances,
}: ApplianceControlProps) {
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(
    null
  );
  const [editedName, setEditedName] = useState("");
  const [editedPower, setEditedPower] = useState("");
  const { toast } = useToast();

  const handleToggle = (id: string, checked: boolean) => {
    setAppliances((prev) =>
      prev.map((appliance) =>
        appliance.id === id
          ? { ...appliance, status: checked ? "On" : "Off" }
          : appliance
      )
    );
  };

  const handleDelete = (id: string) => {
    setAppliances((prev) => prev.filter((appliance) => appliance.id !== id));
    toast({
      title: "Appliance Removed",
      description: "The appliance has been removed from your list.",
    });
  };

  const handleEditClick = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setEditedName(appliance.name);
    setEditedPower(appliance.power.toString());
  };

  const handleSaveEdit = () => {
    if (!editingAppliance) return;

    setAppliances((prev) =>
      prev.map((app) =>
        app.id === editingAppliance.id
          ? { ...app, name: editedName, power: parseInt(editedPower, 10) }
          : app
      )
    );
    toast({
      title: "Appliance Updated",
      description: "The appliance details have been successfully updated.",
    });
    setEditingAppliance(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appliance Control</CardTitle>
        <CardDescription>
          Monitor and control your smart appliances in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead>Appliance</TableHead>
              <TableHead>Power</TableHead>
              <TableHead className="w-[100px] text-right">Control</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
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
                    <span className="text-sm font-medium">
                      {appliance.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <appliance.icon className="h-6 w-6 text-muted-foreground" />
                    <span className="font-medium">{appliance.name}</span>
                  </div>
                </TableCell>
                <TableCell>{appliance.power}W</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={appliance.status === "On"}
                    onCheckedChange={(checked) =>
                      handleToggle(appliance.id, checked)
                    }
                    aria-label={`Toggle ${appliance.name}`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Dialog
                      open={editingAppliance?.id === appliance.id}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) setEditingAppliance(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(appliance)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(appliance.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {editingAppliance && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Appliance</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="power" className="text-right">
                  Power (W)
                </Label>
                <Input
                  id="power"
                  type="number"
                  value={editedPower}
                  onChange={(e) => setEditedPower(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </CardContent>
    </Card>
  );
}

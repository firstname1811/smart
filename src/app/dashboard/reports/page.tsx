import { getEnergyReport } from "@/app/actions";
import { EnergyUsageChart } from "@/components/reports/energy-usage-chart";
import { PredictiveEnergyForm } from "@/components/reports/predictive-energy-form";

export default async function ReportsPage() {
  const energyData = await getEnergyReport();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Predictions</h1>
        <p className="text-muted-foreground">
          Analyze past usage and predict future energy needs.
        </p>
      </div>

      <EnergyUsageChart chartData={energyData.report} />
      <PredictiveEnergyForm />
    </div>
  );
}

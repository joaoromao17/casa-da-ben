
import { Progress } from "@/components/ui/progress";

interface ProgressCounterProps {
  current: number;
  goal: number;
  label: string;
}

const ProgressCounter = ({ current, goal, label }: ProgressCounterProps) => {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-medium text-church-800">{label}</span>
        <span className="font-bold text-xl text-church-600">
          {current} <span className="text-gray-500 text-base">/ {goal}</span>
        </span>
      </div>
      <Progress value={percentage} className="h-3 bg-gray-200" />
      <div className="text-right mt-1 text-sm text-gray-600">{percentage}% completo</div>
    </div>
  );
};

export default ProgressCounter;

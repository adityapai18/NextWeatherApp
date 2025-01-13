import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { ForecastCardProps } from "@/types";

const ForecastCard = ({
  summary,
  temperature,
  dateAndTime,
}: ForecastCardProps) => {
  const [firstHalf, secondHalf] = dateAndTime.split(' ');

  return (
    <Card className="flex justify-between items-center px-3 w-full py-4">
      <CardContent className="flex flex-col justify-between">
        <span className="text-base">{firstHalf}</span>
        <span className="text-base">{secondHalf}</span>
      </CardContent>
      <CardContent className="my-auto flex justify-between gap-3 flex-col">
        <CardDescription>{temperature}°C</CardDescription>
        <CardDescription>{summary}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;

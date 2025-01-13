import ForecastCard from "@/components/ForecastCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Sample mock forecast data
const mockForecastData = {
  list: [
    { dt_txt: "2025-01-13 12:00:00", main: { temp: 22.3 }, weather: [{ main: "Clear" }] },
    { dt_txt: "2025-01-14 12:00:00", main: { temp: 18.7 }, weather: [{ main: "Clouds" }] },
    { dt_txt: "2025-01-15 12:00:00", main: { temp: 15.5 }, weather: [{ main: "Rain" }] },
    { dt_txt: "2025-01-16 12:00:00", main: { temp: 20.1 }, weather: [{ main: "Sunny" }] },
    { dt_txt: "2025-01-17 12:00:00", main: { temp: 17.8 }, weather: [{ main: "Snow" }] },
  ],
};

const Forecast = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">5 Days Forecast</h1>
      <ScrollArea className="h-72 2xl:w-[40rem] xl:w-[35rem] lg:w-[25rem] md:w-[20rem] rounded-md border">
        <div className="p-4">
          {mockForecastData.list.map((item, index) => (
            <>
              <ForecastCard
                key={index}
                temperature={item.main.temp}
                summary={item.weather[0].main}
                dateAndTime={item.dt_txt}
              />
              <Separator className="my-2" />
            </>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Forecast;

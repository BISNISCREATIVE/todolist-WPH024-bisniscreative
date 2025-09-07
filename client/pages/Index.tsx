import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCompleted, setDateRange } from "@/store/filtersSlice";
import FiltersBar from "./components/FiltersBar";
import AddTaskDialog from "./components/AddTaskDialog";
import TodoList from "./components/TodoList";
import ThemeToggle from "@/components/ThemeToggle";
import dayjs from "dayjs";

export default function Index() {
  const f = useAppSelector((s) => s.filters);
  const dispatch = useAppDispatch();

  const setToday = () => {
    const start = dayjs().startOf("day").toISOString();
    const end = dayjs().endOf("day").toISOString();
    dispatch(setCompleted("all"));
    dispatch(setDateRange({ gte: start, lte: end }));
  };
  const setUpcoming = () => {
    const start = dayjs().add(1, "day").startOf("day").toISOString();
    dispatch(setCompleted("all"));
    dispatch(setDateRange({ gte: start, lte: undefined }));
  };
  const setCompletedOnly = () => {
    dispatch(setCompleted("completed"));
    dispatch(setDateRange({ gte: undefined, lte: undefined }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl lg:max-w-3xl mx-auto p-4 space-y-4">
        <header className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">What's on Your Plan Today?</h1>
              <p className="text-sm text-muted-foreground">Your productivity starts now.</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <Tabs
          value={
            f.completed === "completed"
              ? "completed"
              : f.dateGte
                ? dayjs(f.dateGte).isAfter(dayjs(), "day")
                  ? "upcoming"
                  : "today"
                : "today"
          }
        >
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger
              value="today"
              onClick={setToday}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              onClick={setUpcoming}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              onClick={setCompletedOnly}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today" />
          <TabsContent value="upcoming" />
          <TabsContent value="completed" />
        </Tabs>

        <FiltersBar />
        <TodoList />
        <AddTaskDialog />
      </div>
    </div>
  );
}

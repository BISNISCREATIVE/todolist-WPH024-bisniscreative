import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCompleted, setDateRange } from "@/store/filtersSlice";
import FiltersBar from "./components/FiltersBar";
import AddTaskDialog from "./components/AddTaskDialog";
import TodoList from "./components/TodoList";
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
      <div className="max-w-md mx-auto p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">What's on Your Plan Today?</h1>
          <p className="text-sm text-muted-foreground">Your productivity starts now.</p>
        </header>

        <Tabs value={f.completed === "completed" ? "completed" : f.dateGte ? (dayjs(f.dateGte).isAfter(dayjs(), "day") ? "upcoming" : "today") : "today"}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="today" onClick={setToday}>Today</TabsTrigger>
            <TabsTrigger value="upcoming" onClick={setUpcoming}>Upcoming</TabsTrigger>
            <TabsTrigger value="completed" onClick={setCompletedOnly}>Completed</TabsTrigger>
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

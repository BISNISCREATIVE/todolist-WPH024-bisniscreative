import { useAppDispatch, useAppSelector } from "@/store";
import { resetFilters, setCompleted, setDateRange, setOrder, setPriority, setSearch, setSort, setViewMode } from "@/store/filtersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FiltersBar() {
  const f = useAppSelector((s) => s.filters);
  const dispatch = useAppDispatch();

  return (
    <div className="grid gap-2 md:grid-cols-6">
      <div className="md:col-span-2">
        <Label>Search</Label>
        <Input value={f.search} onChange={(e) => dispatch(setSearch(e.target.value))} placeholder="Search..." />
      </div>
      <div>
        <Label>Completed</Label>
        <Select value={f.completed} onValueChange={(v) => dispatch(setCompleted(v as any))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Priority</Label>
        <Select value={f.priority} onValueChange={(v) => dispatch(setPriority(v as any))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Sort</Label>
        <Select value={f.sort} onValueChange={(v) => dispatch(setSort(v as any))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Order</Label>
        <Select value={f.order} onValueChange={(v) => dispatch(setOrder(v as any))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Asc</SelectItem>
            <SelectItem value="desc">Desc</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>View</Label>
        <Select value={f.viewMode} onValueChange={(v) => dispatch(setViewMode(v as any))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="page">Page</SelectItem>
            <SelectItem value="scroll">Infinite</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label>Date From</Label>
        <Input type="date" value={f.dateGte?.slice(0,10) ?? ""} onChange={(e) => dispatch(setDateRange({ gte: e.target.value ? new Date(e.target.value).toISOString() : undefined, lte: f.dateLte }))} />
      </div>
      <div className="md:col-span-2">
        <Label>Date To</Label>
        <Input type="date" value={f.dateLte?.slice(0,10) ?? ""} onChange={(e) => dispatch(setDateRange({ gte: f.dateGte, lte: e.target.value ? new Date(e.target.value).toISOString() : undefined }))} />
      </div>
      <div className="md:col-span-2 flex items-end">
        <Button variant="secondary" className="w-full" onClick={() => dispatch(resetFilters())}>Reset</Button>
      </div>
    </div>
  );
}

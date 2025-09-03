import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import dayjs from "dayjs";
import type { Todo } from "@shared/todos";
import { useTodosData } from "@/hooks/useTodos";

function PriorityBadge({ p }: { p: Todo["priority"] }) {
  const color = p === "high" ? "bg-pink-600" : p === "medium" ? "bg-yellow-500" : "bg-green-600";
  return <Badge className={`${color} text-white`}>{p.charAt(0).toUpperCase() + p.slice(1)}</Badge>;
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const { toggleMutation, deleteMutation } = useTodosData();
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 flex items-start gap-3">
      <Checkbox checked={todo.completed} onCheckedChange={() => toggleMutation.mutate(todo)} />
      <div className="flex-1">
        <div className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.title}</div>
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
          <span>{todo.date ? dayjs(todo.date).format("MMM D, YYYY") : "No date"}</span>
          <PriorityBadge p={todo.priority} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(todo.id)}>
          <Trash className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

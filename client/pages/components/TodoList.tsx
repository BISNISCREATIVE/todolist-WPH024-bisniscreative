import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import TodoItem from "./TodoItem";
import { useTodosData } from "@/hooks/useTodos";
import { useAppDispatch, useAppSelector } from "@/store";
import { setPage } from "@/store/filtersSlice";

export default function TodoList() {
  const { filters, pageQuery, infQuery } = useTodosData();
  const dispatch = useAppDispatch();

  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (filters.viewMode !== "scroll") return;
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (
        e.isIntersecting &&
        infQuery.hasNextPage &&
        !infQuery.isFetchingNextPage
      ) {
        infQuery.fetchNextPage();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [filters.viewMode, infQuery.hasNextPage, infQuery.isFetchingNextPage]);

  if (filters.viewMode === "page") {
    if (pageQuery.isLoading) return <SkeletonList />;
    if (pageQuery.isError)
      return <div className="text-red-500">Error loading</div>;
    const data = pageQuery.data!;
    return (
      <div className="space-y-3">
        {data.todos.length === 0 ? (
          <Empty searchActive={!!filters.search} />
        ) : (
          data.todos.map((t) => <TodoItem key={t.id} todo={t} />)
        )}
        <div className="flex justify-between items-center pt-2">
          <button
            className="text-sm underline"
            disabled={filters.page <= 1}
            onClick={() => dispatch(setPage(filters.page - 1))}
          >
            Prev
          </button>
          <div className="text-xs text-muted-foreground">
            Page {filters.page}
          </div>
          <button
            className="text-sm underline"
            disabled={!data.hasNextPage}
            onClick={() => dispatch(setPage(filters.page + 1))}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // infinite
  return (
    <div className="space-y-3">
      {infQuery.isLoading ? <SkeletonList /> : null}
      {infQuery.data?.pages
        .flatMap((p) => p.todos)
        .map((t) => (
          <TodoItem key={t.id} todo={t} />
        ))}
      {infQuery.isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      {!infQuery.hasNextPage && infQuery.data && (
        <div className="text-center text-xs text-muted-foreground py-3">
          No more
        </div>
      )}
      <div ref={sentinel} className="h-8" />
      {infQuery.data &&
      infQuery.data.pages.every((p) => p.todos.length === 0) ? (
        <Empty searchActive={!!filters.search} />
      ) : null}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}

function Empty({ searchActive }: { searchActive?: boolean }) {
  return (
    <div className="text-center text-sm text-muted-foreground py-6">
      {searchActive ? "Try a different keyword." : "Nothing to do yet!"}
    </div>
  );
}

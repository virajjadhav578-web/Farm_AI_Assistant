"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { DemoStore } from "@/lib/supabase/demo-store";
import { FarmTask, FarmPlot, TaskPriority, TaskStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  CheckCircle2,
} from "lucide-react";

export default function TasksPage() {
  const { t } = useLanguage();

  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plotId, setPlotId] = useState("");
  const [dueDate, setDueDate] = useState("2026-10-25");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const reloadTasks = () => {
    setTasks(DemoStore.getTasks());
    setPlots(DemoStore.getPlots());
  };

  useEffect(() => {
    reloadTasks();
  }, []);

  const handleToggle = (id: string) => {
    DemoStore.toggleTaskStatus(id);
    reloadTasks();
  };

  const handleDelete = (id: string) => {
    DemoStore.deleteTask(id);
    reloadTasks();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedPlot = plots.find((p) => p.id === plotId);

    DemoStore.saveTask({
      title: title.trim(),
      description: description.trim() || undefined,
      plot_id: plotId || undefined,
      plot_name: matchedPlot ? matchedPlot.name : undefined,
      due_date: dueDate,
      priority,
      status: "pending",
      reminder_type: "in_app",
    });

    setTitle("");
    setDescription("");
    setModalOpen(false);
    reloadTasks();
  };

  let filteredTasks = tasks;
  if (filter === "pending") filteredTasks = tasks.filter((t) => t.status !== "completed");
  if (filter === "completed") filteredTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-farm-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-farm-950 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-farm-700" />
              {t.tasks.title}
            </h1>
            <Badge variant="default" className="text-[10px]">
              {tasks.filter((t) => t.status !== "completed").length} Pending
            </Badge>
          </div>
          <p className="text-xs text-farm-600 mt-0.5">{t.tasks.subtitle}</p>
        </div>

        <Button onClick={() => setModalOpen(true)} size="sm" className="gap-1.5 shadow-xs">
          <Plus className="h-4 w-4" />
          {t.tasks.addTaskBtn}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-farm-100 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === "all" ? "bg-farm-700 text-white" : "text-farm-700 hover:bg-farm-100"
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === "pending" ? "bg-farm-700 text-white" : "text-farm-700 hover:bg-farm-100"
          }`}
        >
          Pending ({tasks.filter((t) => t.status !== "completed").length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === "completed" ? "bg-farm-700 text-white" : "text-farm-700 hover:bg-farm-100"
          }`}
        >
          Completed ({tasks.filter((t) => t.status === "completed").length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-farm-200 bg-white p-10 text-center text-xs text-farm-600">
            <p>No farming tasks found in this view.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-farm-200/90 bg-white p-4 shadow-2xs hover:border-farm-300 transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => handleToggle(task.id)}
                  className="mt-1 h-4 w-4 rounded border-farm-300 text-farm-700 focus:ring-farm-600 cursor-pointer"
                />
                <div className="space-y-1">
                  <h4
                    className={`font-semibold text-xs ${
                      task.status === "completed"
                        ? "line-through text-farm-400"
                        : "text-farm-900"
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-[11px] text-farm-600 leading-relaxed">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-farm-500 pt-1">
                    {task.plot_name && (
                      <span className="flex items-center gap-1 font-medium text-farm-700">
                        <MapPin className="h-3 w-3" /> {task.plot_name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due: {task.due_date}
                    </span>
                    <span>Reminder: In-App</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={
                    task.priority === "urgent"
                      ? "destructive"
                      : task.priority === "high"
                      ? "warning"
                      : "default"
                  }
                  className="text-[10px]"
                >
                  {task.priority}
                </Badge>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-1 rounded text-farm-400 hover:text-rose-600"
                  title="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-farm-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-farm-100 pb-3">
              <h3 className="font-bold text-base text-farm-950">Add Farming Task</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-farm-400 hover:text-farm-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-farm-800">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Inspect for pink bollworm, Apply 10:26:26"
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">Description / Specific Instructions</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes, chemical rates, or field observations..."
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Associated Plot</label>
                  <select
                    value={plotId}
                    onChange={(e) => setPlotId(e.target.value)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  >
                    <option value="">General / Farm-wide</option>
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-farm-800">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-farm-800">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-lg border border-farm-200 px-3 py-2 text-xs focus:border-farm-600 focus:outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent / Critical Spray</option>
                </select>
              </div>

              <div className="pt-3 border-t border-farm-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

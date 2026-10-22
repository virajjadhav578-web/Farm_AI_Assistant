import { FarmPlot, FarmTask, UserProfile, DiseaseAnalysisResult, MandiPriceRecord } from "@/types";

const INITIAL_PROFILE: UserProfile = {
  id: "demo-farmer-1",
  full_name: "Ganesh Patil",
  preferred_language: "en",
  state: "Maharashtra",
  district: "Pune",
  village: "Baramati",
  farming_experience_years: 12,
  farm_area: 5.5,
  area_unit: "acres",
  soil_type: "Black Cotton Soil (Regur)",
  water_availability: "Canal & Drip Borewell",
};

const INITIAL_PLOTS: FarmPlot[] = [
  {
    id: "plot-1",
    user_id: "demo-farmer-1",
    name: "Wada Field (Cotton Bt)",
    area: 2.5,
    area_unit: "acres",
    soil_type: "Black Cotton Soil (Regur)",
    current_crop: "Cotton (Bt)",
    sowing_date: "2026-06-25",
    irrigation_method: "Drip",
    growth_stage: "Flowering / Boll Formation",
  },
  {
    id: "plot-2",
    user_id: "demo-farmer-1",
    name: "Canal Plot (Sugarcane)",
    area: 3.0,
    area_unit: "acres",
    soil_type: "Clay Loam",
    current_crop: "Sugarcane",
    sowing_date: "2026-02-15",
    irrigation_method: "Drip",
    growth_stage: "Grand Growth",
  },
];

const INITIAL_TASKS: FarmTask[] = [
  {
    id: "task-1",
    user_id: "demo-farmer-1",
    plot_id: "plot-1",
    plot_name: "Wada Field (Cotton Bt)",
    title: "Inspect for pink bollworm & install pheromone lures",
    description: "Check 20 green bolls across the field. If damage > 5%, report to KVK.",
    due_date: "2026-10-24",
    priority: "high",
    status: "pending",
    reminder_type: "in_app",
  },
  {
    id: "task-2",
    user_id: "demo-farmer-1",
    plot_id: "plot-2",
    plot_name: "Canal Plot (Sugarcane)",
    title: "Fertigation: Urea + MOP top-dressing",
    description: "Run drip fertigation through venturi injector for 45 minutes.",
    due_date: "2026-10-26",
    priority: "medium",
    status: "pending",
    reminder_type: "in_app",
  },
  {
    id: "task-3",
    user_id: "demo-farmer-1",
    plot_id: "plot-1",
    plot_name: "Wada Field (Cotton Bt)",
    title: "Flush drip laterals and clean disc filters",
    description: "Prevent algae and silt clogging before next irrigation cycle.",
    due_date: "2026-10-20",
    priority: "low",
    status: "completed",
    reminder_type: "in_app",
  },
];

export class DemoStore {
  private static isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  static getProfile(): UserProfile {
    if (!this.isBrowser()) return INITIAL_PROFILE;
    const stored = localStorage.getItem("farm_demo_profile");
    if (!stored) {
      localStorage.setItem("farm_demo_profile", JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PROFILE;
    }
  }

  static updateProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    if (this.isBrowser()) {
      localStorage.setItem("farm_demo_profile", JSON.stringify(updated));
    }
    return updated;
  }

  static getPlots(): FarmPlot[] {
    if (!this.isBrowser()) return INITIAL_PLOTS;
    const stored = localStorage.getItem("farm_demo_plots");
    if (!stored) {
      localStorage.setItem("farm_demo_plots", JSON.stringify(INITIAL_PLOTS));
      return INITIAL_PLOTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PLOTS;
    }
  }

  static savePlot(plot: Omit<FarmPlot, "id" | "user_id"> & { id?: string }): FarmPlot {
    const plots = this.getPlots();
    if (plot.id) {
      // Edit
      const idx = plots.findIndex(p => p.id === plot.id);
      if (idx !== -1) {
        plots[idx] = { ...plots[idx], ...plot };
        if (this.isBrowser()) localStorage.setItem("farm_demo_plots", JSON.stringify(plots));
        return plots[idx];
      }
    }
    // New
    const newPlot: FarmPlot = {
      id: "plot-" + Date.now(),
      user_id: "demo-farmer-1",
      ...plot,
    };
    plots.push(newPlot);
    if (this.isBrowser()) localStorage.setItem("farm_demo_plots", JSON.stringify(plots));
    return newPlot;
  }

  static deletePlot(plotId: string): void {
    const plots = this.getPlots().filter(p => p.id !== plotId);
    if (this.isBrowser()) localStorage.setItem("farm_demo_plots", JSON.stringify(plots));
  }

  static getTasks(): FarmTask[] {
    if (!this.isBrowser()) return INITIAL_TASKS;
    const stored = localStorage.getItem("farm_demo_tasks");
    if (!stored) {
      localStorage.setItem("farm_demo_tasks", JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_TASKS;
    }
  }

  static saveTask(task: Omit<FarmTask, "id" | "user_id"> & { id?: string }): FarmTask {
    const tasks = this.getTasks();
    if (task.id) {
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], ...task };
        if (this.isBrowser()) localStorage.setItem("farm_demo_tasks", JSON.stringify(tasks));
        return tasks[idx];
      }
    }
    const newTask: FarmTask = {
      id: "task-" + Date.now(),
      user_id: "demo-farmer-1",
      ...task,
    };
    tasks.unshift(newTask);
    if (this.isBrowser()) localStorage.setItem("farm_demo_tasks", JSON.stringify(tasks));
    return newTask;
  }

  static toggleTaskStatus(taskId: string): FarmTask | null {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = task.status === "completed" ? "pending" : "completed";
      if (this.isBrowser()) localStorage.setItem("farm_demo_tasks", JSON.stringify(tasks));
      return task;
    }
    return null;
  }

  static deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    if (this.isBrowser()) localStorage.setItem("farm_demo_tasks", JSON.stringify(tasks));
  }

  static getWatchlist(): string[] {
    if (!this.isBrowser()) return ["Onion (कांदा)", "Soybean (सोयाबीन)"];
    const stored = localStorage.getItem("farm_mandi_watchlist");
    return stored ? JSON.parse(stored) : ["Onion (कांदा)", "Soybean (सोयाबीन)"];
  }

  static toggleWatchlist(cropName: string): boolean {
    const list = this.getWatchlist();
    const idx = list.indexOf(cropName);
    let isAdded = false;
    if (idx !== -1) {
      list.splice(idx, 1);
    } else {
      list.push(cropName);
      isAdded = true;
    }
    if (this.isBrowser()) localStorage.setItem("farm_mandi_watchlist", JSON.stringify(list));
    return isAdded;
  }
}

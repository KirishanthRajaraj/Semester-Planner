export type TaskStatus = "todo" | "inprogress" | "done";

export interface TaskItem {
  id: string;
  title: string;
  date?: Date;
  duration?: number;
  parentId?: string;
  depth?: number;
  status?: TaskStatus;
  noDay?: boolean;
}
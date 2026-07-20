export interface TaskItem {
  id: string;
  title: string;
  date?: Date;
  parentId?: string;
  depth?: number;
}
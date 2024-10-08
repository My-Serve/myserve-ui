import { Injectable } from '@angular/core';
import {Task} from "../others/models/task";

@Injectable({
  providedIn: 'root'
})
export class ActiveTaskService {

  private readonly runningTasks : Map<string, Task> = new Map();
  private readonly failedTasks : Map<string, Task> = new Map();

  public showTasks : boolean = false;

  constructor() { }

  public get status(): 'progress' | 'complete' | 'failed' {
    if(this.failedTasks.size > 0)
      return 'failed';

    if(this.runningTasks.size > 0)
      return 'progress'

    return 'complete';
  }

  public createTask(label: string) : Task {
    const task = new Task(label);
    task.onFinished = (status) => {
      this.runningTasks.delete(task.id);
      if(!this.status)
        this.failedTasks.set(task.id, task);
    }
    this.runningTasks.set(task.id, task);
    return task;
  }

  public open(){
    this.showTasks = true;
  }

  public close(){
    this.showTasks = false;
  }

  public get active() : number {
    return this.runningTasks.size;
  }

  public get error() : number {
    return this.failedTasks.size;
  }

  public get show(){
    return this.showTasks;
  }

  public get all() : Task[] {
    const unionMap = new Map<string, Task>();

    // Add entries from runningTasks
    for (const [key, value] of this.runningTasks) {
      unionMap.set(key, value);
    }

    // Add entries from failedTasks
    for (const [key, value] of this.failedTasks) {
      unionMap.set(key, value);
    }

    return Array.from(unionMap.values());
  }
}

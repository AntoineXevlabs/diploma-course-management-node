import {taskRunnerService} from './task-runner.service';

export const hourlyTaks = (context: any) => {
    return taskRunnerService.processHourlyTasks();
};

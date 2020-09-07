import {taskRunnerService} from './task-runner.service';

export const dailyTasks = (context: any) => {
    return taskRunnerService.processEventsForTomorrow()
}

import { getHash } from 'icmaa-config/helpers/hash'

import { TaskQueue } from '@vue-storefront/core/lib/sync'
import { Logger } from '@vue-storefront/core/lib/logger'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import rootStore from '@vue-storefront/core/store'

import { defaultStateKey } from '../store/default'
import * as types from '../store/default/mutation-types'

const getTaskId: Function = (s: string): string => `task-${getHash(s)}`

const IcmaaTaskQueue = {

  async execute (task: Record<string, any>): Promise<Task> {
    const taskId = getTaskId(task.url)
    return TaskQueue.execute(task).then(resp => {
      Logger.debug(`Fetched task: ${taskId}`, 'icmaa-task-queue', task.url)()
      return resp
    })
  },

  async queue (task: Record<string, any>): Promise<Task|any> {
    const taskId = getTaskId(task.url)
    Object.assign(
      task,
      {
        real_callback_event: task.callback_event,
        callback_event: 'store:icmaaCms/taskQueueSync'
      }
    )

    if (rootStore.getters[`${defaultStateKey}/getTaskById`](taskId)) {
      return task
    }

    Logger.debug(`Queued task: ${taskId}`, 'icmaa-task-queue', task.url)()

    rootStore.commit(`${defaultStateKey}/${types.ICMAA_CMS_TASK_ADD}`, taskId)
    return TaskQueue.queue(task)
  },

  getHash,
  getTaskId
}

export default IcmaaTaskQueue

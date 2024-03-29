import config from 'config';
import { DataResolver } from './types/DataResolver';
import { TaskQueue } from '@vue-storefront/core/lib/sync';
import Task from '@vue-storefront/core/lib/sync/types/Task';
import { processURLAddress } from '@vue-storefront/core/helpers';
import getApiEndpointUrl from '@vue-storefront/core/helpers/getApiEndpointUrl';

const queueCheck = (sku: string, actionName: string): Promise<any> =>
  TaskQueue.queue({
    url: processURLAddress(`${getApiEndpointUrl(config.stock, 'endpoint')}/check?sku=${encodeURIComponent(sku)}`),
    is_result_cacheable: true,
    product_sku: sku,
    callback_event: `store:${actionName}`
  })

const check = (sku: string): Promise<Task> =>
  TaskQueue.execute({
    url: processURLAddress(`${getApiEndpointUrl(config.stock, 'endpoint')}/check?sku=${encodeURIComponent(sku)}`),
    is_result_cacheable: true,
    product_sku: sku,
    silent: true
  })

const list = (skuList: string[]): Promise<Task> =>
  TaskQueue.execute({
    url: processURLAddress(
      `${getApiEndpointUrl(config.stock, 'endpoint')}/list?skus=${encodeURIComponent(
        skuList.join(',')
      )}`
    ),
    skus: skuList,
    silent: true
  })

export const StockService: DataResolver.StockService = {
  check,
  list,
  queueCheck
}

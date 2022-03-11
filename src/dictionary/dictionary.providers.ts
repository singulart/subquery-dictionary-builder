import { ApiPromise, WsProvider } from '@polkadot/api'
import { appConfig } from '../config';

export const providers = [
  {
    provide: 'PolkadotApiProvider',
    useFactory: async () => {
      console.debug(`Connecting to websocket ${appConfig.apiUrl}`)
      const provider = new WsProvider(appConfig.apiUrl)
      const api = await ApiPromise.create({ provider })
      await api.isReady
      console.debug(`Connection established`)
      return api
    },
  },
]
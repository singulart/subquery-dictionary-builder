import '@polkadot/api-augment';
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ApiPromise } from "@polkadot/api";
import { BlockHash, EventRecord } from "@polkadot/types/interfaces";
// import { Event } from "src/db/event.entity";
// import { Extrinsic } from "src/db/extrinsic.entity";
// import { SpecVersion } from "src/db/specversion.entity";


@Injectable()
export class DictionaryService {
  private readonly logger = new Logger(DictionaryService.name);

  constructor(
    @Inject('PolkadotApiProvider')
    private readonly api: ApiPromise,
    // @Inject('eventRepository')
    // private readonly eventRepository: typeof Event,
    // @Inject('extrinsicRepository')
    // private readonly extrinsicRepository: typeof Extrinsic,
    // @Inject('specVersionRepository')
    // private readonly specVersionRepository: typeof SpecVersion,

  ) { }

  async buildDictionary() {
    this.logger.log('buildDictionary()');
    const blockHash = await this.api.rpc.chain.getBlockHash(100).then((hash: BlockHash) => hash.toString());
    const blockEvents = await this.api.query.system.events.at(blockHash);

    blockEvents.forEach(async ({ event }: EventRecord) => {
      this.logger.log(event.data.toString());
    });

  }

}
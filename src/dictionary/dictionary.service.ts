import '@polkadot/api-augment';
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ApiPromise } from "@polkadot/api";
import { Block, BlockHash, EventRecord } from "@polkadot/types/interfaces";
import { Event } from "src/db/event.entity";
// import { Extrinsic } from "src/db/extrinsic.entity";
// import { SpecVersion } from "src/db/specversion.entity";


@Injectable()
export class DictionaryService {
  private readonly logger = new Logger(DictionaryService.name);

  constructor(
    @Inject('PolkadotApiProvider')
    private readonly api: ApiPromise,
    
    @Inject('eventRepository')
    private readonly eventRepository: typeof Event,
    // @Inject('extrinsicRepository')
    // private readonly extrinsicRepository: typeof Extrinsic,
    // @Inject('specVersionRepository')
    // private readonly specVersionRepository: typeof SpecVersion,

  ) { }

  async buildDictionary() {
    this.logger.log('buildDictionary()');
    const blockHeight = 100;
    const blockHash = await this.api.rpc.chain.getBlockHash(blockHeight).then((hash: BlockHash) => hash.toString());
    const block: Block = (await this.api.rpc.chain.getBlock(blockHash)).block;
    block.extrinsics.forEach((extr) => {
      this.logger.log(extr.toString());
    });

    const apipAt = await this.api.at(blockHash)
    const blockEvents = await apipAt.query.system.events();

    const eventsAr: Event[] = []
    blockEvents.forEach(async ({ event }: EventRecord) => {
      this.logger.log(event.data.toString());
      eventsAr.push({
        id: `${blockHeight}-${event.index.toString()}`, 
        blockHeight: blockHeight, 
        module: event.section,
        event: event.data.toString()
      } as Event)
    });
    
    if(eventsAr.length > 0) {
      await Event.bulkCreate(eventsAr);
    }

  }

}
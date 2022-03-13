import '@polkadot/api-augment';
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ApiPromise } from "@polkadot/api";
import { Block, BlockHash, EventRecord } from "@polkadot/types/interfaces";
import { Event } from "src/db/event.entity";
import { Extrinsic } from 'src/db/extrinsic.entity';
// import { SpecVersion } from "src/db/specversion.entity";


@Injectable()
export class DictionaryService {
  private readonly logger = new Logger(DictionaryService.name);

  constructor(
    @Inject('PolkadotApiProvider')
    private readonly api: ApiPromise,
    
    @Inject('eventRepository')
    private readonly eventRepository: typeof Event,
    @Inject('extrinsicRepository')
    private readonly extrinsicRepository: typeof Extrinsic,
    // @Inject('specVersionRepository')
    // private readonly specVersionRepository: typeof SpecVersion,

  ) { }

  async buildDictionary() {
    var i;
    for(i = 100; i < 300; i++) {
      await this.processBlock(i);
    }
  }

  //code below was adapted from https://github.com/subquery/subql-dictionary/blob/main/moonbeam/src/mappings/mappingHandlers.ts
  async processBlock(blockHeight: number) {
    this.logger.log('buildDictionary()');
    const blockHash = await this.api.rpc.chain.getBlockHash(blockHeight).then((hash: BlockHash) => hash.toString());

    const apipAt = await this.api.at(blockHash)
    const blockEvents = await apipAt.query.system.events();

    let eventIndex = 0
    const eventsAr = blockEvents.filter(
      (evt) =>
      evt.event.section !== "system" &&
      evt.event.method !== "ExtrinsicSuccess"
    )
    .map(({ event }: EventRecord) => { //TODO I can't use Event[] return type here because of TS2345
      return {
        id: `${blockHeight}-${eventIndex++}`, 
        blockHeight: blockHeight, 
        module: event.section,
        event: event.method
      }
    });
    
    if(eventsAr.length > 0) {
      await this.eventRepository.bulkCreate(eventsAr);
    }

    const block: Block = (await this.api.rpc.chain.getBlock(blockHash)).block;
    let extrinsicsIndex = 0
    const extrinsicsAr = block.extrinsics.map((extr) => { //TODO I can't use Extrinsic[] return type here because of TS2345
      const events = blockEvents.filter(
        ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eqn(extrinsicsIndex)
      );
      return {
        id: `${blockHeight}-${extrinsicsIndex++}`, 
        blockHeight: block.header.number.toBigInt(), 
        module: extr.method.section,
        call: extr.method.method,
        txHash: extr.hash.toString(),
        success: events.findIndex((evt) => evt.event.method === "ExtrinsicSuccess") > -1,
        isSigned: extr.isSigned,
      }
    });

    if(extrinsicsAr.length > 0) {
      await this.extrinsicRepository.bulkCreate(extrinsicsAr);
    }
  }
}
import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({ tableName: 'extrinsics' })
export class Extrinsic extends Model {

  @PrimaryKey
  @Column
  id: string = ''

  @Column({ field: 'tx_hash' })
  txHash!: string

  @Column({ field: 'block_height' })
  blockHeight!: number

  @Column
  module!: string

  @Column(DataType.TEXT)
  call!: string

  @Column
  success!: boolean

  @Column({ field: 'is_signed' })
  isSigned!: boolean
}
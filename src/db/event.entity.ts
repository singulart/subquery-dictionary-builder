import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({ tableName: 'events' })
export class Event extends Model {

  @PrimaryKey
  @Column
  id: string = ''

  @Column({field: 'block_height'})
  blockHeight!: number

  @Column
  module!: string

  @Column(DataType.TEXT)
  event!: string
}
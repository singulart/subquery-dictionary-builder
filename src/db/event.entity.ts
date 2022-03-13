import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({ tableName: 'events', timestamps: false })
export class Event extends Model {

  @PrimaryKey
  @Column
  id: string = ''

  @Column({field: 'block_height'})
  blockHeight!: number

  @Column
  module!: string

  @Column
  event!: string
}
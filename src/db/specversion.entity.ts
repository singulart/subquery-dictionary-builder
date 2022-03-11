import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({ tableName: 'spec_versions' })
export class SpecVersion extends Model {

  @PrimaryKey
  @Column
  id: string = ''

  @Column({ field: 'block_height' })
  blockHeight!: number
}
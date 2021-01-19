import { ObjectId } from '@mikro-orm/mongodb';
import moment from 'moment';
import { Column, CreateDateColumn, ObjectIdColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {

  @ObjectIdColumn()
  _id!: ObjectId;

  @CreateDateColumn({type: 'date'})
  createdAt = moment();

  @UpdateDateColumn({type: 'date'})
  updatedAt = moment();

}
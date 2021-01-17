import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Cinema extends BaseEntity {

    @Property()
    name!: string;

    @Property({nullable: true})
    franchise!: string;
}
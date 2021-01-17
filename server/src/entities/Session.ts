import { Entity, Property } from "@mikro-orm/core";
import { Moment } from "moment";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Session extends BaseEntity {

    @Property()
    title!: string;

    @Property({nullable: true})
    poster_url!: string;

    @Property()
    location!: string;

    @Property()
    time!: Moment;

    @Property({nullable: true})
    imdb_id: string

    @Property()
    tags!: string[];

    @Property()
    booking_url!: string;
}
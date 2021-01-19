import { Moment } from "moment";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Session extends BaseEntity {

    @Column()
    title!: string;

    @Column({nullable: true})
    poster_url!: string;

    @Column()
    location!: string;

    @Column()
    time!: Moment;

    @Column({nullable: true})
    imdb_id: string

    @Column()
    tags!: string[];

    @Column()
    booking_url!: string;
}
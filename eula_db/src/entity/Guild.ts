import {Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Guild {
    /** used discord guild id */
    @PrimaryColumn()
    public id: string;
}

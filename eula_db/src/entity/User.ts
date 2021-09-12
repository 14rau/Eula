import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import { Guild } from "./Guild";

@Entity()
export class User {
    @PrimaryColumn("varchar", { length: 255 })
    public anoUser: string;

    @Column("varchar",{ length: 32 })
    public guildId: string;

    @Column("bool", { default: false })
    public isBlocked: boolean;
}

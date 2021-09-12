import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Guild } from "./Guild";

export type SettingType = "bool" | "int" | "float" | "string";

@Entity()
export class Setting {
    /** used discord guild id */
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar",{ length: 32 })
    public guildId: string;

    @Column("varchar",{ length: 32 })
    public key: string;

    @Column("varchar",{ length: 32 })
    public value: string;

    @Column("varchar",{ length: 32 })
    public type: SettingType;

    @ManyToOne(() => Guild)
    @JoinColumn({ name: "guildId", referencedColumnName: "id" })
    public _guild: Guild;
}

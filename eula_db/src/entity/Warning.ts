import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Guild } from "./Guild";
import { User } from "./User";


@Entity()
export class Warning {
    /** used discord guild id */
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar",{ length: 32 })
    public guildId: string;

    @Column("datetime", { nullable: true })
    public validTill: string;

    @Column("datetime", { nullable: true })
    public dateDeleted: string;

    @Column("varchar",{ length: 255 })
    public warnedUserId: string;

    @Column("varchar",{ length: 200 })
    public reason: string;

    @Column("bool", { default: false })
    public isGenerated: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: "warnedUserId", referencedColumnName: "anoUser" })
    public _warnedUser: User;

    @ManyToOne(() => Guild)
    @JoinColumn({ name: "guildId", referencedColumnName: "id" })
    public _guild: Guild;
}

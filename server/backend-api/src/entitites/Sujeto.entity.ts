import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VinculoSujetoObjeto } from "./VinculoSujetoObjeto.entity";

@Index("Sujeto_spo_cuit_key", ["spoCuit"], { unique: true })
@Index("Sujeto_pkey", ["spoId"], { unique: true })
@Entity("Sujeto", { schema: "public" })
export class Sujeto {
  @PrimaryGeneratedColumn({ type: "bigint", name: "spo_id" })
  spoId: number;

  @Column("character varying", { name: "spo_cuit", unique: true, length: 11 })
  spoCuit: string;

  @Column("character varying", { name: "spo_denominacion", length: 160 })
  spoDenominacion: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @OneToMany(
    () => VinculoSujetoObjeto,
    (vinculoSujetoObjeto) => vinculoSujetoObjeto.vsoSpo
  )
  vinculoSujetoObjetos: VinculoSujetoObjeto[];
}

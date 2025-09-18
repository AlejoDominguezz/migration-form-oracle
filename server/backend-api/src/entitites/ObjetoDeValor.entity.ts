import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Automotores } from "./Automotores.entity";
import { VinculoSujetoObjeto } from "./VinculoSujetoObjeto.entity";

@Index("Objeto_De_Valor_ovp_codigo_key", ["ovpCodigo"], { unique: true })
@Index("Objeto_De_Valor_pkey", ["ovpId"], { unique: true })
@Entity("Objeto_De_Valor", { schema: "public" })
export class ObjetoDeValor {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ovp_id" })
  ovpId: number;

  @Column("character varying", {
    name: "ovp_tipo",
    length: 30,
    default: () => "'AUTOMOTOR'",
  })
  ovpTipo: string;

  @Column("character varying", { name: "ovp_codigo", unique: true, length: 64 })
  ovpCodigo: string;

  @Column("character varying", {
    name: "ovp_descripcion",
    nullable: true,
    length: 240,
  })
  ovpDescripcion: string | null;

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

  @OneToMany(() => Automotores, (automotores) => automotores.atrOvp)
  automotores: Automotores[];

  @OneToOne(
    () => VinculoSujetoObjeto,
    (vinculoSujetoObjeto) => vinculoSujetoObjeto.vsoOvp
  )
  vinculoSujetoObjeto: VinculoSujetoObjeto;
}

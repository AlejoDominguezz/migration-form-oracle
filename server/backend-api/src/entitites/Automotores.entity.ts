import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjetoDeValor } from "./ObjetoDeValor.entity";

@Index("Automotores_atr_dominio_key", ["atrDominio"], { unique: true })
@Index("Automotores_pkey", ["atrId"], { unique: true })
@Index("idx_automotores_ovp", ["atrOvpId"], {})
@Entity("Automotores", { schema: "public" })
export class Automotores {
  @PrimaryGeneratedColumn({ type: "bigint", name: "atr_id" })
  atrId: number;

  @Column("bigint", { name: "atr_ovp_id" })
  atrOvpId: number;

  @Column("character varying", { name: "atr_dominio", unique: true, length: 8 })
  atrDominio: string;

  @Column("character varying", {
    name: "atr_numero_chasis",
    nullable: true,
    length: 25,
  })
  atrNumeroChasis: string | null;

  @Column("character varying", {
    name: "atr_numero_motor",
    nullable: true,
    length: 25,
  })
  atrNumeroMotor: string | null;

  @Column("character varying", {
    name: "atr_color",
    nullable: true,
    length: 40,
  })
  atrColor: string | null;

  @Column("integer", { name: "atr_fecha_fabricacion" })
  atrFechaFabricacion: number;

  @Column("timestamp with time zone", {
    name: "atr_fecha_alta_registro",
    default: () => "now()",
  })
  atrFechaAltaRegistro: Date;

  @ManyToOne(
    () => ObjetoDeValor,
    (objetoDeValor) => objetoDeValor.automotores,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "atr_ovp_id", referencedColumnName: "ovpId" }])
  atrOvp: ObjetoDeValor;
}

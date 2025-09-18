import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjetoDeValor } from "./ObjetoDeValor.entity";
import { Sujeto } from "./Sujeto.entity";

@Index("Vinculo_Sujeto_Objeto_pkey", ["vsoId"], { unique: true })
@Index("idx_vso_ovp", ["vsoOvpId"], {})
@Index("uq_vso_owner_actual", ["vsoOvpId"], { unique: true })
@Index("idx_vso_spo", ["vsoSpoId"], {})
@Entity("Vinculo_Sujeto_Objeto", { schema: "public" })
export class VinculoSujetoObjeto {
  @PrimaryGeneratedColumn({ type: "bigint", name: "vso_id" })
  vsoId: number;

  @Column("bigint", { name: "vso_ovp_id" })
  vsoOvpId: number;

  @Column("bigint", { name: "vso_spo_id" })
  vsoSpoId: number;

  @Column("character varying", {
    name: "vso_tipo_vinculo",
    length: 30,
    default: () => "'DUENO'",
  })
  vsoTipoVinculo: string;

  @Column("numeric", {
    name: "vso_porcentaje",
    precision: 5,
    scale: 2,
    default: () => "100",
  })
  vsoPorcentaje: number;

  @Column("character", {
    name: "vso_responsable",
    length: 1,
    default: () => "'S'",
  })
  vsoResponsable: string;

  @Column("date", { name: "vso_fecha_inicio", default: () => "CURRENT_DATE" })
  vsoFechaInicio: Date;

  @Column("date", { name: "vso_fecha_fin", nullable: true })
  vsoFechaFin: Date | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @OneToOne(
    () => ObjetoDeValor,
    (objetoDeValor) => objetoDeValor.vinculoSujetoObjeto,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "vso_ovp_id", referencedColumnName: "ovpId" }])
  vsoOvp: ObjetoDeValor;

  @ManyToOne(() => Sujeto, (sujeto) => sujeto.vinculoSujetoObjetos, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "vso_spo_id", referencedColumnName: "spoId" }])
  vsoSpo: Sujeto;
}

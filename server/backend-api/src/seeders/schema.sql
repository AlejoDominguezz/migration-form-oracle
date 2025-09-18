
CREATE TABLE IF NOT EXISTS "Sujeto" (
  spo_id           BIGSERIAL PRIMARY KEY,
  spo_cuit         VARCHAR(11)  NOT NULL UNIQUE,
  spo_denominacion VARCHAR(160) NOT NULL,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Objeto_De_Valor" (
  ovp_id          BIGSERIAL PRIMARY KEY,
  ovp_tipo        VARCHAR(30)   NOT NULL DEFAULT 'AUTOMOTOR',
  ovp_codigo      VARCHAR(64)   NOT NULL UNIQUE,
  ovp_descripcion VARCHAR(240),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Automotores" (
  atr_id                  BIGSERIAL PRIMARY KEY,
  atr_ovp_id              BIGINT      NOT NULL REFERENCES "Objeto_De_Valor"(ovp_id) ON DELETE CASCADE,
  atr_dominio             VARCHAR(8)  NOT NULL UNIQUE,
  atr_numero_chasis       VARCHAR(25),
  atr_numero_motor        VARCHAR(25),
  atr_color               VARCHAR(40),
  atr_fecha_fabricacion   INTEGER     NOT NULL,  -- YYYYMM
  atr_fecha_alta_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_atr_fecha_fabricacion CHECK (atr_fecha_fabricacion BETWEEN 190001 AND 299912)
);
CREATE INDEX IF NOT EXISTS idx_automotores_ovp ON "Automotores"(atr_ovp_id);

CREATE TABLE IF NOT EXISTS "Vinculo_Sujeto_Objeto" (
  vso_id           BIGSERIAL PRIMARY KEY,
  vso_ovp_id       BIGINT      NOT NULL REFERENCES "Objeto_De_Valor"(ovp_id) ON DELETE CASCADE,
  vso_spo_id       BIGINT      NOT NULL REFERENCES "Sujeto"(spo_id) ON DELETE RESTRICT,
  vso_tipo_vinculo VARCHAR(30) NOT NULL DEFAULT 'DUENO',
  vso_porcentaje   NUMERIC(5,2) NOT NULL DEFAULT 100,
  vso_responsable  CHAR(1)     NOT NULL DEFAULT 'S',
  vso_fecha_inicio DATE        NOT NULL DEFAULT CURRENT_DATE,
  vso_fecha_fin    DATE        NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vso_ovp ON "Vinculo_Sujeto_Objeto"(vso_ovp_id);
CREATE INDEX IF NOT EXISTS idx_vso_spo ON "Vinculo_Sujeto_Objeto"(vso_spo_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'uq_vso_owner_actual'
  ) THEN
    CREATE UNIQUE INDEX uq_vso_owner_actual
      ON "Vinculo_Sujeto_Objeto"(vso_ovp_id)
      WHERE vso_responsable = 'S' AND vso_fecha_fin IS NULL AND vso_tipo_vinculo = 'DUENO';
  END IF;
END$$;

CREATE OR REPLACE VIEW vw_automotores_con_dueno AS
SELECT
  a.atr_dominio         AS dominio,
  a.atr_numero_chasis   AS numero_chasis,
  a.atr_numero_motor    AS numero_motor,
  a.atr_color           AS color,
  a.atr_fecha_fabricacion AS fecha_fabricacion,
  s.spo_cuit            AS cuit_dueno,
  s.spo_denominacion    AS denominacion_dueno
FROM "Automotores" a
JOIN "Objeto_De_Valor" o ON o.ovp_id = a.atr_ovp_id
LEFT JOIN "Vinculo_Sujeto_Objeto" v
  ON v.vso_ovp_id = o.ovp_id AND v.vso_responsable = 'S' AND v.vso_fecha_fin IS NULL
LEFT JOIN "Sujeto" s ON s.spo_id = v.vso_spo_id
ORDER BY a.atr_dominio;

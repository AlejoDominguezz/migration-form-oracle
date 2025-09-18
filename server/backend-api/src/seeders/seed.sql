-- Limpiar tablas
TRUNCATE TABLE "Vinculo_Sujeto_Objeto" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Automotores" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Objeto_De_Valor" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Sujeto" RESTART IDENTITY CASCADE;

-- 1. Sujetos
INSERT INTO "Sujeto" (spo_cuit, spo_denominacion, created_at, updated_at)
VALUES
  ('20123456789', 'Juan Pérez', NOW(), NOW()),
  ('20987654321', 'María Gómez', NOW(), NOW()),
  ('27222333444', 'Transportes El Rápido S.A.', NOW(), NOW()),
  ('20425338505', 'AYSA S.A.', NOW(), NOW());

-- 2. Objetos de Valor
INSERT INTO "Objeto_De_Valor" (ovp_tipo, ovp_codigo, ovp_descripcion, created_at, updated_at)
VALUES
  ('AUTOMOTOR', 'AUTO-001', 'Ford Fiesta 1.6 SE 2015', NOW(), NOW()),
  ('AUTOMOTOR', 'AUTO-002', 'Toyota Corolla XEI 2018', NOW(), NOW()),
  ('AUTOMOTOR', 'AUTO-003', 'Renault Kangoo 2020', NOW(), NOW());

-- 3. Automotores
INSERT INTO "Automotores" (atr_ovp_id, atr_dominio, atr_numero_chasis, atr_numero_motor, atr_color, atr_fecha_fabricacion, atr_fecha_alta_registro)
VALUES
  (1, 'AA123BB', 'CHS1234567890FIESTA', 'MOT12345FIESTA', 'Rojo', 201506, NOW()),
  (2, 'AC456CD', 'CHS9876543210COROLLA', 'MOT98765COROLLA', 'Gris', 201808, NOW()),
  (3, 'AD789EF', 'CHS5554443332KANGOO', 'MOT55555KANGOO', 'Blanco', 202003, NOW());

-- 4. Vínculo Sujeto-Objeto (Dueños actuales)
INSERT INTO "Vinculo_Sujeto_Objeto" (vso_ovp_id, vso_spo_id, vso_tipo_vinculo, vso_porcentaje, vso_responsable, vso_fecha_inicio, created_at)
VALUES
  (1, 1, 'DUENO', 100, 'S', '2015-07-01', NOW()),
  (2, 2, 'DUENO', 100, 'S', '2018-09-01', NOW()),
  (3, 3, 'DUENO', 100, 'S', '2020-05-01', NOW());

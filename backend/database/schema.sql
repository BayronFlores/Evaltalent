-- =========================
-- 1. CREAR BASE DE DATOS Y USARLA
-- =========================
CREATE DATABASE evaltalent;
\c evaltalent;

-- =========================
-- 2. TABLAS
-- =========================

-- Tabla de permisos
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50),
    action VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación roles-permisos
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    manager_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ciclos de evaluación
CREATE TABLE evaluation_cycles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de plantillas de evaluación
CREATE TABLE evaluation_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    kpis JSONB,
    created_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de evaluaciones
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    cycle_id INTEGER REFERENCES evaluation_cycles(id),
    template_id INTEGER REFERENCES evaluation_templates(id),
    evaluator_id INTEGER REFERENCES users(id),
    evaluatee_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    responses JSONB,
    score DECIMAL(5,2),
    comments TEXT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    filters JSONB,
    data JSONB,
    generated_by INTEGER REFERENCES users(id),
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. DATOS DE PRUEBA
-- =========================

-- Permisos
INSERT INTO permissions (name, description, module, action) VALUES 
('users.create', 'Crear usuarios', 'users', 'create'),
('users.read', 'Ver usuarios', 'users', 'read'),
('users.update', 'Actualizar usuarios', 'users', 'update'),
('users.delete', 'Eliminar usuarios', 'users', 'delete'),
('users.manage_roles', 'Gestionar roles de usuarios', 'users', 'manage_roles'),
('evaluations.create', 'Crear evaluaciones', 'evaluations', 'create'),
('evaluations.read', 'Ver evaluaciones', 'evaluations', 'read'),
('evaluations.update', 'Actualizar evaluaciones', 'evaluations', 'update'),
('evaluations.delete', 'Eliminar evaluaciones', 'evaluations', 'delete'),
('evaluations.evaluate_others', 'Evaluar a otros', 'evaluations', 'evaluate_others'),
('evaluations.view_all', 'Ver todas las evaluaciones', 'evaluations', 'view_all'),
('reports.create', 'Crear reportes', 'reports', 'create'),
('reports.read', 'Ver reportes', 'reports', 'read'),
('reports.export', 'Exportar reportes', 'reports', 'export'),
('roles.create', 'Crear roles', 'roles', 'create'),
('roles.read', 'Ver roles', 'roles', 'read'),
('roles.update', 'Actualizar roles', 'roles', 'update'),
('roles.delete', 'Eliminar roles', 'roles', 'delete'),
('system.admin', 'Administración completa del sistema', 'system', 'admin'),
('dashboard.view', 'Ver dashboard', 'dashboard', 'view');

-- Roles
INSERT INTO roles (name, description, is_system_role) VALUES 
('admin', 'Administrador del sistema', true),
('manager', 'Supervisor/Líder de equipo', true),
('employee', 'Empleado', true),
('hr', 'Recursos Humanos', false);

-- Asignación de permisos a roles
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions 
WHERE name IN (
    'users.read', 'evaluations.create', 'evaluations.read', 'evaluations.update', 
    'evaluations.evaluate_others', 'reports.read', 'reports.create', 'dashboard.view'
);
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 3, id FROM permissions 
WHERE name IN ('evaluations.read', 'dashboard.view');
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 4, id FROM permissions 
WHERE name IN (
    'users.create', 'users.read', 'users.update', 'users.manage_roles',
    'evaluations.read', 'evaluations.view_all', 'reports.read', 'reports.create', 
    'reports.export', 'dashboard.view'
);

-- Usuarios de prueba
-- admin: admin123 | manager: manager123 | employee: employee123
-- ⚠️ CAMBIO AQUÍ: Agregamos manager_id al INSERT
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, department, position, hire_date, manager_id)
VALUES 
('admin', 'admin@evaltalent.com', '$2b$10$BV09pnw03UiTsCLaWNXneuj8G4EgO6JgHGfDDcPh0bwlFHQSHKISu', 'Admin', 'System', 1, 'Management', 'System Administrator', '2022-01-01', NULL),
('manager', 'manager@evaltalent.com', '$2b$10$/xVF2EVXHGMjxAcBaVJw0OvFH9dK1uMey2/hPDdCRVAwpaq4tJ4Im', 'María', 'García', 2, 'Development', 'Team Lead', '2022-03-15', NULL),
('employee', 'employee@evaltalent.com', '$2b$10$prkuPv1EYZJfsUBl7K6lC.hJKIjODYnVPkpSndg20/ccWJHobJ2ES', 'Juan', 'Pérez', 3, 'Development', 'Developer', '2023-02-10', 2),
('anagarcia', 'ana.garcia@empresa.com', '$2b$10$vk.8GKeaKe2Jnkq75JBq8O1PHagS1w53/ROARSgkexW3o20kl2XkW', 'Ana', 'García', 3, 'Development', 'Desarrolladora Senior', '2023-01-15', 2),
('carloslopez', 'carlos.lopez@empresa.com', '$2b$10$pJVXjaxxdtVIfeKCkdA9VO9pWJqzB1cdD31bwFhzxi/W1GJcx.K8a', 'Carlos', 'López', 3, 'Design', 'Diseñador UX', '2023-02-01', 2),
('mariarodriguez', 'maria.rodriguez@empresa.com', '$2b$10$fS7CXkxK6TtJ.SY984Ham.TviOAWpSRpcCfTD.E8jC.NqIRVunVd2', 'María', 'Rodríguez', 3, 'QA', 'QA Analyst', '2023-03-10', 2),
('juanperez', 'juan.perez@empresa.com', '$2b$10$ZdMtS3wu8YKDnBpOekka0.jswSQsO5snIWEYmIUf3VkW3dQGycrLS', 'Juan', 'Pérez', 3, 'Development', 'Backend Developer', '2023-01-20', 2);

-- Ciclos de evaluación
INSERT INTO evaluation_cycles (name, description, start_date, end_date, status, created_by)
VALUES 
('Ciclo Q2 2024', 'Evaluación trimestral Q2', '2024-04-01', '2024-06-30', 'active', 1),
('Ciclo Q3 2024', 'Evaluación trimestral Q3', '2024-07-01', '2024-09-30', 'draft', 1);

-- Plantillas de evaluación
INSERT INTO evaluation_templates (name, description, questions, kpis, created_by)
VALUES 
('Plantilla General', 'Evaluación estándar de desempeño',
 '[{"question":"¿Cumple con los objetivos?","type":"yesno"},{"question":"Comentarios adicionales","type":"text"}]',
 '[{"kpi":"Puntualidad"},{"kpi":"Calidad de trabajo"}]', 1),
('Plantilla Liderazgo', 'Evaluación de habilidades de liderazgo',
 '[{"question":"¿Lidera efectivamente?","type":"yesno"},{"question":"¿Motiva al equipo?","type":"yesno"}]',
 '[{"kpi":"Liderazgo"},{"kpi":"Comunicación"}]', 2);

-- Evaluaciones de prueba
INSERT INTO evaluations (cycle_id, template_id, evaluator_id, evaluatee_id, status, responses, score, comments, submitted_at)
VALUES
  (1, 1, 2, 3, 'completed', '[{"question":"¿Cumple con los objetivos?","answer":"Sí"},{"question":"Comentarios adicionales","answer":"Buen trabajo"}]', 9.5, 'Excelente desempeño', '2024-06-10 10:00:00'),
  (1, 1, 2, 1, 'completed', '[{"question":"¿Cumple con los objetivos?","answer":"No"},{"question":"Comentarios adicionales","answer":"Debe mejorar puntualidad"}]', 7.0, 'Puntualidad baja', '2024-06-12 11:00:00'),
  (1, 1, 2, 3, 'pending', NULL, NULL, NULL, NULL),
  (2, 2, 1, 2, 'pending', NULL, NULL, NULL, NULL),
  (1, 1, 2, 4, 'completed', '[{"question":"¿Cumple con los objetivos?","answer":"Sí"},{"question":"Comentarios adicionales","answer":"Muy buen desempeño"}]', 8.7, 'Buen trabajo en equipo', '2024-06-11 09:30:00'),
  (1, 2, 1, 5, 'completed', '[{"question":"¿Lidera efectivamente?","answer":"No"},{"question":"¿Motiva al equipo?","answer":"Sí"}]', 7.8, 'Debe mejorar liderazgo', '2024-06-13 14:20:00'),
  (2, 1, 3, 6, 'pending', NULL, NULL, NULL, NULL),
  (2, 2, 1, 7, 'completed', '[{"question":"¿Lidera efectivamente?","answer":"Sí"},{"question":"¿Motiva al equipo?","answer":"Sí"}]', 9.2, 'Excelente líder', '2024-07-05 16:45:00'),
  (1, 1, 2, 4, 'completed', '[{"question":"¿Cumple con los objetivos?","answer":"No"},{"question":"Comentarios adicionales","answer":"Necesita mejorar puntualidad"}]', 6.5, 'Puntualidad baja', '2024-06-15 11:00:00'),
  (1, 1, 2, 5, 'completed', '[{"question":"¿Cumple con los objetivos?","answer":"Sí"},{"question":"Comentarios adicionales","answer":"Muy dedicado"}]', 9.0, 'Buen desempeño general', '2024-06-16 10:15:00');

-- Reportes de prueba
INSERT INTO reports (name, type, filters, data, generated_by)
VALUES 
('Reporte de Evaluaciones por Usuario', 'evaluaciones_por_usuario', '{"cycle":"Q2 2024"}',
 '[{"nombre_completo":"Juan Pérez","department":"Development","total_evaluaciones":2,"evaluaciones_completadas":1,"evaluaciones_pendientes":1,"promedio_score":9.5}]', 1),
('Reporte de Evaluaciones por Departamento', 'evaluaciones_por_departamento', '{"cycle":"Q2 2024"}',
 '[{"department":"Development","total_empleados":2,"total_evaluaciones":3,"evaluaciones_completadas":2,"promedio_score":8.25}]', 1),
('Reporte de Evaluaciones Pendientes', 'evaluaciones_pendientes', '{"cycle":"Q3 2024"}',
 '[{"nombre_completo":"María García","department":"Development","total_evaluaciones":1,"evaluaciones_pendientes":1}]', 1);

-- =========================
-- 4. ÍNDICES PARA RENDIMIENTO
-- =========================
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_manager_id ON users(manager_id); -- ← NUEVO ÍNDICE
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);

-- =========================
-- 5. CONSULTAS DE VERIFICACIÓN
-- =========================
SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM permissions;
SELECT * FROM evaluation_cycles;
SELECT * FROM evaluation_templates;
SELECT * FROM evaluations;
SELECT * FROM reports;
-- Crear base de datos
CREATE DATABASE evaltalent;

-- Usar la base de datos
\c evaltalent;

-- Tabla de permisos (NUEVA)
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50), -- ej: 'users', 'evaluations', 'reports'
    action VARCHAR(50), -- ej: 'create', 'read', 'update', 'delete'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles (MEJORADA)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false, -- para roles del sistema que no se pueden eliminar
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación roles-permisos (NUEVA)
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Tabla de usuarios (SIN CAMBIOS MAYORES)
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

-- INSERTAR PERMISOS POR DEFECTO
INSERT INTO permissions (name, description, module, action) VALUES 
-- Permisos de usuarios
('users.create', 'Crear usuarios', 'users', 'create'),
('users.read', 'Ver usuarios', 'users', 'read'),
('users.update', 'Actualizar usuarios', 'users', 'update'),
('users.delete', 'Eliminar usuarios', 'users', 'delete'),
('users.manage_roles', 'Gestionar roles de usuarios', 'users', 'manage_roles'),

-- Permisos de evaluaciones
('evaluations.create', 'Crear evaluaciones', 'evaluations', 'create'),
('evaluations.read', 'Ver evaluaciones', 'evaluations', 'read'),
('evaluations.update', 'Actualizar evaluaciones', 'evaluations', 'update'),
('evaluations.delete', 'Eliminar evaluaciones', 'evaluations', 'delete'),
('evaluations.evaluate_others', 'Evaluar a otros', 'evaluations', 'evaluate_others'),
('evaluations.view_all', 'Ver todas las evaluaciones', 'evaluations', 'view_all'),

-- Permisos de reportes
('reports.create', 'Crear reportes', 'reports', 'create'),
('reports.read', 'Ver reportes', 'reports', 'read'),
('reports.export', 'Exportar reportes', 'reports', 'export'),

-- Permisos de roles
('roles.create', 'Crear roles', 'roles', 'create'),
('roles.read', 'Ver roles', 'roles', 'read'),
('roles.update', 'Actualizar roles', 'roles', 'update'),
('roles.delete', 'Eliminar roles', 'roles', 'delete'),

-- Permisos de sistema
('system.admin', 'Administración completa del sistema', 'system', 'admin'),
('dashboard.view', 'Ver dashboard', 'dashboard', 'view');

-- INSERTAR ROLES POR DEFECTO
INSERT INTO roles (name, description, is_system_role) VALUES 
('admin', 'Administrador del sistema', true),
('manager', 'Supervisor/Líder de equipo', true),
('employee', 'Empleado', true),
('hr', 'Recursos Humanos', false);

-- ASIGNAR PERMISOS A ROLES
-- Admin: todos los permisos
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Manager: permisos de evaluación y reportes
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions 
WHERE name IN (
    'users.read', 'evaluations.create', 'evaluations.read', 'evaluations.update', 
    'evaluations.evaluate_others', 'reports.read', 'reports.create', 'dashboard.view'
);

-- Employee: permisos básicos
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 3, id FROM permissions 
WHERE name IN ('evaluations.read', 'dashboard.view');

-- HR: permisos de usuarios y reportes
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 4, id FROM permissions 
WHERE name IN (
    'users.create', 'users.read', 'users.update', 'users.manage_roles',
    'evaluations.read', 'evaluations.view_all', 'reports.read', 'reports.create', 
    'reports.export', 'dashboard.view'
);

-- INSERTAR USUARIOS POR DEFECTO
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, department, position) VALUES 
('admin', 'admin@evaltalent.com', '$2b$10$BV09pnw03UiTsCLaWNXneuj8G4EgO6JgHGfDDcPh0bwlFHQSHKISu', 'Admin', 'System', 1, 'Management', 'System Administrator'),
('manager', 'manager@evaltalent.com', '$2b$10$/xVF2EVXHGMjxAcBaVJw0OvFH9dK1uMey2/hPDdCRVAwpaq4tJ4Im', 'Manager', 'User', 2, 'Development', 'Team Lead'),
('employee', 'employee@evaltalent.com', '$2b$10$prkuPv1EYZJfsUBl7K6lC.hJKIjODYnVPkpSndg20/ccWJHobJ2ES', 'Employee', 'User', 3, 'Development', 'Developer');

-- ÍNDICES PARA MEJORAR RENDIMIENTO
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_permissions_module ON permissions(module);
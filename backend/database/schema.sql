-- Crear base de datos
CREATE DATABASE evaltalent;

-- Usar la base de datos
\c evaltalent;

-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Insertar roles por defecto
INSERT INTO roles (name, description, permissions) VALUES 
('admin', 'Administrador del sistema', '{"all": true}'),
('manager', 'Supervisor/Líder de equipo', '{"evaluate": true, "view_reports": true}'),
('employee', 'Empleado', '{"view_own": true, "self_evaluate": true}');

-- Insertar usuario admin por defecto
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id) VALUES 
('admin', 'admin@evaltalent.com', '$2b$10$example_hash', 'Admin', 'System', 1);
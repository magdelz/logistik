-- =============================================
-- LogiTrack - Logistics Platform Database Schema
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'client');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'pickup', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE cargo_type AS ENUM ('standard', 'fragile', 'perishable', 'hazardous', 'oversized', 'valuable');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

-- =============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'client' NOT NULL,
    company_name TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_company ON profiles USING gin(company_name gin_trgm_ops);

-- =============================================
-- ADDRESSES TABLE
-- =============================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL, -- "Офис", "Склад", "Дом"
    country TEXT DEFAULT 'Россия' NOT NULL,
    city TEXT NOT NULL,
    street TEXT NOT NULL,
    building TEXT,
    apartment TEXT,
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT false,
    contact_name TEXT,
    contact_phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_addresses_profile ON addresses(profile_id);
CREATE INDEX idx_addresses_city ON addresses(city);

-- =============================================
-- TARIFFS TABLE
-- =============================================

CREATE TABLE tariffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    price_per_km DECIMAL(10, 2) NOT NULL,
    price_per_m3 DECIMAL(10, 2) DEFAULT 0,
    min_weight DECIMAL(10, 2) DEFAULT 0,
    max_weight DECIMAL(10, 2),
    delivery_days_min INTEGER DEFAULT 1,
    delivery_days_max INTEGER DEFAULT 3,
    cargo_types cargo_type[] DEFAULT '{standard}',
    is_express BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_tariffs_active ON tariffs(is_active);

-- =============================================
-- ROUTES TABLE
-- =============================================

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    distance_km DECIMAL(10, 2) NOT NULL,
    estimated_hours INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(origin_city, destination_city)
);

CREATE INDEX idx_routes_cities ON routes(origin_city, destination_city);
CREATE INDEX idx_routes_active ON routes(is_active);

-- =============================================
-- ORDERS TABLE
-- =============================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES profiles(id) NOT NULL,
    manager_id UUID REFERENCES profiles(id),
    tariff_id UUID REFERENCES tariffs(id),
    route_id UUID REFERENCES routes(id),
    
    -- Pickup address
    pickup_address_id UUID REFERENCES addresses(id),
    pickup_city TEXT NOT NULL,
    pickup_street TEXT NOT NULL,
    pickup_building TEXT,
    pickup_contact_name TEXT NOT NULL,
    pickup_contact_phone TEXT NOT NULL,
    pickup_date DATE,
    pickup_time_from TIME,
    pickup_time_to TIME,
    
    -- Delivery address
    delivery_address_id UUID REFERENCES addresses(id),
    delivery_city TEXT NOT NULL,
    delivery_street TEXT NOT NULL,
    delivery_building TEXT,
    delivery_contact_name TEXT NOT NULL,
    delivery_contact_phone TEXT NOT NULL,
    delivery_date DATE,
    delivery_time_from TIME,
    delivery_time_to TIME,
    
    -- Cargo details
    cargo_description TEXT NOT NULL,
    cargo_type cargo_type DEFAULT 'standard' NOT NULL,
    weight_kg DECIMAL(10, 2) NOT NULL,
    volume_m3 DECIMAL(10, 3),
    length_cm DECIMAL(10, 2),
    width_cm DECIMAL(10, 2),
    height_cm DECIMAL(10, 2),
    pieces_count INTEGER DEFAULT 1,
    declared_value DECIMAL(12, 2),
    is_fragile BOOLEAN DEFAULT false,
    requires_temperature_control BOOLEAN DEFAULT false,
    temperature_min DECIMAL(5, 2),
    temperature_max DECIMAL(5, 2),
    
    -- Pricing
    distance_km DECIMAL(10, 2),
    base_cost DECIMAL(10, 2) NOT NULL,
    weight_cost DECIMAL(10, 2) DEFAULT 0,
    distance_cost DECIMAL(10, 2) DEFAULT 0,
    volume_cost DECIMAL(10, 2) DEFAULT 0,
    insurance_cost DECIMAL(10, 2) DEFAULT 0,
    extra_services_cost DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(12, 2) NOT NULL,
    
    -- Status & tracking
    status order_status DEFAULT 'pending' NOT NULL,
    payment_status payment_status DEFAULT 'pending' NOT NULL,
    tracking_code TEXT UNIQUE,
    current_location TEXT,
    estimated_delivery_date DATE,
    actual_delivery_date TIMESTAMPTZ,
    
    -- Notes
    client_notes TEXT,
    internal_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    confirmed_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_manager ON orders(manager_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_tracking ON orders(tracking_code);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_cities ON orders(pickup_city, delivery_city);

-- =============================================
-- ORDER STATUS HISTORY TABLE
-- =============================================

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    status order_status NOT NULL,
    location TEXT,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_status_history_created ON order_status_history(created_at DESC);

-- =============================================
-- ACTIVITY LOGS TABLE
-- =============================================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' NOT NULL, -- info, success, warning, error
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- =============================================
-- FUNCTIONS
-- =============================================

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    year_part TEXT;
    seq_part TEXT;
BEGIN
    year_part := TO_CHAR(NOW(), 'YY');
    SELECT LPAD((COALESCE(MAX(SUBSTRING(order_number FROM 4)::INTEGER), 0) + 1)::TEXT, 6, '0')
    INTO seq_part
    FROM orders
    WHERE order_number LIKE 'LT' || year_part || '%';
    
    new_number := 'LT' || year_part || seq_part;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Generate tracking code
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_full_name TEXT;
    user_role_val user_role;
BEGIN
    -- Safely extract full_name with fallback to email
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Safely extract role with fallback to 'client'
    BEGIN
        user_role_val := COALESCE(
            (NEW.raw_user_meta_data->>'role')::user_role,
            'client'::user_role
        );
    EXCEPTION WHEN OTHERS THEN
        user_role_val := 'client'::user_role;
    END;
    
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        user_role_val
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log order status change
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, status, location, created_by)
        VALUES (NEW.id, NEW.status, NEW.current_location, NEW.manager_id);
        
        -- Update timestamp fields based on status
        IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
            NEW.confirmed_at = NOW();
        ELSIF NEW.status = 'pickup' THEN
            NEW.picked_up_at = NOW();
        ELSIF NEW.status = 'delivered' THEN
            NEW.delivered_at = NOW();
            NEW.actual_delivery_date = NOW();
        ELSIF NEW.status = 'cancelled' THEN
            NEW.cancelled_at = NOW();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate order cost
CREATE OR REPLACE FUNCTION calculate_order_cost(
    p_tariff_id UUID,
    p_weight_kg DECIMAL,
    p_distance_km DECIMAL,
    p_volume_m3 DECIMAL DEFAULT 0,
    p_declared_value DECIMAL DEFAULT 0
)
RETURNS TABLE (
    base_cost DECIMAL,
    weight_cost DECIMAL,
    distance_cost DECIMAL,
    volume_cost DECIMAL,
    insurance_cost DECIMAL,
    total_cost DECIMAL
) AS $$
DECLARE
    v_tariff tariffs%ROWTYPE;
BEGIN
    SELECT * INTO v_tariff FROM tariffs WHERE id = p_tariff_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tariff not found';
    END IF;
    
    base_cost := v_tariff.base_price;
    weight_cost := p_weight_kg * v_tariff.price_per_kg;
    distance_cost := p_distance_km * v_tariff.price_per_km;
    volume_cost := COALESCE(p_volume_m3 * v_tariff.price_per_m3, 0);
    insurance_cost := COALESCE(p_declared_value * 0.005, 0); -- 0.5% страховка
    total_cost := base_cost + weight_cost + distance_cost + volume_cost + insurance_cost;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tariffs_updated_at
    BEFORE UPDATE ON tariffs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Handle new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Log order status changes
CREATE TRIGGER on_order_status_change
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- Auto-generate order number and tracking code
CREATE OR REPLACE FUNCTION set_order_defaults()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    IF NEW.tracking_code IS NULL THEN
        NEW.tracking_code := generate_tracking_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_order_insert
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION set_order_defaults();

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (SELECT role FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (get_user_role() = 'admin');

CREATE POLICY "Managers can view client profiles"
    ON profiles FOR SELECT
    USING (get_user_role() = 'manager' AND role = 'client');

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (get_user_role() = 'admin');

CREATE POLICY "Admins can insert profiles"
    ON profiles FOR INSERT
    WITH CHECK (get_user_role() = 'admin' OR auth.uid() = id);

-- ADDRESSES POLICIES
CREATE POLICY "Users can manage own addresses"
    ON addresses FOR ALL
    USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage all addresses"
    ON addresses FOR ALL
    USING (get_user_role() = 'admin');

-- TARIFFS POLICIES
CREATE POLICY "Anyone can view active tariffs"
    ON tariffs FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage tariffs"
    ON tariffs FOR ALL
    USING (get_user_role() = 'admin');

-- ROUTES POLICIES
CREATE POLICY "Anyone can view active routes"
    ON routes FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage routes"
    ON routes FOR ALL
    USING (get_user_role() = 'admin');

-- ORDERS POLICIES
CREATE POLICY "Clients can view own orders"
    ON orders FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Clients can create orders"
    ON orders FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Managers can view all orders"
    ON orders FOR SELECT
    USING (get_user_role() IN ('manager', 'admin'));

CREATE POLICY "Managers can update orders"
    ON orders FOR UPDATE
    USING (get_user_role() IN ('manager', 'admin'));

CREATE POLICY "Admins can delete orders"
    ON orders FOR DELETE
    USING (get_user_role() = 'admin');

-- ORDER STATUS HISTORY POLICIES
CREATE POLICY "Users can view own order history"
    ON order_status_history FOR SELECT
    USING (
        order_id IN (SELECT id FROM orders WHERE client_id = auth.uid())
        OR get_user_role() IN ('manager', 'admin')
    );

CREATE POLICY "Staff can insert status history"
    ON order_status_history FOR INSERT
    WITH CHECK (get_user_role() IN ('manager', 'admin'));

-- ACTIVITY LOGS POLICIES
CREATE POLICY "Admins can view all logs"
    ON activity_logs FOR SELECT
    USING (get_user_role() = 'admin');

CREATE POLICY "System can insert logs"
    ON activity_logs FOR INSERT
    WITH CHECK (true);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "System can manage notifications"
    ON notifications FOR ALL
    USING (get_user_role() = 'admin');

-- =============================================
-- SEED DATA
-- =============================================

-- Insert default tariffs
INSERT INTO tariffs (name, description, base_price, price_per_kg, price_per_km, price_per_m3, delivery_days_min, delivery_days_max, is_express, cargo_types) VALUES
('Эконом', 'Экономичная доставка для небольших грузов', 500, 15, 5, 500, 5, 10, false, '{standard}'),
('Стандарт', 'Стандартная доставка с оптимальным соотношением цена/скорость', 800, 20, 7, 700, 3, 5, false, '{standard,fragile}'),
('Экспресс', 'Срочная доставка за 1-2 дня', 1500, 35, 12, 1000, 1, 2, true, '{standard,fragile,valuable}'),
('Хрупкий груз', 'Специальные условия для хрупких товаров', 1200, 30, 10, 900, 3, 5, false, '{fragile}'),
('Негабарит', 'Для крупногабаритных грузов', 2000, 25, 15, 400, 5, 10, false, '{oversized}'),
('Температурный режим', 'Доставка с контролем температуры', 2500, 50, 20, 1500, 2, 4, false, '{perishable}');

-- Insert popular routes
INSERT INTO routes (name, origin_city, destination_city, distance_km, estimated_hours) VALUES
('Москва - Санкт-Петербург', 'Москва', 'Санкт-Петербург', 710, 10),
('Москва - Казань', 'Москва', 'Казань', 820, 12),
('Москва - Нижний Новгород', 'Москва', 'Нижний Новгород', 420, 6),
('Москва - Екатеринбург', 'Москва', 'Екатеринбург', 1800, 24),
('Москва - Новосибирск', 'Москва', 'Новосибирск', 3300, 48),
('Санкт-Петербург - Казань', 'Санкт-Петербург', 'Казань', 1530, 20),
('Санкт-Петербург - Екатеринбург', 'Санкт-Петербург', 'Екатеринбург', 2500, 32),
('Екатеринбург - Новосибирск', 'Екатеринбург', 'Новосибирск', 1500, 20),
('Казань - Екатеринбург', 'Казань', 'Екатеринбург', 980, 14),
('Москва - Краснодар', 'Москва', 'Краснодар', 1350, 18);

CREATE TABLE IF NOT EXISTS loan_product_refer(
    loan_product_refer_id VARCHAR(10) PRIMARY KEY,
    loan_product_refer_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS type_loan_product_refer(
    type_loan_product_refer_id VARCHAR(10) PRIMARY KEY,
    type_loan_product_name_refer VARCHAR(100) NOT NULL,
    loan_product_refer_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (loan_product_refer_id) REFERENCES loan_product_refer(loan_product_refer_id)
);
CREATE TABLE IF NOT EXISTS loan_product_type(
    loan_product_type_id VARCHAR(10) PRIMARY KEY,
    loan_type_name VARCHAR(200) NOT NULL,
    type_loan_product_refer_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (type_loan_product_refer_id) REFERENCES type_loan_product_refer(type_loan_product_refer_id)
);
CREATE TABLE IF NOT EXISTS loan_products(
    loan_product_id VARCHAR(10) PRIMARY KEY,
    loan_product_name VARCHAR(200) NOT NULL,
    loan_product_type_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (loan_product_type_id) REFERENCES loan_product_type(loan_product_type_id)
);
CREATE TABLE IF NOT EXISTS loan_product_details(
    loan_product_id VARCHAR(10) PRIMARY KEY,
    loan_type_det_id VARCHAR(10) NOT NULL,
    loan_product_amount NUMERIC(15, 2),
    loan_product_fee NUMERIC(15, 2),
    loan_product_interest_rate NUMERIC(5, 2),
    loan_product_term_months INT,
    loan_product_processing_minute INT,
    FOREIGN KEY (loan_product_id) REFERENCES loan_products(loan_product_id)
);
CREATE TABLE IF NOT EXISTS collateral_reference(
    collateral_ref_id VARCHAR(10) PRIMARY KEY,
    collateral_ref_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS requirement_reference(
    requirement_ref_id VARCHAR(10) PRIMARY KEY,
    requirement_ref_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS document_reference(
    document_ref_id VARCHAR(10) PRIMARY KEY,
    document_ref_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS news_type_reference(
    news_type_ref_id VARCHAR(10) PRIMARY KEY,
    news_type_ref_name VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS news_category_reference(
    news_category_ref_id VARCHAR(10) PRIMARY KEY,
    news_category_ref_name VARCHAR(50) NOT NULL,
    news_type_ref_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (news_type_ref_id) REFERENCES news_type_reference(news_type_ref_id)
);
CREATE TABLE IF NOT EXISTS news(
    news_id VARCHAR(10) PRIMARY KEY,
    news_title VARCHAR(500) NOT NULL,
    news_summary text null,
    news_content TEXT NOT NULL,
    thumbnail VARCHAR(500),
    news_category_ref_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (news_category_ref_id) REFERENCES news_category_reference(news_category_ref_id)
);
CREATE TABLE IF NOT EXISTS region (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS province (
    province_id SERIAL PRIMARY KEY,
    province_name VARCHAR(100) NOT NULL,
    region_id INT NOT NULL,
    FOREIGN KEY (region_id) REFERENCES region(region_id)
);
CREATE TABLE IF NOT EXISTS district (
    district_id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL,
    province_id INT NOT NULL,
    FOREIGN KEY (province_id) REFERENCES province(province_id)
);
CREATE TABLE IF NOT EXISTS branch (
    branch_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    work_days VARCHAR(200),
    work_hours VARCHAR(100),
    province_id INT NULL,
    district_id INT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    FOREIGN KEY (province_id) REFERENCES province(province_id),
    FOREIGN KEY (district_id) REFERENCES district(district_id)
);
CREATE TABLE IF NOT EXISTS branch_phone (
    phone_id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
);
CREATE TABLE IF NOT EXISTS about_section (
    section_id VARCHAR(50) PRIMARY KEY,
    title_mn VARCHAR(200),
    title_en VARCHAR(200),
    content_mn TEXT,
    content_en TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS team_member (
    member_id SERIAL PRIMARY KEY,
    name_mn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    position_mn VARCHAR(100),
    position_en VARCHAR(100),
    image_url VARCHAR(500),
    email VARCHAR(100),
    phone VARCHAR(50),
    display_order INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS company_stat (
    stat_id SERIAL PRIMARY KEY,
    label_mn VARCHAR(100),
    label_en VARCHAR(100),
    value VARCHAR(50),
    icon VARCHAR(50),
    display_order INT DEFAULT 0
);
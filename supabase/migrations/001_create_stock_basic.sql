-- 创建 stock_basic 表存储 A 股股票基础信息
CREATE TABLE IF NOT EXISTS stock_basic (
    ts_code VARCHAR(20) PRIMARY KEY,  -- 股票代码 (如 000001.SZ)
    symbol VARCHAR(10),               -- 股票简码 (如 000001)
    name VARCHAR(50),                 -- 股票名称
    area VARCHAR(20),                 -- 地区
    industry VARCHAR(50),             -- 行业
    market VARCHAR(20),               -- 市场类型 (主板/创业板/科创板等)
    list_date VARCHAR(10),            -- 上市日期 (YYYYMMDD)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- 更新时间
);

-- 创建索引以加速搜索
CREATE INDEX IF NOT EXISTS idx_stock_basic_symbol ON stock_basic(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_basic_name ON stock_basic(name);
CREATE INDEX IF NOT EXISTS idx_stock_basic_industry ON stock_basic(industry);

-- 添加注释
COMMENT ON TABLE stock_basic IS 'A股股票基础信息表，数据来源于Tushare';
COMMENT ON COLUMN stock_basic.ts_code IS '股票代码，格式：XXXXXX.SH/SZ';
COMMENT ON COLUMN stock_basic.symbol IS '股票简码，6位数字';
COMMENT ON COLUMN stock_basic.name IS '股票名称';
COMMENT ON COLUMN stock_basic.area IS '所在地区';
COMMENT ON COLUMN stock_basic.industry IS '所属行业';
COMMENT ON COLUMN stock_basic.market IS '市场类型：主板/创业板/科创板/北交所';
COMMENT ON COLUMN stock_basic.list_date IS '上市日期，格式：YYYYMMDD';

-- 启用 RLS
ALTER TABLE stock_basic ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：允许所有已认证用户读取
CREATE POLICY "Allow authenticated users to read stock_basic" ON stock_basic
    FOR SELECT
    TO authenticated
    USING (true);

-- 创建 RLS 策略：允许所有已认证用户插入/更新（用于同步数据）
CREATE POLICY "Allow authenticated users to insert stock_basic" ON stock_basic
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update stock_basic" ON stock_basic
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);


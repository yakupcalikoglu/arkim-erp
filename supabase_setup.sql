-- ARKİM ERP - Supabase Kurulum SQL
-- Bu scripti Supabase Dashboard > SQL Editor'a yapıştırıp çalıştırın

-- Ana veri tablosu (tek satır, tüm ERP verisi JSON olarak)
CREATE TABLE IF NOT EXISTS arkim_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT DEFAULT 'system'
);

-- Sadece 1 satır olsun diye constraint
CREATE UNIQUE INDEX IF NOT EXISTS arkim_data_single ON arkim_data(id);

-- İlk boş satırı ekle
INSERT INTO arkim_data (id, data) VALUES (1, '{}')
ON CONFLICT (id) DO NOTHING;

-- Realtime aktif et
ALTER TABLE arkim_data REPLICA IDENTITY FULL;

-- Herkesin okuyup yazabilmesi için (RLS kapalı - basitlik için)
ALTER TABLE arkim_data DISABLE ROW LEVEL SECURITY;

-- Güncelleme zamanını otomatik tut
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER arkim_data_updated_at
  BEFORE UPDATE ON arkim_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

SELECT 'Kurulum tamamlandı! Tablo hazır.' as durum;

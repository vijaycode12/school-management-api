CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT(10, 6)  NOT NULL,
  longitude   FLOAT(10, 6)  NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Sample seed data (optional)
-- INSERT INTO schools (name, address, latitude, longitude) VALUES
--   ('Delhi Public School',     'Sector 45, Gurugram, Haryana',        28.4595, 77.0266),
--   ('Kendriya Vidyalaya',      'Banjara Hills, Hyderabad, Telangana', 17.4126, 78.4482),
--   ('Ryan International School','Malad West, Mumbai, Maharashtra',    19.1871, 72.8481),
--   ('The Doon School',         'Mall Road, Dehradun, Uttarakhand',    30.3165, 78.0322),
--   ('Bishop Cotton School',    'Shimla, Himachal Pradesh',            31.1048, 77.1734);

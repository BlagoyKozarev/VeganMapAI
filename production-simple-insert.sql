-- Изтриваме старите данни (ако има)
TRUNCATE TABLE restaurants CASCADE;

-- Вмъкваме първите 10 ресторанта за тест
INSERT INTO restaurants (id, place_id, name, address, latitude, longitude, vegan_score) VALUES
('001', 'ChIJlfF-jGmFqkARnOumC9ofymw', 'Kato U Doma - Brunch & Catering', 'Old City Center, ul. Neofit Rilski 11, 1000 Sofia, Bulgaria', 42.69103770, 23.31568830, 4.90),
('002', 'ChIJm6Av2_6EqkAR7WrFLQb5ulw', 'Happy Bar & Grill', 'кв. Лозенец, ul. Bogatitsa 36, 1407 Sofia, Bulgaria', 42.67029370, 23.31370920, 4.80),
('003', 'ChIJ_2qasWOFqkARF7zHahhEIEg', 'easyApartments on Panagyurishte str.', 'Sofia Center, ul. Panagyurishte 28, 1202 Sofia, Bulgaria', 42.70559550, 23.33024050, 1.50),
('004', 'ChIJw3wQKcqFqkARxtqDK4LGCW4', 'Cake Lab', 'Old City Center, ul. Karnigradska 14, 1000 Sofia, Bulgaria', 42.69335490, 23.31943430, 4.20),
('005', 'ChIJhyyxnMyFqkAR91uL_i0DsKI', 'YUM Chinese', 'Sofia Center, ul. Tsar Shishman 24, 1000 Sofia, Bulgaria', 42.69092450, 23.32918950, 3.60);

-- Проверка
SELECT COUNT(*) as total_restaurants FROM restaurants;
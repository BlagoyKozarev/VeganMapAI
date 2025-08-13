-- VeganMapAI Restaurant Data Import
-- Generated on 2025-08-06T02:44:18.614Z

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '002b429d-457c-4c18-b644-23c26b24454d',
        'ChIJlfF-jGmFqkARnOumC9ofymw',
        'Kato U Doma - Brunch & Catering',
        'Old City Center, ul. "Neofit Rilski" 11, 1000 Sofia, Bulgaria',
        42.69103770,
        23.31568830,
        '088 961 3679',
        'https://www.palachinki.bg/',
        NULL,
        '{store,restaurant,cafe,bakery,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":1,"time":"0830"},"close":{"day":1,"time":"1730"}},{"open":{"day":2,"time":"0830"},"close":{"day":2,"time":"1730"}},{"open":{"day":3,"time":"0830"},"close":{"day":3,"time":"1730"}},{"open":{"day":4,"time":"0830"},"close":{"day":4,"time":"1730"}},{"open":{"day":5,"time":"0830"},"close":{"day":5,"time":"1730"}}],"open_now":true,"weekday_text":["Monday: 8:30 AM – 5:30 PM","Tuesday: 8:30 AM – 5:30 PM","Wednesday: 8:30 AM – 5:30 PM","Thursday: 8:30 AM – 5:30 PM","Friday: 8:30 AM – 5:30 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        4.90,
        false,
        '2025-08-05T17:34:19.257Z',
        '2025-08-05T17:34:19.257Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '00694466-8b8d-4e4e-a3a4-6b9c85db0186',
        'ChIJm6Av2_6EqkAR7WrFLQb5ulw',
        'Happy Bar & Grill',
        'кв. Лозенец, ul. "Bogatitsa" 36, 1407 Sofia, Bulgaria',
        42.67029370,
        23.31370920,
        '0700 20 888',
        'https://happy.bg/',
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:30 PM","Tuesday: 11:00 AM – 10:30 PM","Wednesday: 11:00 AM – 10:30 PM","Thursday: 11:00 AM – 10:30 PM","Friday: 11:00 AM – 10:30 PM","Saturday: 11:00 AM – 10:30 PM","Sunday: 11:00 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        4.80,
        false,
        '2025-08-05T17:34:17.679Z',
        '2025-08-05T17:34:17.679Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '008592b6-f64b-4508-aa01-4d9ab066448a',
        'ChIJ_2qasWOFqkARF7zHahhEIEg',
        'easyApartments on Panagyurishte str.',
        'Sofia Center, ul. "Panagyurishte" 28, 1202 Sofia, Bulgaria',
        42.70559550,
        23.33024050,
        '087 905 9455',
        'http://holidays-tourist-apartment-sofia.top/',
        NULL,
        '{point_of_interest,lodging,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:15.325Z',
        '2025-08-05T17:34:15.325Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '00b6935b-bd60-4793-84e9-805b0a0193a3',
        'ChIJw3wQKcqFqkARxtqDK4LGCW4',
        'Cake Lab',
        'Old City Center, ul. "Karnigradska" 14, 1000 Sofia, Bulgaria',
        42.69335490,
        23.31943430,
        '088 943 2454',
        'http://cakelab-bg.com/',
        NULL,
        '{store,point_of_interest,bakery,food,establishment}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:00 PM","Tuesday: 8:00 AM – 7:00 PM","Wednesday: 8:00 AM – 7:00 PM","Thursday: 8:00 AM – 7:00 PM","Friday: 8:00 AM – 7:00 PM","Saturday: 9:00 AM – 7:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        4.20,
        false,
        '2025-08-05T17:34:34.782Z',
        '2025-08-05T17:34:34.782Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '01878928-0c68-4f97-ab4d-b0250fcffc73',
        'ChIJhyyxnMyFqkAR91uL_i0DsKI',
        'YUM Chinese',
        'Sofia Center, ul. "Tsar Shishman" 24, 1000 Sofia, Bulgaria',
        42.69092450,
        23.32918950,
        '087 729 9721',
        'http://facebook.com/profile.php?id=100087279311407',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"1600"}},{"open":{"day":1,"time":"1700"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"1600"}},{"open":{"day":2,"time":"1700"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"1600"}},{"open":{"day":3,"time":"1700"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"1600"}},{"open":{"day":4,"time":"1700"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"1600"}},{"open":{"day":5,"time":"1700"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 4:00 PM, 5:00 – 10:00 PM","Tuesday: 12:00 – 4:00 PM, 5:00 – 10:00 PM","Wednesday: 12:00 – 4:00 PM, 5:00 – 10:00 PM","Thursday: 12:00 – 4:00 PM, 5:00 – 10:00 PM","Friday: 12:00 – 4:00 PM, 5:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        5.30,
        false,
        '2025-08-05T17:34:15.522Z',
        '2025-08-05T17:34:15.522Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '01bc74c6-bb45-4718-a764-97ac6c86e1f1',
        'ChIJjSLkwgWFqkARUt-SyKEzf_A',
        'club *MIXTAPE 5*',
        'bul. Galeriya, Podlez @ Vitamin B, Old City Center, Blvd. "Cherni vrah", 1142 Sofia, Bulgaria',
        42.68310490,
        23.32109660,
        '087 929 5965',
        'https://www.facebook.com/mixtape5',
        NULL,
        '{point_of_interest,night_club,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:36.159Z',
        '2025-08-05T17:34:36.159Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '01ea0036-dafd-4201-bcb7-372dd1ba6107',
        'ChIJu57wWwaFqkARPG6oaSdh2VE',
        'Artisan Factory Bakery Lozenets - Gluten Free Bread and Healthy Food',
        'g.k. Lozenets, Blvd. "Cherni vrah" 17, 1421 Sofia, Bulgaria',
        42.68002930,
        23.32196940,
        '089 571 5836',
        'https://artisan.bg/',
        NULL,
        '{store,point_of_interest,food,establishment,bakery}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1500"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:00 PM","Tuesday: 8:00 AM – 7:00 PM","Wednesday: 8:00 AM – 7:00 PM","Thursday: 8:00 AM – 7:00 PM","Friday: 8:00 AM – 7:00 PM","Saturday: 9:00 AM – 3:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        4.50,
        false,
        '2025-08-05T17:34:26.975Z',
        '2025-08-05T17:34:26.975Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '01ff31b1-e3fc-4239-aeb2-c694c6776766',
        'ChIJ9XSkWWyFqkARQoz1jmVsvEw',
        'Vitosha Street Bar & Dinner',
        'Sofia Center, bul. "Vitosha" 10, 1000 Sofia, Bulgaria',
        42.69415190,
        23.32049610,
        '088 766 7666',
        'https://www.facebook.com/Vitosha.street',
        NULL,
        '{point_of_interest,restaurant,bar,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0830"},"close":{"day":1,"time":"0200"}},{"open":{"day":1,"time":"0800"},"close":{"day":2,"time":"0200"}},{"open":{"day":2,"time":"0800"},"close":{"day":3,"time":"0200"}},{"open":{"day":3,"time":"0800"},"close":{"day":4,"time":"0200"}},{"open":{"day":4,"time":"0800"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"0800"},"close":{"day":6,"time":"0200"}},{"open":{"day":6,"time":"0830"},"close":{"day":0,"time":"0200"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 2:00 AM","Tuesday: 8:00 AM – 2:00 AM","Wednesday: 8:00 AM – 2:00 AM","Thursday: 8:00 AM – 2:00 AM","Friday: 8:00 AM – 2:00 AM","Saturday: 8:30 AM – 2:00 AM","Sunday: 8:30 AM – 2:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:21.873Z',
        '2025-08-05T17:34:21.873Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '02bb796a-c9e5-4d26-95e6-3341b6ba5b24',
        'ChIJ8f69nnKFqkAR9SKz0yov7Yg',
        'Veren Ltd',
        'Old City Center, pl. "Petko R. Slaveykov" 1, 1000 Sofia, Bulgaria',
        42.69226730,
        23.32358450,
        '02 981 6241',
        'http://veren.bg/',
        NULL,
        '{bar,night_club,store,point_of_interest,book_store,establishment}',
        '{"periods":[{"open":{"day":1,"time":"0930"},"close":{"day":1,"time":"1830"}},{"open":{"day":2,"time":"0930"},"close":{"day":2,"time":"1830"}},{"open":{"day":3,"time":"0930"},"close":{"day":3,"time":"1830"}},{"open":{"day":4,"time":"0930"},"close":{"day":4,"time":"1830"}},{"open":{"day":5,"time":"0930"},"close":{"day":5,"time":"1830"}}],"open_now":false,"weekday_text":["Monday: 9:30 AM – 6:30 PM","Tuesday: 9:30 AM – 6:30 PM","Wednesday: 9:30 AM – 6:30 PM","Thursday: 9:30 AM – 6:30 PM","Friday: 9:30 AM – 6:30 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.80,
        false,
        '2025-08-05T17:34:26.910Z',
        '2025-08-05T17:34:26.910Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '02ccdb5d-0e07-4d4a-89a0-f8877716f4d6',
        'ChIJWZyEk52FqkARRcyPcrq4F5c',
        'Cakey Bakey',
        'Doctor''s Garden, Shipka Street 5, 1504 Sofia, Bulgaria',
        42.69352440,
        23.33995590,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:38.718Z',
        '2025-08-05T17:34:38.718Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '02d38baa-1284-44b7-b253-59fca857c7d3',
        'ChIJHcKPrW-FqkAR12dXPzc3TP8',
        'Arte Sofia Hotel',
        'Old City Center, Knyaz Alexander Dondukov Blvd 5, 1000 Sofia, Bulgaria',
        42.69792490,
        23.32499930,
        '087 836 0770',
        'http://www.artehotelbg.com/',
        NULL,
        '{establishment,point_of_interest,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.153Z',
        '2025-08-05T17:34:21.153Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '030264c1-be57-4274-9c3d-9fbd574a0a75',
        'ChIJjz-yFguFqkARFM0kr71yB84',
        'Adel 99-A.Andreeva',
        'Sofia, V.Levski Blvd 70, Old City Center, 1142 Sofia, Bulgaria',
        42.68831000,
        23.32945000,
        '02 981 7410',
        NULL,
        NULL,
        '{food,point_of_interest,establishment,cafe,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"1700"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2030"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2030"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2030"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2030"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2030"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2030"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 8:30 PM","Tuesday: 10:00 AM – 8:30 PM","Wednesday: 10:00 AM – 8:30 PM","Thursday: 10:00 AM – 8:30 PM","Friday: 10:00 AM – 8:30 PM","Saturday: 10:00 AM – 8:30 PM","Sunday: 11:00 AM – 5:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:29.341Z',
        '2025-08-05T17:34:29.341Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '03d61a92-ad2e-4dcd-ab99-188456e390a3',
        'ChIJo2abhW2FqkARe9NQ4yGHJlk',
        'The 1 Exclusive Official',
        'Sofia Center, ul. "Ivan Vazov" 12, 1000 Sofia, Bulgaria',
        42.69278160,
        23.32793050,
        '088 221 1111',
        'https://coyotegroup.org/',
        NULL,
        '{point_of_interest,establishment,night_club}',
        '{"periods":[{"open":{"day":4,"time":"2300"},"close":{"day":5,"time":"0600"}},{"open":{"day":5,"time":"2300"},"close":{"day":6,"time":"0600"}},{"open":{"day":6,"time":"2300"},"close":{"day":0,"time":"0600"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: 11:00 PM – 6:00 AM","Friday: 11:00 PM – 6:00 AM","Saturday: 11:00 PM – 6:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:36.559Z',
        '2025-08-05T17:34:36.559Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '05335855-c728-4675-a632-d68c61f7cb19',
        'ChIJPweWXUGFqkARmjh5e5scGHk',
        'McCafe',
        'Mall of Sofia, ет, Zona B-5, "Aleksandar Stamboliyski" Blvd 101, 2 Sofia, Bulgaria',
        42.69844000,
        23.30905000,
        '088 400 0317',
        'http://www.mccafecoffee.com/',
        NULL,
        '{food,cafe,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:00 PM","Tuesday: 10:00 AM – 10:00 PM","Wednesday: 10:00 AM – 10:00 PM","Thursday: 10:00 AM – 10:00 PM","Friday: 10:00 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 10:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:24.878Z',
        '2025-08-05T17:34:24.878Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '059951b3-8f79-42ab-9286-47780511a582',
        'ChIJ_XmgvwaFqkARPPQdkJ1aLy0',
        'Fish A Chick',
        'Zona B-5, "Aleksandar Stamboliyski" Blvd 101 A, 1303 Sofia, Bulgaria',
        42.69824910,
        23.30832940,
        '088 969 0660',
        'https://fishachick.com/',
        NULL,
        '{point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2130"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2130"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2130"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2130"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2130"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2130"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2130"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 9:30 PM","Tuesday: 10:00 AM – 9:30 PM","Wednesday: 10:00 AM – 9:30 PM","Thursday: 10:00 AM – 9:30 PM","Friday: 10:00 AM – 9:30 PM","Saturday: 10:00 AM – 9:30 PM","Sunday: 10:00 AM – 9:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:33.536Z',
        '2025-08-05T17:34:33.536Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0753a1b1-7aa4-47b4-bfb8-8ceacb0e415f',
        'ChIJRce8DGmFqkARmtqHAoSmDa4',
        'Pizzeria "Olio D''Oliva"',
        'Old City Center, ul. "Tsar Samuil" 60, 1000 Sofia, Bulgaria',
        42.69808810,
        23.31820290,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:15.260Z',
        '2025-08-05T17:34:15.260Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '081a3c85-520c-474e-97cc-1803e55d5df9',
        'ChIJlct86myFqkARrh8E9rt-GXA',
        'Pastorant',
        'Old City Center, ul. "Tsar Asen" 16, 1000 Sofia, Bulgaria',
        42.69329230,
        23.31904520,
        '088 702 6190',
        'http://pastorant.eu/',
        NULL,
        '{point_of_interest,food,establishment,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"1500"}},{"open":{"day":1,"time":"1800"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"1500"}},{"open":{"day":2,"time":"1800"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"1500"}},{"open":{"day":3,"time":"1800"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"1500"}},{"open":{"day":4,"time":"1800"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"1500"}},{"open":{"day":5,"time":"1800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"1500"}},{"open":{"day":6,"time":"1800"},"close":{"day":6,"time":"2200"}}],"open_now":false,"weekday_text":["Monday: 12:00 – 3:00 PM, 6:00 – 10:00 PM","Tuesday: 12:00 – 3:00 PM, 6:00 – 10:00 PM","Wednesday: 12:00 – 3:00 PM, 6:00 – 10:00 PM","Thursday: 12:00 – 3:00 PM, 6:00 – 10:00 PM","Friday: 12:00 – 3:00 PM, 6:00 – 10:00 PM","Saturday: 12:00 – 3:00 PM, 6:00 – 10:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        3.50,
        false,
        '2025-08-05T17:34:38.913Z',
        '2025-08-05T17:34:38.913Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0a4dfdce-1138-4733-9224-04c1d71ae5ec',
        'ChIJw3ebkoKPqkARNLMJJbZu-yk',
        'Kaufland София-Хаджи Димитър',
        'НПЗ Хаджи Димитър, ul. "Rezbarska" 7B, 1510 Sofia, Bulgaria',
        42.71289700,
        23.35506170,
        '0800 12 220',
        'https://www.kaufland.bg/?cid=BG:loc:google_1627538199456',
        NULL,
        '{establishment,food,store,point_of_interest,bakery,grocery_or_supermarket,supermarket}',
        '{"periods":[{"open":{"day":0,"time":"0700"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0700"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0700"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0700"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0700"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0700"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 10:00 PM","Tuesday: 7:00 AM – 10:00 PM","Wednesday: 7:00 AM – 10:00 PM","Thursday: 7:00 AM – 10:00 PM","Friday: 7:00 AM – 10:00 PM","Saturday: 7:00 AM – 10:00 PM","Sunday: 7:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:28.484Z',
        '2025-08-05T17:34:28.484Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0a5bf89c-6482-40f8-8b16-731b027c6c5e',
        'ChIJDbOB5OaEqkARjFWVBIUfOsU',
        'Biosof bakery',
        'ж.к. Стрелбище, ul. "Tvardishki Prohod" 23, 1404 Sofia, Bulgaria',
        42.67194420,
        23.29549310,
        '088 486 5242',
        'http://www.biosof.bg/',
        NULL,
        '{store,point_of_interest,establishment,bakery,food}',
        '{"periods":[{"open":{"day":0,"time":"0730"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"0730"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0730"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0730"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0730"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0730"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0730"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 7:30 AM – 9:00 PM","Tuesday: 7:30 AM – 9:00 PM","Wednesday: 7:30 AM – 9:00 PM","Thursday: 7:30 AM – 9:00 PM","Friday: 7:30 AM – 9:00 PM","Saturday: 7:30 AM – 9:00 PM","Sunday: 7:30 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.90,
        false,
        '2025-08-05T17:34:14.344Z',
        '2025-08-05T17:34:14.344Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0b31ecae-6afb-418e-9829-bf33bf02019f',
        'ChIJ2aVbbkSFqkARaMNy5SXo-EQ',
        'City Avenue Hotel',
        'Sofia Center, ul. "Osogovo" 49, 1303 Sofia, Bulgaria',
        42.70078580,
        23.30810740,
        '02 471 5000',
        'http://www.hotelcityavenue.com/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:27.040Z',
        '2025-08-05T17:34:27.040Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0d54af1e-44f3-4cd5-9fb9-d96ed18a3354',
        'ChIJ9zlKVbqFqkARdHmVN-EIOiI',
        'CornDog',
        'Aleksandar Stamboliyski" Blvd 101 A, 1303, ж.к. Зона Б-5, 1000 София, Bulgaria',
        42.69844000,
        23.30904990,
        '089 612 7274',
        'https://www.facebook.com/CornDogSofia',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:33.471Z',
        '2025-08-05T17:34:33.471Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0d982b91-e225-4d74-84aa-7198f97d822d',
        'ChIJJ8YJ3wyFqkARSKc55WfJRl8',
        'Camino',
        'Old City Center, ul. "Neofit Rilski" 70, 1000 Sofia, Bulgaria',
        42.68964410,
        23.32461680,
        '089 912 1219',
        'https://facebook.com/Piano-Bar-Camino-124139240960266/',
        NULL,
        '{bar,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":4,"time":"2230"},"close":{"day":5,"time":"0430"}},{"open":{"day":5,"time":"2230"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"2230"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: 10:30 PM – 4:30 AM","Friday: 10:30 PM – 5:00 AM","Saturday: 10:30 PM – 5:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:25.468Z',
        '2025-08-05T17:34:25.468Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0dc2585d-a1ce-417c-9abe-5712a7bf7b7c',
        'ChIJ5wQsynOFqkARhj_kK820T3w',
        'Hotel Slavyanska Beseda',
        'Old City Center, ul. "Slavyanska" 3, 1000 Sofia, Bulgaria',
        42.69359730,
        23.32836930,
        '02 980 1303',
        'https://slavyanska.com/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:22.068Z',
        '2025-08-05T17:34:22.068Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0f851a84-9682-49e4-8679-259cbc8153e3',
        'ChIJ6YiE1-SEqkARJnwE4-6OIkQ',
        'Рай кетъринг',
        '171, ж.к. Стрелбище, ul. "Nishava" 167, 1408 Sofia, Bulgaria',
        42.67009340,
        23.30323740,
        '088 832 4797',
        'http://www.rai-catering.com/',
        NULL,
        '{establishment,point_of_interest,meal_delivery,food}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"1700"}},{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"1700"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1700"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1700"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1700"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1700"}},{"open":{"day":6,"time":"0830"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 5:00 PM","Tuesday: 8:00 AM – 5:00 PM","Wednesday: 8:00 AM – 5:00 PM","Thursday: 8:00 AM – 5:00 PM","Friday: 8:00 AM – 5:00 PM","Saturday: 8:30 AM – 5:00 PM","Sunday: 8:00 AM – 5:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:37.607Z',
        '2025-08-05T17:34:37.607Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0fa1e58c-b1d9-426b-a3a6-14f14b84a7c2',
        'ChIJFaJqFAuFqkAR3s19-RYXrsE',
        'Mr. Pizza - bul. Vasil Levski',
        'Old City Center, bul. "Vasil Levski" 53, 1142 Sofia, Bulgaria',
        42.68866720,
        23.32904620,
        '088 829 7454',
        'http://www.mrpizza.bg/',
        NULL,
        '{restaurant,meal_takeaway,meal_delivery,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2320"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2320"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2320"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2320"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2320"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2320"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2320"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:20 PM","Tuesday: 11:00 AM – 11:20 PM","Wednesday: 11:00 AM – 11:20 PM","Thursday: 11:00 AM – 11:20 PM","Friday: 11:00 AM – 11:20 PM","Saturday: 11:00 AM – 11:20 PM","Sunday: 11:00 AM – 11:20 PM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:24.353Z',
        '2025-08-05T17:34:24.353Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '0fcb2b16-0177-491a-84a3-fe42d0b78471',
        'ChIJZUnpY2mFqkARXJ46PQ_mtjE',
        'Green Deli Cafe',
        'Old City Center, "Aleksandar Stamboliyski" Blvd 35, 1000 Sofia, Bulgaria',
        42.69700890,
        23.31753750,
        '087 756 6060',
        'http://www.greendelicafe.com/',
        NULL,
        '{establishment,store,point_of_interest,restaurant,food,cafe}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"1700"}},{"open":{"day":1,"time":"0730"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0730"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0730"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0730"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0730"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 7:30 AM – 7:00 PM","Tuesday: 7:30 AM – 7:00 PM","Wednesday: 7:30 AM – 7:00 PM","Thursday: 7:30 AM – 7:00 PM","Friday: 7:30 AM – 7:00 PM","Saturday: 8:00 AM – 5:00 PM","Sunday: 8:00 AM – 5:00 PM"]}',
        '{}',
        NULL,
        NULL,
        5.00,
        false,
        '2025-08-05T17:34:21.611Z',
        '2025-08-05T17:34:21.611Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '10667f23-7b31-45c1-876c-00ae4fb0db87',
        'ChIJoxo52raFqkARpr1QKy8mrT4',
        'Trakijska banitsa',
        'Sofia Center, 1000 Sofia, Bulgaria',
        42.69830490,
        23.32159900,
        NULL,
        'https://trakiiskabanica.com/',
        NULL,
        '{bakery,establishment,point_of_interest,store,food}',
        '{"periods":[{"open":{"day":0,"time":"0600"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"0600"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0600"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0600"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0600"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0600"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0600"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 6:00 AM – 9:00 PM","Tuesday: 6:00 AM – 9:00 PM","Wednesday: 6:00 AM – 9:00 PM","Thursday: 6:00 AM – 9:00 PM","Friday: 6:00 AM – 9:00 PM","Saturday: 6:00 AM – 8:00 PM","Sunday: 6:00 AM – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:28.086Z',
        '2025-08-05T17:34:28.086Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '10b507a5-ee4a-4ca3-80fa-2459b1521832',
        'ChIJ_23fY2yFqkARtJdpATZNYns',
        'Mania 5',
        'София, ул. Цар Асен I 6, g.k. Yavorov, 1124 Sofia, Bulgaria',
        42.69023330,
        23.33944690,
        '02 980 8052',
        NULL,
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:39.044Z',
        '2025-08-05T17:34:39.044Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '112854b2-028d-4b0b-9890-6d7e2c67376a',
        'ChIJwwylN1mFqkARtoHj7NGjMZM',
        '7suns',
        'g.k. Banishora, ul. "Strandzha" 109, 1233 Sofia, Bulgaria',
        42.70813500,
        23.31505050,
        '089 667 7300',
        NULL,
        NULL,
        '{food,point_of_interest,establishment,cafe,store,night_club}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 10:00 PM","Tuesday: 8:00 AM – 10:00 PM","Wednesday: 8:00 AM – 10:00 PM","Thursday: 8:00 AM – 10:00 PM","Friday: 8:00 AM – 10:00 PM","Saturday: 8:00 AM – 10:00 PM","Sunday: 8:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:24.944Z',
        '2025-08-05T17:34:24.944Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '12059903-19f1-406f-be0c-2cf1b7b1c544',
        'ChIJJRxIoG-FqkARJttNm_8SfXU',
        'Da Mamma Carla and Fabio',
        'Old City Center, ul. "Dyakon Ignatiy" 19, 1000 Sofia, Bulgaria',
        42.69262480,
        23.32450440,
        '088 945 4594',
        'http://ristorante.bg/',
        NULL,
        '{food,restaurant,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1130"},"close":{"day":2,"time":"0030"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 12:30 AM","Tuesday: 11:30 AM – 10:30 PM","Wednesday: 11:30 AM – 10:30 PM","Thursday: 11:30 AM – 10:30 PM","Friday: 11:30 AM – 10:30 PM","Saturday: 11:30 AM – 10:30 PM","Sunday: 11:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:32.683Z',
        '2025-08-05T17:34:32.683Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '122c1fa3-fc3b-4a0c-984c-173ed1f2d34e',
        'ChIJb1lcPAaFqkARv8cRHb3LA8g',
        'Mamma Mia Ltd',
        'g.k. Lozenets, ul. "Kapitan Andreev" 13, 1421 Sofia, Bulgaria',
        42.68201270,
        23.32386840,
        '02 963 2828',
        NULL,
        NULL,
        '{establishment,point_of_interest,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2215"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2215"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2215"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2215"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2215"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2215"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2215"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:15 PM","Tuesday: 12:00 – 10:15 PM","Wednesday: 12:00 – 10:15 PM","Thursday: 12:00 – 10:15 PM","Friday: 12:00 – 10:15 PM","Saturday: 12:00 – 10:15 PM","Sunday: 12:00 – 10:15 PM"]}',
        '{}',
        NULL,
        NULL,
        3.90,
        false,
        '2025-08-05T17:34:14.672Z',
        '2025-08-05T17:34:14.672Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1335c076-3cec-42f9-ac3b-5a161414deb3',
        'ChIJv4epgHCFqkARjSw4IhruAgI',
        'Vino & Tapas',
        'Old City Center, Knyaz Alexander Dondukov Blvd 38, 1000 Sofia, Bulgaria',
        42.69827470,
        23.33200800,
        '087 841 0930',
        'http://www.vinoandtapas.com/',
        NULL,
        '{food,bar,restaurant,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":1,"time":"1700"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1700"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1700"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1700"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1700"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1700"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 5:00 – 11:00 PM","Tuesday: 5:00 – 11:00 PM","Wednesday: 5:00 – 11:00 PM","Thursday: 5:00 – 11:00 PM","Friday: 5:00 – 11:00 PM","Saturday: 5:00 – 11:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:19.716Z',
        '2025-08-05T17:34:19.716Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '13a91a90-9ffd-44ab-b553-afa23cb19b25',
        'ChIJi4vWOMqZqkARJWv_nlsa_Bs',
        'Doner Bankya',
        'ul. "Aleksandar Stamboliyski" 3, 1320 Bankya, Bulgaria',
        42.70791430,
        23.14483840,
        NULL,
        NULL,
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.70,
        false,
        '2025-08-05T17:34:27.302Z',
        '2025-08-05T17:34:27.302Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1415e16c-ab3e-4f92-934e-74854f2cde7f',
        'ChIJ8Z5kQf2EqkARwlonwXxUuhQ',
        'Domino''s Pizza',
        'Yuzhen, ul. "Byala cherkva", 1407 Sofia, Bulgaria',
        42.67442450,
        23.30941650,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:29.669Z',
        '2025-08-05T17:34:29.669Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '14f7686f-5d06-4c0b-9046-cb8a6a9d7aa5',
        'ChIJe_vIiJyFqkAR6bh6smBCD20',
        'ONE GALLERY',
        'Old City Center, ul. "Dyakon Ignatiy" 1a, 1000 Sofia, Bulgaria',
        42.69535220,
        23.32687560,
        '088 425 8311',
        'http://onegallery.eu/',
        NULL,
        '{bar,art_gallery,food,cafe,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0100"}},{"open":{"day":1,"time":"1000"},"close":{"day":2,"time":"0100"}},{"open":{"day":2,"time":"1000"},"close":{"day":3,"time":"0100"}},{"open":{"day":3,"time":"1000"},"close":{"day":4,"time":"0100"}},{"open":{"day":4,"time":"1000"},"close":{"day":5,"time":"0100"}},{"open":{"day":5,"time":"1000"},"close":{"day":6,"time":"0100"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0100"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 1:00 AM","Tuesday: 10:00 AM – 1:00 AM","Wednesday: 10:00 AM – 1:00 AM","Thursday: 10:00 AM – 1:00 AM","Friday: 10:00 AM – 1:00 AM","Saturday: 10:00 AM – 1:00 AM","Sunday: 10:00 AM – 1:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:24.813Z',
        '2025-08-05T17:34:24.813Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '14fc350c-8405-408d-a14c-017bb4e97854',
        'ChIJU0IcCm6FqkAR8zv-z6sXekU',
        'Mercanti Pizzeria & So.',
        'Sofia Center, ul. "Triaditsa" 4, 1000 Sofia, Bulgaria',
        42.69863070,
        23.32458110,
        '088 330 7033',
        'https://instagram.com/mercanti.sofia',
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 11:30 PM","Tuesday: 10:00 AM – 11:30 PM","Wednesday: 10:00 AM – 11:30 PM","Thursday: 10:00 AM – 11:30 PM","Friday: 10:00 AM – 11:30 PM","Saturday: 10:00 AM – 11:30 PM","Sunday: 10:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:37.933Z',
        '2025-08-05T17:34:37.933Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '162f2350-c0f2-4051-9526-a1313dc8e12a',
        'ChIJN4rAtGKDqkARby77aWlVhxo',
        'Cinecitta Osteria Italiana',
        'BojanaVitosha, ul. "Kumata" 75, 1616 Sofia, Bulgaria',
        42.64309020,
        23.28286540,
        '088 576 0160',
        'http://www.cinecitta.bg/',
        NULL,
        '{establishment,point_of_interest,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:38.195Z',
        '2025-08-05T17:34:38.195Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '16fc0216-3c1a-4ceb-8552-d6714c3535af',
        'ChIJ5dmIJJ6FqkARz0WzLzGQTk8',
        'Been Purple Bar',
        'Doctor''s Garden, San Stefano St 24, 1504 Sofia, Bulgaria',
        42.69123290,
        23.33723300,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:29.538Z',
        '2025-08-05T17:34:29.538Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '17b588b3-4732-4f27-97aa-5caa20a981c8',
        'ChIJRcGJIHeFqkARfS3XE8Tz3s0',
        'Izzy''s Coffee and Brunch',
        'Sofia Center, Knyagina Maria Luisa Blvd 17, 1000 Sofia, Bulgaria',
        42.69882120,
        23.32147390,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:18.799Z',
        '2025-08-05T17:34:18.799Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '183ebcfa-09b7-4265-a1b2-859dab5236d8',
        'ChIJ8UiCtGCFqkARoVdfq0vaCyI',
        'Hotel Adria',
        'Sofia Center, ul. "Knyaz Boris I" 207, 1202 Sofia, Bulgaria',
        42.70755520,
        23.32158850,
        '088 845 7733',
        'https://hotel-adria.eu/',
        NULL,
        '{lodging,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:29.080Z',
        '2025-08-05T17:34:29.080Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '187d2dcb-ea0f-4575-b100-79ad995f1c4a',
        'ChIJuduoJ3CFqkAR0TlrT_5b7Fc',
        'Gramophone Live&Event Club',
        'Old City Center, ul. Budapeshta 6, 1000 Sofia, Bulgaria',
        42.69764600,
        23.32817570,
        '089 882 9676',
        'https://gramophoneclub.com/',
        NULL,
        '{night_club,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":4,"time":"2000"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"2100"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"2100"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: 8:00 PM – 2:00 AM","Friday: 9:00 PM – 5:00 AM","Saturday: 9:00 PM – 5:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:26.449Z',
        '2025-08-05T17:34:26.449Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '18fbe8de-2463-4c89-bee3-68d96ba2c00b',
        'ChIJJ8ILPXCFqkARZ4EpNZAVUN4',
        'The Happy Bakery',
        'Sofia Center, Knyaz Alexander Dondukov Blvd 24a, 1000 Sofia, Bulgaria',
        42.69802290,
        23.32959190,
        '02 444 3020',
        'https://www.facebook.com/Thehappybakerybg/',
        NULL,
        '{point_of_interest,food,bakery,establishment,restaurant,store}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 8:00 PM","Tuesday: 8:00 AM – 8:00 PM","Wednesday: 8:00 AM – 8:00 PM","Thursday: 8:00 AM – 8:00 PM","Friday: 8:00 AM – 8:00 PM","Saturday: 8:00 AM – 8:00 PM","Sunday: 8:00 AM – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:34.319Z',
        '2025-08-05T17:34:34.319Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '19c43ba4-fec3-45c0-9902-ad264a6635df',
        'ChIJJ_fOgW-FqkAR0_XvhhnmqFM',
        'Leo''s Pizza Trattoria',
        'g.k. Iztok, ul. "Lachezar Stanchev" 5, 1797 Sofia, Bulgaria',
        42.66603000,
        23.35705230,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:37.802Z',
        '2025-08-05T17:34:37.802Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '19d25d33-84b0-4dea-80a2-c6422443fe68',
        'ChIJ9U1iVUGFqkARX8Q9rxz-HMg',
        'Nedelya',
        'Sofia Center, "Aleksandar Stamboliyski" Blvd 90, 1303 Sofia, Bulgaria',
        42.69894270,
        23.30815460,
        '088 560 0827',
        'https://nedelya.com/sladkarnitsi',
        NULL,
        '{store,establishment,food,bakery,point_of_interest,cafe}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 9:00 PM","Tuesday: 8:00 AM – 9:00 PM","Wednesday: 8:00 AM – 9:00 PM","Thursday: 8:00 AM – 9:00 PM","Friday: 8:00 AM – 9:00 PM","Saturday: 8:00 AM – 9:00 PM","Sunday: 9:00 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:24.549Z',
        '2025-08-05T17:34:24.549Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1a4d3a10-c462-4a4a-aae2-5125bbcfe178',
        'ChIJLb1XxwuZqkARiJZVj6mit_s',
        'Bistro "Chestnuts" Bankya',
        'На входа на парка, 1320 Bankya, Bulgaria',
        42.70670220,
        23.14654650,
        '089 683 7702',
        NULL,
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"1900"}}],"open_now":false,"weekday_text":["Monday: 10:00 AM – 7:00 PM","Tuesday: 10:00 AM – 7:00 PM","Wednesday: 10:00 AM – 7:00 PM","Thursday: 10:00 AM – 7:00 PM","Friday: 10:00 AM – 7:00 PM","Saturday: 10:00 AM – 7:00 PM","Sunday: 10:00 AM – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:15.979Z',
        '2025-08-05T17:34:15.979Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1b1a4585-2510-4578-9bb9-dfcf0c946f76',
        'ChIJodcwZAmZqkARC672vqbcBWQ',
        'Bar&Diner "Smile"',
        'ul. "Knyaz Boris I" 2А, 1320 Bankya, Bulgaria',
        42.70753890,
        23.14482920,
        '089 787 5323',
        NULL,
        NULL,
        '{restaurant,food,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0630"},"close":{"day":0,"time":"1200"}},{"open":{"day":1,"time":"0630"},"close":{"day":1,"time":"1200"}},{"open":{"day":2,"time":"0630"},"close":{"day":2,"time":"1200"}},{"open":{"day":3,"time":"0630"},"close":{"day":3,"time":"1200"}},{"open":{"day":4,"time":"0630"},"close":{"day":4,"time":"1200"}},{"open":{"day":5,"time":"0630"},"close":{"day":5,"time":"1200"}},{"open":{"day":6,"time":"0630"},"close":{"day":6,"time":"1200"}}],"open_now":false,"weekday_text":["Monday: 6:30 AM – 12:00 PM","Tuesday: 6:30 AM – 12:00 PM","Wednesday: 6:30 AM – 12:00 PM","Thursday: 6:30 AM – 12:00 PM","Friday: 6:30 AM – 12:00 PM","Saturday: 6:30 AM – 12:00 PM","Sunday: 6:30 AM – 12:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:16.307Z',
        '2025-08-05T17:34:16.307Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1c65da3b-ad42-4cfc-8598-6fb1878f025a',
        'ChIJz5kNAuODqkARLyNzzv_MT1g',
        'Atlantic',
        '19th Street, в.з. Симеоново - северVitosha, 1434 Sofia, Bulgaria',
        42.62245260,
        23.33081250,
        '087 878 7787',
        'https://atlantic-bg.com/',
        NULL,
        '{lodging,establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        2.20,
        false,
        '2025-08-05T17:34:17.548Z',
        '2025-08-05T17:34:17.548Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1cc17796-8398-4e30-8329-58d95178d650',
        'ChIJCeOyXw-FqkARInG-fouDjKA',
        'Hilton Sofia',
        'g.k. Lozenets, blvd. "Bulgaria" 1, 1421 Sofia, Bulgaria',
        42.68132250,
        23.31969670,
        '02 933 5000',
        'https://www.hilton.com/en/hotels/sofhihi-hilton-sofia/?SEO_id=GMB-EMEA-HI-SOFHIHI',
        NULL,
        '{point_of_interest,lodging,spa,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:14.147Z',
        '2025-08-05T17:34:14.147Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1d6b70b0-2b90-4f41-9b62-4e3a76cad561',
        'ChIJP2rbN9-EqkARRcPqF8Bk8J0',
        'Ресторант Ниагара-Дойран/Niagara',
        'ж.к. Белите брези, ul. "Doyran" 2, 1612 Sofia, Bulgaria',
        42.67874880,
        23.29101000,
        '089 986 3380',
        'https://niagarabg.com/',
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1000"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1000"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1000"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1000"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1000"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 12:00 AM","Tuesday: 10:00 AM – 12:00 AM","Wednesday: 10:00 AM – 12:00 AM","Thursday: 10:00 AM – 12:00 AM","Friday: 10:00 AM – 12:00 AM","Saturday: 10:00 AM – 12:00 AM","Sunday: 10:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.50,
        false,
        '2025-08-05T17:34:39.962Z',
        '2025-08-05T17:34:39.962Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1dfec6d9-13db-41fd-ae18-bed7ebf6273e',
        'ChIJ8QZMOzOFqkARSPEVhfLxTiI',
        'Don Vito 3',
        'Sofia, Krasna Polyana, bl. 329, ж.к. Красна поляна 3, 1330 Sofia, Bulgaria',
        42.69353460,
        23.28304720,
        '089 437 7157',
        'http://www.pizzadonvito.com/',
        NULL,
        '{food,establishment,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 11:00 PM","Tuesday: 10:30 AM – 11:00 PM","Wednesday: 10:30 AM – 11:00 PM","Thursday: 10:30 AM – 11:00 PM","Friday: 10:30 AM – 11:00 PM","Saturday: 10:30 AM – 11:00 PM","Sunday: 10:30 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:18.340Z',
        '2025-08-05T17:34:18.340Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1e3a4d25-7e9a-4ae9-852d-1c595351897a',
        'ChIJ3TVrVu-FqkARYBhT6NI-tVQ',
        'Osteria Pastoccino',
        'улица „Сан Стефано, Doctor''s Garden, ul. "Sheynovo" 27В, вход откъм, 1504 Sofia, Bulgaria',
        42.69220910,
        23.33917560,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:32.812Z',
        '2025-08-05T17:34:32.812Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1e7c2e9e-e7d8-450c-a1b0-2bc50c9e0966',
        'ChIJ52RkzsuFqkARZZdg6FvaZCc',
        'Restaurant "PRINCIPI DI PIEMONTE" Interpred',
        'g.k. Izgrev, bul. "Dragan Tsankov" 36, 1040 Sofia, Bulgaria',
        42.67044900,
        23.35095860,
        '088 688 6227',
        'http://www.facebook.com/Restaurant.PRINCIPI.DI.PIEMONTE.Interpred',
        NULL,
        '{establishment,point_of_interest,restaurant,food}',
        '{"periods":[{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"0000"},"close":{"day":1,"time":"0000"}}],"open_now":false,"weekday_text":["Monday: 9:00 AM – 6:00 PM","Tuesday: 9:00 AM – 6:00 PM","Wednesday: 9:00 AM – 6:00 PM","Thursday: 9:00 AM – 6:00 PM","Friday: 9:00 AM – 6:00 PM","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:27.368Z',
        '2025-08-05T17:34:27.368Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1eb887b6-d626-4ccd-974a-cb877142991a',
        'ChIJJ0WPPkWFqkARfLB-V2O8GNg',
        'Better Specialty Coffee',
        'Old City Center, ul. "Neofit Rilski" 59, 1000 Sofia, Bulgaria',
        42.68991100,
        23.32448510,
        '088 644 1132',
        'https://www.instagram.com/betterspecialtycoffee/',
        NULL,
        '{food,cafe,establishment,point_of_interest,store}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 6:00 PM","Tuesday: 8:00 AM – 6:00 PM","Wednesday: 8:00 AM – 6:00 PM","Thursday: 8:00 AM – 6:00 PM","Friday: 8:00 AM – 6:00 PM","Saturday: 9:00 AM – 6:00 PM","Sunday: 9:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        5.10,
        false,
        '2025-08-05T17:34:14.410Z',
        '2025-08-05T17:34:14.410Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1efbeb4e-3caa-4451-8dc4-f2a484895dec',
        'ChIJQzj9EsqFqkARDdLowzQv_fA',
        'FLOW Coffee and Pastry',
        'Old City Center, ul. Budapeshta 26, 1202 Sofia, Bulgaria',
        42.70028640,
        23.32765880,
        '089 733 1630',
        'http://instagram.com/flowcoffeesofia',
        NULL,
        '{store,point_of_interest,cafe,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:00 PM","Tuesday: 8:00 AM – 7:00 PM","Wednesday: 8:00 AM – 7:00 PM","Thursday: 8:00 AM – 7:00 PM","Friday: 8:00 AM – 7:00 PM","Saturday: 9:00 AM – 7:00 PM","Sunday: 9:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:33.862Z',
        '2025-08-05T17:34:33.862Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '1f106f42-8743-4d3f-b184-6683e08d0d57',
        'ChIJ55UfQmmFqkARDOI_542rxsA',
        'Mr. Rice',
        'Bulgaria, Sofia, Old City Center, Княз Борис | 134邮政编码: 1000',
        42.69748410,
        23.31916030,
        '088 885 2216',
        NULL,
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 9:00 PM","Tuesday: 11:00 AM – 9:00 PM","Wednesday: 11:00 AM – 9:00 PM","Thursday: 11:00 AM – 9:00 PM","Friday: 11:00 AM – 9:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:32.355Z',
        '2025-08-05T17:34:32.355Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '207a55b3-5e43-45bb-8b4f-73fe4d15a61f',
        'ChIJf-nkZLKFqkARhi2y6Rs4Upc',
        'Sasaguri Sushi Bar',
        'Sofia Center, bul. "Patriarh Evtimiy" 66, 1164 Sofia, Bulgaria',
        42.68908330,
        23.31969170,
        '087 778 6189',
        'http://sasaguribg.com/',
        NULL,
        '{bar,restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.90,
        false,
        '2025-08-05T17:34:18.471Z',
        '2025-08-05T17:34:18.471Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '20c4025d-480f-44d6-965c-7dc144da2c2d',
        'ChIJU3-gWeaEqkARx9R0lTKMrEQ',
        'Meng Fu Yuan',
        'Motopista, ul. "Kestenova gora" 19, 1404 Sofia, Bulgaria',
        42.67061460,
        23.29520570,
        '089 464 3394',
        'http://mengfuyuan.com/',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:38.130Z',
        '2025-08-05T17:34:38.130Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2139f15d-a100-4358-a389-4ac980a48fe6',
        'ChIJ3dO0qW2FqkARd4MtxDDdUJY',
        'Пица 30см от вендинг автомат',
        'Sofia Center, bul. "Knyaginya Maria Luiza" 13, 1000 Sofia, Bulgaria',
        42.69855270,
        23.32156230,
        '088 415 1490',
        NULL,
        NULL,
        '{restaurant,point_of_interest,meal_takeaway,establishment,food}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:37.476Z',
        '2025-08-05T17:34:37.476Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2194e157-5253-42e1-b75e-ddb551a116f6',
        'ChIJBeh7XUGFqkARji_fGoz7MoU',
        'Pizza Lab',
        'Zona B-5, "Aleksandar Stamboliyski" Blvd 101, ет 2, 7701 Sofia, Bulgaria',
        42.69833060,
        23.30931060,
        '0700 42 888',
        'http://www.pizzalab.bg/',
        NULL,
        '{point_of_interest,food,restaurant,meal_takeaway,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        4.00,
        false,
        '2025-08-05T17:34:23.828Z',
        '2025-08-05T17:34:23.828Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '23084316-d418-44f4-bff7-592a341641bf',
        'ChIJ2c9p9TCEqkARCUdeh4_ZjKs',
        'Vega Hotel Sofia',
        'Studentski Kompleks, бул. „Доктор Г. М. Димитров“ 75, 1700 Sofia, Bulgaria',
        42.65911200,
        23.34769240,
        '02 806 6000',
        'http://www.hotelvegasofia.bg/',
        NULL,
        '{hair_care,lodging,restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:16.897Z',
        '2025-08-05T17:34:16.897Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2325b829-b376-4c9a-8087-9741cea54bd2',
        'ChIJQ5tuYWmFqkARFTT1hda4WFk',
        'Essence Bar',
        'Sofia Center, "Aleksandar Stamboliyski" Blvd 29, 1000 Sofia, Bulgaria',
        42.69709090,
        23.31825630,
        '089 999 8666',
        'https://www.facebook.com/baressence?fref=ts',
        NULL,
        '{point_of_interest,bar,establishment}',
        '{"periods":[{"open":{"day":5,"time":"2330"},"close":{"day":6,"time":"0400"}},{"open":{"day":6,"time":"2330"},"close":{"day":0,"time":"0400"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: Closed","Friday: 11:30 PM – 4:00 AM","Saturday: 11:30 PM – 4:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.90,
        false,
        '2025-08-05T17:34:31.963Z',
        '2025-08-05T17:34:31.963Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '23996f40-7129-4fda-abf7-e1897b3675ed',
        'ChIJRWa8muqFqkARCm87a65EJiY',
        'Pizza "Djikov"',
        'Geo Milev, ul. "Geo Milev" 28, 1111 Sofia, Bulgaria',
        42.68370410,
        23.36057320,
        '02 872 3423',
        'http://www.pizzadjikov.com/',
        NULL,
        '{food,restaurant,point_of_interest,meal_takeaway,meal_delivery,bar,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 11:00 PM","Tuesday: 10:00 AM – 11:00 PM","Wednesday: 10:00 AM – 11:00 PM","Thursday: 10:00 AM – 11:00 PM","Friday: 10:00 AM – 11:00 PM","Saturday: 10:00 AM – 11:00 PM","Sunday: 10:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:29.866Z',
        '2025-08-05T17:34:29.866Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '23a33141-708e-42d3-aa34-5b63f89819c9',
        'ChIJma1x_WqFqkAROoB5hX3h-OE',
        'Hostel Mostel',
        'Sofia Center, bul. "Makedonia" 2A, 1000 Sofia, Bulgaria',
        42.69472580,
        23.31465230,
        '088 922 3296',
        'http://www.hostelmostel.com/',
        NULL,
        '{point_of_interest,lodging,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.284Z',
        '2025-08-05T17:34:21.284Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '23e95f51-d6db-4f55-b6c4-fae99fd57ca2',
        'ChIJaYumEFeEqkARbbxV_MYVC1g',
        'Domino''s Pizza - София - Вапцаров',
        'g.k. Lozenets, bul. "Nikola Y. Vaptsarov" 6, 1000 Sofia, Bulgaria',
        42.66565630,
        23.31917780,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:24.222Z',
        '2025-08-05T17:34:24.222Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '23ec5286-ae13-4289-8579-820064acd35d',
        'ChIJSeOtlGuFqkAREXcgueZl89g',
        'Monsun Kofi Kampani',
        'Sofia, Sq. Pozitano 7, Old City Center, 1000 Sofia, Bulgaria',
        42.69575290,
        23.31785040,
        '02 981 5685',
        NULL,
        NULL,
        '{cafe,point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 8:00 PM","Tuesday: 10:00 AM – 8:00 PM","Wednesday: 10:00 AM – 8:00 PM","Thursday: 10:00 AM – 8:00 PM","Friday: 10:00 AM – 8:00 PM","Saturday: 10:00 AM – 8:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:27.499Z',
        '2025-08-05T17:34:27.499Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '240ddecf-d4bd-4d40-bbe4-97c42aa30ecb',
        'ChIJASzqR2yFqkARIy0EMJAUGE4',
        'McCarthys Irish Pub',
        'Old City Center, ул. „Алабин И. Вл.“ 29, 1000 Sofia, Bulgaria',
        42.69499520,
        23.32116030,
        '089 353 6024',
        'https://www.facebook.com/McCarthysIrishPubs',
        NULL,
        '{food,point_of_interest,restaurant,establishment,bar}',
        '{"periods":[{"open":{"day":0,"time":"1800"},"close":{"day":1,"time":"0200"}},{"open":{"day":1,"time":"1800"},"close":{"day":2,"time":"0200"}},{"open":{"day":2,"time":"1800"},"close":{"day":3,"time":"0200"}},{"open":{"day":3,"time":"1800"},"close":{"day":4,"time":"0200"}},{"open":{"day":4,"time":"1800"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"1800"},"close":{"day":6,"time":"0200"}},{"open":{"day":6,"time":"1800"},"close":{"day":0,"time":"0400"}}],"open_now":true,"weekday_text":["Monday: 6:00 PM – 2:00 AM","Tuesday: 6:00 PM – 2:00 AM","Wednesday: 6:00 PM – 2:00 AM","Thursday: 6:00 PM – 2:00 AM","Friday: 6:00 PM – 2:00 AM","Saturday: 6:00 PM – 4:00 AM","Sunday: 6:00 PM – 2:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.50,
        false,
        '2025-08-05T17:34:27.563Z',
        '2025-08-05T17:34:27.563Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '243b186b-56e5-468c-9b60-ab711838eccf',
        'ChIJf-9SL16FqkARxGbb1Qz_3cA',
        'Hotel Cheap',
        'Sofia Center, ul. "Knyaz Boris I" 203, 1202 Sofia, Bulgaria',
        42.70723390,
        23.32168360,
        '088 912 0031',
        'https://hotel-cheap.bg/',
        NULL,
        '{lodging,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.765Z',
        '2025-08-05T17:34:35.765Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2489216d-fb95-4bcc-ae2f-3538fb4c6dc4',
        'ChIJpZj29qKEqkARkasvKdKCsfk',
        'hotel Bansko',
        'DragalevtsiVitosha, ул. „Бела Дона“ 6, 1415 Sofia, Bulgaria',
        42.62958760,
        23.31021450,
        '089 914 5223',
        'http://hotelbansko.net/',
        NULL,
        '{food,bar,lodging,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 10:00 PM","Tuesday: 8:00 AM – 10:00 PM","Wednesday: 8:00 AM – 10:00 PM","Thursday: 8:00 AM – 10:00 PM","Friday: 8:00 AM – 10:00 PM","Saturday: 8:00 AM – 10:00 PM","Sunday: 8:00 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:28.020Z',
        '2025-08-05T17:34:28.020Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '25477a9c-4b97-4c2a-9e26-5643017b1212',
        'ChIJ71EmHneFqkARICZNjpjltK0',
        'Planet Club',
        'Sofia Center, blvd. "Bulgaria" 1, 1463 Sofia, Bulgaria',
        42.68292800,
        23.31674670,
        '089 999 3942',
        'https://2020event.space/',
        NULL,
        '{point_of_interest,night_club,food,restaurant,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:14.081Z',
        '2025-08-05T17:34:14.081Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '264bc8f1-d6b0-45a3-a679-ecee1f2301ad',
        'ChIJXce1bnGFqkARV-7dqKhbLUU',
        'Park Bar',
        'Doctor''s Garden, Shipka Street 26, 1504 Sofia, Bulgaria',
        42.69344960,
        23.33946970,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:26.187Z',
        '2025-08-05T17:34:26.187Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '28437e82-acfd-4909-87e8-6f3df86ccced',
        'ChIJVUZ7eeiZqkAReDsS2Z9ZNg8',
        'Ресторант при Димата',
        'ul. "Knyaz Boris I" 2, 1320 Bankya, Bulgaria',
        42.70779040,
        23.14414490,
        NULL,
        NULL,
        NULL,
        '{point_of_interest,restaurant,establishment,food}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:16.634Z',
        '2025-08-05T17:34:16.634Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '28921d82-b5d5-4274-a256-ba04e463d8b3',
        'ChIJWT2mkJ2FqkAReKo0evny0ls',
        'Pura Vita Belgian bakery',
        'Doctor''s Garden, bul. "Tsar Osvoboditel" 27, 1000 Sofia, Bulgaria',
        42.69156890,
        23.33672210,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:34.713Z',
        '2025-08-05T17:34:34.713Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '295333ae-7f42-4153-a8fc-cd8d71c1f894',
        'ChIJT1i6S9aHqkARZiqbrhW-xjc',
        'Shun Feng Chinese Restaurant',
        'ж.к. Младост 1АMladost, ul. "Krastyu Rakovski" 4, 1729 Sofia, Bulgaria',
        42.65253080,
        23.38173210,
        '089 791 7016',
        NULL,
        NULL,
        '{meal_delivery,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 9:00 PM","Tuesday: 11:00 AM – 9:00 PM","Wednesday: 11:00 AM – 9:00 PM","Thursday: 11:00 AM – 9:00 PM","Friday: 11:00 AM – 9:00 PM","Saturday: 11:00 AM – 9:00 PM","Sunday: 12:00 – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:32.159Z',
        '2025-08-05T17:34:32.159Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '297901ec-71a7-43e6-99ad-95ebd711c99b',
        'ChIJDW70cA2FqkARqW93eUh5R7U',
        'Patisserie Gery',
        'g.k. Lozenets, ul. "Krichim" 69, 1164 Sofia, Bulgaria',
        42.67010940,
        23.33148730,
        '089 956 3621',
        'https://www.facebook.com/PatisserieGery',
        NULL,
        '{establishment,point_of_interest,store,bakery,food}',
        '{"periods":[{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"1830"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1830"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1830"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1830"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1830"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1430"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 6:30 PM","Tuesday: 9:00 AM – 6:30 PM","Wednesday: 9:00 AM – 6:30 PM","Thursday: 9:00 AM – 6:30 PM","Friday: 9:00 AM – 6:30 PM","Saturday: 9:00 AM – 2:30 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:36.887Z',
        '2025-08-05T17:34:36.887Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '29b1d4b7-ed76-4904-b9cc-86b988e7b299',
        'ChIJnzsbeGOFqkARcz9XAiOfmJo',
        'Fryday',
        'Old City Center, ulitsa „Georgi S. Rakovski“ 116, 1000 Sofia, Bulgaria',
        42.69171920,
        23.32522160,
        '087 711 7047',
        NULL,
        NULL,
        '{point_of_interest,restaurant,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0600"}},{"open":{"day":6,"time":"1200"},"close":{"day":0,"time":"0600"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 PM – 6:00 AM","Saturday: 12:00 PM – 6:00 AM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:38.652Z',
        '2025-08-05T17:34:38.652Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2b44ae9c-ea40-4059-a32d-689024ba424f',
        'ChIJL1F2kSeFqkARuW-lHhWdAa0',
        'Александър и Виктория ЕООД',
        'Old City Center, ul. "Bratya Miladinovi" 29, 1000 Sofia, Bulgaria',
        42.70044630,
        23.31758970,
        '087 636 5522',
        NULL,
        NULL,
        '{establishment,food,point_of_interest,meal_delivery}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"1700"}},{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0700"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0700"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0700"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0700"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0700"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 8:00 PM","Tuesday: 7:00 AM – 8:00 PM","Wednesday: 7:00 AM – 8:00 PM","Thursday: 7:00 AM – 8:00 PM","Friday: 7:00 AM – 8:00 PM","Saturday: 7:00 AM – 8:00 PM","Sunday: 8:00 AM – 5:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:30.328Z',
        '2025-08-05T17:34:30.328Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2b6ee3e8-43a1-4541-85d3-043aa16ab007',
        'ChIJh0SzxW-FqkARuHhT1r_57v4',
        'Chicago',
        'Old City Center, Knyaz Alexander Dondukov Blvd Blvd 9, 1000 Sofia, Bulgaria',
        42.69809760,
        23.32707330,
        '089 444 0540',
        'http://pianobarchicago.com/',
        NULL,
        '{point_of_interest,bar,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:26.057Z',
        '2025-08-05T17:34:26.057Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2be02862-6073-4a04-9fd4-238a78b6ef1a',
        'ChIJ33pfhxOFqkARd0jEQ3_HIXg',
        'Kohinoor I',
        'ж.к. Белите брези, bul. "Gotse Delchev" №67, 1680 Sofia, Bulgaria',
        42.67415520,
        23.29165980,
        '088 253 2541',
        'http://www.kohinoor.bg/',
        NULL,
        '{food,restaurant,establishment,meal_takeaway,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1700"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:30 PM","Tuesday: 12:00 – 10:30 PM","Wednesday: 12:00 – 10:30 PM","Thursday: 12:00 – 10:30 PM","Friday: 12:00 – 10:30 PM","Saturday: 5:00 – 10:30 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:18.537Z',
        '2025-08-05T17:34:18.537Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2cd5690b-4796-4ee5-8e5c-ce2881017830',
        'ChIJ037m9JGFqkARKgAeM9FmglA',
        'DK Beborani',
        'Stefan Karadzha, ul. "Lyaskovets" 46, 1510 Sofia, Bulgaria',
        42.70820360,
        23.36280230,
        '088 510 0629',
        'https://dkbeborani.bg/',
        NULL,
        '{food,point_of_interest,store,meal_delivery,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"1400"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"1500"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"1500"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"1500"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"1500"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"1500"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"1400"}}],"open_now":false,"weekday_text":["Monday: 10:00 AM – 3:00 PM","Tuesday: 10:00 AM – 3:00 PM","Wednesday: 10:00 AM – 3:00 PM","Thursday: 10:00 AM – 3:00 PM","Friday: 10:00 AM – 3:00 PM","Saturday: 10:00 AM – 2:00 PM","Sunday: 10:00 AM – 2:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:30.263Z',
        '2025-08-05T17:34:30.263Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2ce69e72-a765-48fa-834e-248e7a98bba3',
        'ChIJYxm-ss6FqkAR8OGwPZJJtf8',
        'India House Restaurant',
        'Old City Center, ul. "Han Asparuh" 3, 1463 Sofia, Bulgaria',
        42.69033180,
        23.31468130,
        '088 952 4302',
        'https://www.indiahouse.bg/',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.372Z',
        '2025-08-05T17:34:35.372Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2e5e04c2-9f8a-4002-93fa-217fea5a4948',
        'ChIJ_cRwe2yFqkARyMEmfC8GTwY',
        'Cosmos Restaurant / Космос',
        'Old City Center, ul. "Laveleye" 19, 1000 Sofia, Bulgaria',
        42.69474140,
        23.31900200,
        '088 820 0700',
        'https://cosmosbg.com/bg/',
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"1600"}},{"open":{"day":0,"time":"1800"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"1530"}},{"open":{"day":1,"time":"1730"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"1530"}},{"open":{"day":2,"time":"1730"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"1530"}},{"open":{"day":3,"time":"1730"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"1530"}},{"open":{"day":4,"time":"1730"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"1530"}},{"open":{"day":5,"time":"1730"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"1600"}},{"open":{"day":6,"time":"1800"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 3:30 PM, 5:30 – 10:30 PM","Tuesday: 12:00 – 3:30 PM, 5:30 – 10:30 PM","Wednesday: 12:00 – 3:30 PM, 5:30 – 10:30 PM","Thursday: 12:00 – 3:30 PM, 5:30 – 10:30 PM","Friday: 12:00 – 3:30 PM, 5:30 – 10:30 PM","Saturday: 11:00 AM – 4:00 PM, 6:00 – 10:30 PM","Sunday: 11:00 AM – 4:00 PM, 6:00 – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:21.742Z',
        '2025-08-05T17:34:21.742Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2e6929e4-cdb7-4cf7-8aed-3347841e4edd',
        'ChIJVbPQjGiFqkARIBigUrwkrXo',
        'hotel GENEVA',
        '1612, ж.к. Лагера, ul. "Balkandzhi Yovo" 9, 1612 Sofia, Bulgaria',
        42.68197310,
        23.28899340,
        '02 955 3435',
        'http://www.hotel-geneva.com/',
        NULL,
        '{point_of_interest,lodging,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        3.20,
        false,
        '2025-08-05T17:34:16.438Z',
        '2025-08-05T17:34:16.438Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '2fd016dc-d8d7-4120-8d97-a164ec853320',
        'ChIJ_9LrmzSFqkARNMrU6cVuJLg',
        'Domino''s Pizza - София - Красна поляна',
        'ж.к. Красна поляна 3, ul. "Pchinya" 31, 1000 Sofia, Bulgaria',
        42.69528430,
        23.28575930,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:23.632Z',
        '2025-08-05T17:34:23.632Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '30adf026-97e3-4f48-ba4c-ed98511738a5',
        'ChIJPw1TOmqFqkARdQwNOl-m3jE',
        'Mehana Mamin Kolyo',
        'Old City Center, ul. "Pozitano" 40, 1000 Sofia, Bulgaria',
        42.69678000,
        23.31561000,
        '02 471 6577',
        'http://maminkolio.com/',
        NULL,
        '{point_of_interest,food,restaurant,bar,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1000"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1000"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1000"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1000"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1000"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 12:00 AM","Tuesday: 10:00 AM – 12:00 AM","Wednesday: 10:00 AM – 12:00 AM","Thursday: 10:00 AM – 12:00 AM","Friday: 10:00 AM – 12:00 AM","Saturday: 10:00 AM – 12:00 AM","Sunday: 10:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:39.110Z',
        '2025-08-05T17:34:39.110Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '32cf162c-6e4b-4051-9908-32a260f39bdd',
        'ChIJBUCzBQiFqkARNxOlAUswhXI',
        'Sasaguri Иван Вазов Сасагури',
        'ж.к. Иван Вазов, ul. "Doctor Stefan Sarafov" 15, 1408 Sofia, Bulgaria',
        42.67973900,
        23.31048070,
        '088 333 8030',
        'https://sasaguri.net/',
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:33.208Z',
        '2025-08-05T17:34:33.208Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '33d617e0-30cd-4b4c-af26-c9fb6d5bf87a',
        'ChIJ323crnOFqkARbxd_79IiZm0',
        'Tell Me',
        'Bulgaria, Old City Center, ul. "Ivan Vazov" 12, 1000 Sofia, Bulgaria',
        42.69273930,
        23.32789100,
        '088 832 1106',
        NULL,
        NULL,
        '{point_of_interest,establishment,bar,night_club}',
        '{"periods":[{"open":{"day":0,"time":"1700"},"close":{"day":1,"time":"0000"}},{"open":{"day":3,"time":"2100"},"close":{"day":4,"time":"0400"}},{"open":{"day":4,"time":"2100"},"close":{"day":5,"time":"0400"}},{"open":{"day":5,"time":"2100"},"close":{"day":6,"time":"0600"}},{"open":{"day":6,"time":"2100"},"close":{"day":0,"time":"0600"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: 9:00 PM – 4:00 AM","Thursday: 9:00 PM – 4:00 AM","Friday: 9:00 PM – 6:00 AM","Saturday: 9:00 PM – 6:00 AM","Sunday: 5:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.40,
        false,
        '2025-08-05T17:34:26.779Z',
        '2025-08-05T17:34:26.779Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '33dcc578-adfa-495a-80ef-9a329687c20e',
        'ChIJueXLDwuFqkARax1oiRpbuPo',
        'Бързо, Вкусно, Лесно - Бърза закуска ОРО',
        'Sofia Center, ul. "Graf Ignatiev" 43, 1142 Sofia, Bulgaria',
        42.68805590,
        23.32930300,
        NULL,
        'http://www.qte-bg.com/',
        NULL,
        '{establishment,food,bakery,store,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"0715"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0715"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0715"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0715"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0715"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 7:15 AM – 8:00 PM","Tuesday: 7:15 AM – 8:00 PM","Wednesday: 7:15 AM – 8:00 PM","Thursday: 7:15 AM – 8:00 PM","Friday: 7:15 AM – 8:00 PM","Saturday: 8:00 AM – 8:00 PM","Sunday: 8:00 AM – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:37.017Z',
        '2025-08-05T17:34:37.017Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '33e42e88-52f7-4c6d-bcc0-654b267bffbb',
        'ChIJpS0ScXKFqkARfiTRWjNni3c',
        'At The Eagles',
        'Old City Center, ul. "Dyakon Ignatiy" 11, 1000 Sofia, Bulgaria',
        42.69376370,
        23.32538840,
        '02 981 5000',
        'http://priorlite.com/',
        NULL,
        '{restaurant,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1200"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1200"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1200"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1200"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1200"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 12:00 PM – 12:00 AM","Tuesday: 12:00 PM – 12:00 AM","Wednesday: 12:00 PM – 12:00 AM","Thursday: 12:00 PM – 12:00 AM","Friday: 12:00 PM – 12:00 AM","Saturday: 12:00 PM – 12:00 AM","Sunday: 12:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:20.565Z',
        '2025-08-05T17:34:20.565Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '34411748-570e-488b-9b35-d7205468b619',
        'ChIJaRKwJVmFqkAR1ctVudIb-6Q',
        'Burger Smash Bar & Dinner',
        'Old City Center, ul. "Hristo Belchev" 17, 1000 Sofia, Bulgaria',
        42.69305780,
        23.32152350,
        '088 339 5544',
        NULL,
        NULL,
        '{point_of_interest,bar,establishment,cafe,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:30 PM","Tuesday: 12:00 – 11:30 PM","Wednesday: 12:00 – 11:30 PM","Thursday: 12:00 – 11:30 PM","Friday: 12:00 – 11:30 PM","Saturday: 12:00 – 11:30 PM","Sunday: 12:00 – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        3.40,
        false,
        '2025-08-05T17:34:16.242Z',
        '2025-08-05T17:34:16.242Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3452cf00-9a4c-4f7e-a4f8-ca31d36095cc',
        'ChIJd2aLHnOZqkARaZsWi7jcFPE',
        'Палачинки',
        'ul. "Knyaz Boris I" 1, 1320 Bankya, Bulgaria',
        42.70756420,
        23.14456570,
        NULL,
        NULL,
        NULL,
        '{restaurant,establishment,point_of_interest,food}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.40,
        false,
        '2025-08-05T17:34:16.176Z',
        '2025-08-05T17:34:16.176Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '34aee012-ed2a-4b86-b38a-f097c3b262d1',
        'ChIJ2f9-REGFqkARFI7-_ciVxic',
        'Skapto Burgers',
        'Zona B-5, "Aleksandar Stamboliyski" Blvd blvd 101, 1000 Sofia, Bulgaria',
        42.69844400,
        23.30904010,
        '0700 11 313',
        'https://skapto.bg/',
        NULL,
        '{restaurant,food,store,establishment,point_of_interest,liquor_store,meal_takeaway}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:23.894Z',
        '2025-08-05T17:34:23.894Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '34ddbbef-216f-474b-ae1d-a9b38272a82d',
        'ChIJRdbufE6BqkAR3ht5ziwmLjs',
        'Edo Sushi Sofia Ring Mall',
        'Ring Mall,, в.з. Симеоново - северВитоша, Софийски околовръстен път 214, 1434 София, Bulgaria',
        42.62378810,
        23.35236880,
        '088 666 1614',
        'http://edosushi.bg/',
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.40,
        false,
        '2025-08-05T17:34:33.143Z',
        '2025-08-05T17:34:33.143Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '34ef2711-8191-4778-9fe3-75682e732a93',
        'ChIJ--e5JuGZqkARl5NrF9G0HqE',
        'Сръбска скара',
        'Банкя, ul. "Knyaz Boris I" 6, 1320 Bankya, Bulgaria',
        42.70749330,
        23.14492440,
        NULL,
        NULL,
        NULL,
        '{point_of_interest,restaurant,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:39.438Z',
        '2025-08-05T17:34:39.438Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '350aa88e-1a05-4d3d-a83c-ff8bab913455',
        'ChIJdc9xrXKFqkARpJbPCQy19_I',
        'La bottega all''Angolo',
        'Old City Center, ul. "William Gladstone" 58, 1000 Sofia, Bulgaria',
        42.69124190,
        23.32311090,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:23.501Z',
        '2025-08-05T17:34:23.501Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3524b3ea-8beb-46cd-afa8-7df8ebdb730a',
        'ChIJS1sajyeFqkARachZ2pNN7jo',
        'Hasienda Restaurant',
        'ж.к. Лагера, bul. "Tsar Boris III" 94, 1612 Sofia, Bulgaria',
        42.68057780,
        23.28733030,
        '088 627 6973',
        'http://hasienda.eu/',
        NULL,
        '{food,point_of_interest,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:40.028Z',
        '2025-08-05T17:34:40.028Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3683f3bb-655b-47d5-9f3c-7a781ede1b79',
        'ChIJYeTYLhOFqkARYfpTBWdEEjQ',
        'Unica Restaurant',
        'Sofia Center, bul. "Tsar Osvoboditel" 8A, 1000 Sofia, Bulgaria',
        42.69522870,
        23.32882980,
        '087 688 8080',
        'https://unica.bg/',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.60,
        false,
        '2025-08-05T17:34:32.946Z',
        '2025-08-05T17:34:32.946Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '36f7bb89-6384-4caa-a586-6f404d6b6d2a',
        'ChIJo4MoP5eFqkARfFcv6C3yYU0',
        'Gentoo Specialty Coffee',
        'Old City Center, ul. "Neofit Rilski" 34, 1000 Sofia, Bulgaria',
        42.69026020,
        23.31879040,
        '088 686 6144',
        'https://linktr.ee/gentoocoffee',
        NULL,
        '{point_of_interest,food,store,cafe,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 6:00 PM","Tuesday: 8:00 AM – 6:00 PM","Wednesday: 8:00 AM – 6:00 PM","Thursday: 8:00 AM – 6:00 PM","Friday: 8:00 AM – 6:00 PM","Saturday: 8:00 AM – 6:00 PM","Sunday: 8:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.10,
        false,
        '2025-08-05T17:34:34.058Z',
        '2025-08-05T17:34:34.058Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3759555d-c361-4a04-9a94-ab869190245b',
        'ChIJ8e8lI_6FqkARjhGBrlRBvrU',
        'The Butcher - meat & burger',
        'Sofia Center, William Gladstone St 36, 1000 Sofia, Bulgaria',
        42.69150070,
        23.31953400,
        '087 758 5668',
        'http://www.facebook.com/the.butcher.burgers',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1300"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1300"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 1:00 PM – 12:00 AM","Sunday: 1:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:18.995Z',
        '2025-08-05T17:34:18.995Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '37fb7164-037b-4868-942c-5cdb51a48c5b',
        'ChIJByoGdK2FqkARf31pbY_JemI',
        'Pain De Paris',
        'g.k. Lozenets, ul. "Zlatovrah" 34, 1164 Sofia, Bulgaria',
        42.67241300,
        23.33308500,
        '02 862 4609',
        NULL,
        NULL,
        '{store,bakery,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1600"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1600"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1600"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1600"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1600"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 4:00 PM","Tuesday: 8:00 AM – 4:00 PM","Wednesday: 8:00 AM – 4:00 PM","Thursday: 8:00 AM – 4:00 PM","Friday: 8:00 AM – 4:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        3.10,
        false,
        '2025-08-05T17:34:28.554Z',
        '2025-08-05T17:34:28.554Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '38021d9c-7bd3-4d03-b762-7b8e1ea9e27e',
        'ChIJAQ-CthOFqkARbpm-BU7Yr3c',
        'Markrit Ltd',
        'Old City Center, bul. "Patriarh Evtimiy" 61, 1463 Sofia, Bulgaria',
        42.68902180,
        23.31667600,
        '088 669 5919',
        'https://markrit.com/',
        NULL,
        '{establishment,store,bakery,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0930"},"close":{"day":0,"time":"1730"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1930"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1930"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1930"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1930"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1930"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1930"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:30 PM","Tuesday: 8:00 AM – 7:30 PM","Wednesday: 8:00 AM – 7:30 PM","Thursday: 8:00 AM – 7:30 PM","Friday: 8:00 AM – 7:30 PM","Saturday: 8:00 AM – 7:30 PM","Sunday: 9:30 AM – 5:30 PM"]}',
        '{}',
        NULL,
        NULL,
        0.90,
        false,
        '2025-08-05T17:34:36.951Z',
        '2025-08-05T17:34:36.951Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '386f1b77-f7a9-4377-ad04-33e4bd789b59',
        'ChIJ8SoJvMCFqkAReCSUKG9ZURA',
        'Domino''s Pizza - София - Гео Милев',
        'Geo Milev, ul. "Alexander Zhendov" 6, 1113 Sofia, Bulgaria',
        42.68017760,
        23.35696150,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:24.157Z',
        '2025-08-05T17:34:24.157Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '38ac30be-0a09-4301-a94f-147b6ab1a886',
        'ChIJDYda852GqkAR4P0ayOUe9aI',
        'Garden restaurant Yoli',
        'g.k. Darvenitsa, ul. "Ivan Borimechkata" 22, 1756 Sofia, Bulgaria',
        42.65340840,
        23.36233530,
        '088 558 5801',
        'http://restorantyoli.com/',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1130"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1130"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1130"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1130"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1130"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1130"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 12:00 AM","Tuesday: 11:30 AM – 12:00 AM","Wednesday: 11:30 AM – 12:00 AM","Thursday: 11:30 AM – 12:00 AM","Friday: 11:30 AM – 12:00 AM","Saturday: 11:30 AM – 12:00 AM","Sunday: 11:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:19.651Z',
        '2025-08-05T17:34:19.651Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '39552e5b-7c0d-4c01-8640-2578aec830da',
        'ChIJpRaLl66aqkAR1M2VvL2S54s',
        'Azalia',
        'ж.к. Илинден, ul. "Haydut Sider" 8, 1309 Sofia, Bulgaria',
        42.71184920,
        23.28774440,
        '02 929 4233',
        'http://azaliabg.com/',
        NULL,
        '{establishment,store,point_of_interest,food,bakery}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":1,"time":"0530"}},{"open":{"day":1,"time":"0800"},"close":{"day":2,"time":"0530"}},{"open":{"day":2,"time":"0800"},"close":{"day":3,"time":"0530"}},{"open":{"day":3,"time":"0800"},"close":{"day":4,"time":"0530"}},{"open":{"day":4,"time":"0800"},"close":{"day":5,"time":"0530"}},{"open":{"day":5,"time":"0800"},"close":{"day":6,"time":"0530"}},{"open":{"day":6,"time":"0800"},"close":{"day":0,"time":"0530"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 5:30 AM","Tuesday: 8:00 AM – 5:30 AM","Wednesday: 8:00 AM – 5:30 AM","Thursday: 8:00 AM – 5:30 AM","Friday: 8:00 AM – 5:30 AM","Saturday: 8:00 AM – 5:30 AM","Sunday: 8:00 AM – 5:30 AM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:26.715Z',
        '2025-08-05T17:34:26.715Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '396d6e6b-c5e9-4419-80f1-280aecd904b8',
        'ChIJb3ZrkP-EqkARMiuAMMAnyxg',
        'Umami',
        'g.k. Lozenets, Blvd "James Bourchier" бул. "Джеймс Баучер, 1407 Sofia, Bulgaria',
        42.67205030,
        23.31769240,
        '088 480 4040',
        'http://umami.bg/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1200"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1200"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1200"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1200"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1200"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 12:00 PM – 12:00 AM","Tuesday: 12:00 PM – 12:00 AM","Wednesday: 12:00 PM – 12:00 AM","Thursday: 12:00 PM – 12:00 AM","Friday: 12:00 PM – 12:00 AM","Saturday: 12:00 PM – 12:00 AM","Sunday: 12:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.40,
        false,
        '2025-08-05T17:34:39.766Z',
        '2025-08-05T17:34:39.766Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3987cf22-9a2a-4bd4-99c8-8910595bf18b',
        'ChIJP2q1QsaFqkARebigGrQdYA0',
        'Annapurna Nepali & Indian Restaurant, Sofia',
        'минава се през безистена в дворчето, Old City Center, ulitsa „Georgi S. Rakovski“ 181 б, 1142 Sofia, Bulgaria',
        42.68728330,
        23.32337560,
        '02 443 9100',
        'http://annapurnabg.com/',
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.306Z',
        '2025-08-05T17:34:35.306Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3a1c627a-0384-4970-a9ec-3c4df7d6428d',
        'ChIJRWXGlmyFqkAR7E1lhoPyEZk',
        'J.J. Murphy''s',
        'Old City Center, ul. "Karnigradska" 6, 1000 Sofia, Bulgaria',
        42.69350280,
        23.31850930,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:14.541Z',
        '2025-08-05T17:34:14.541Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3a6be6c8-a58f-4b1d-b3d9-d49936eccc07',
        'ChIJYRV2bJ6FqkARJUc4EmPRIus',
        'Naklona Bar',
        'Doctor''s Garden, ul. "Tulovo" 5, 1504 Sofia, Bulgaria',
        42.69163540,
        23.33908100,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:24.746Z',
        '2025-08-05T17:34:24.746Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3abddbdb-a1f2-41cd-9f7a-82f40c941aca',
        'ChIJvbTpe2yFqkARAjPRTu_xDy4',
        'Vinokap',
        'Old City Center, ul. "Laveleye" 19, ет. 5, 1000 Sofia, Bulgaria',
        42.69463320,
        23.31902580,
        '02 980 8967',
        'http://www.vinocap.com/bg/home.html',
        NULL,
        '{food,establishment,restaurant,point_of_interest,store}',
        '{"periods":[{"open":{"day":1,"time":"0930"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0930"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0930"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0930"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0930"},"close":{"day":5,"time":"1800"}}],"open_now":false,"weekday_text":["Monday: 9:30 AM – 6:00 PM","Tuesday: 9:30 AM – 6:00 PM","Wednesday: 9:30 AM – 6:00 PM","Thursday: 9:30 AM – 6:00 PM","Friday: 9:30 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:19.847Z',
        '2025-08-05T17:34:19.847Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3b22f5ce-1900-4089-bf6e-db27358d218d',
        'ChIJa9i3AQuFqkARRxGcAa7Gqsw',
        'Palla Burger',
        'Old City Center, ul. "Graf Ignatiev" 47А, 1142 Sofia, Bulgaria',
        42.68757410,
        23.32974720,
        '087 757 0493',
        NULL,
        NULL,
        '{point_of_interest,establishment,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 10:00 PM","Tuesday: 9:00 AM – 10:00 PM","Wednesday: 9:00 AM – 10:00 PM","Thursday: 9:00 AM – 10:00 PM","Friday: 9:00 AM – 10:00 PM","Saturday: 9:00 AM – 10:00 PM","Sunday: 9:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.40,
        false,
        '2025-08-05T17:34:38.588Z',
        '2025-08-05T17:34:38.588Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3b5860ae-6f48-4fa8-9edb-8deb9ed4c65c',
        'ChIJe6knZW6FqkAR44msswXmYfY',
        'Art Club Museum',
        'Old City Center, ul. "Saborna" 2, 1000 Sofia, Bulgaria',
        42.69619290,
        23.32427700,
        '089 356 4877',
        NULL,
        NULL,
        '{point_of_interest,bar,cafe,establishment,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":1,"time":"0100"}},{"open":{"day":1,"time":"0800"},"close":{"day":2,"time":"0100"}},{"open":{"day":2,"time":"0800"},"close":{"day":3,"time":"0100"}},{"open":{"day":3,"time":"0800"},"close":{"day":4,"time":"0100"}},{"open":{"day":4,"time":"0800"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 1:00 AM","Tuesday: 8:00 AM – 1:00 AM","Wednesday: 8:00 AM – 1:00 AM","Thursday: 8:00 AM – 12:00 AM","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: 8:00 AM – 1:00 AM"]}',
        '{}',
        NULL,
        NULL,
        4.20,
        false,
        '2025-08-05T17:34:39.175Z',
        '2025-08-05T17:34:39.175Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3e384edc-e0aa-492b-8ef5-16500898676c',
        'ChIJ342lfQmZqkARDx8-BWWlWpg',
        'Hemingway Restaurant',
        'ul. "Aleksandar Stamboliyski" 3, 1320 Bankya, Bulgaria',
        42.70784900,
        23.14445870,
        '089 489 1010',
        NULL,
        NULL,
        '{point_of_interest,restaurant,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 9:00 PM","Tuesday: 8:00 AM – 9:00 PM","Wednesday: 8:00 AM – 9:00 PM","Thursday: 8:00 AM – 9:00 PM","Friday: 8:00 AM – 9:00 PM","Saturday: 8:00 AM – 9:00 PM","Sunday: 8:00 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:39.307Z',
        '2025-08-05T17:34:39.307Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3ea832d2-7db4-4cf9-bcb1-fdd36b697421',
        'ChIJc8B84myFqkARKWX9Zm9MWzc',
        'Shtastlivetsa Restaurant - Vitoshka',
        'Sofia Center, bul. "Vitosha" 27, 1000 Sofia, Bulgaria',
        42.69327220,
        23.32046330,
        '02 441 1155',
        'http://www.shtastliveca.com/',
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1100"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1100"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1100"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1100"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1100"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 12:00 AM","Tuesday: 11:00 AM – 12:00 AM","Wednesday: 11:00 AM – 12:00 AM","Thursday: 11:00 AM – 12:00 AM","Friday: 11:00 AM – 12:00 AM","Saturday: 11:00 AM – 12:00 AM","Sunday: 11:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:31.832Z',
        '2025-08-05T17:34:31.832Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3f20ce03-46c6-49c7-b8c4-62aba08175c3',
        'ChIJO5M4hnGFqkARSuKdf-6AFeI',
        'Mr Hruples',
        'Old City Center, ul. "Georgi Benkovski" 6, 1000 Sofia, Bulgaria',
        42.69486380,
        23.32832380,
        '088 840 9609',
        NULL,
        NULL,
        '{establishment,point_of_interest,bakery,food,store}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 8:00 PM","Tuesday: 8:00 AM – 8:00 PM","Wednesday: 8:00 AM – 8:00 PM","Thursday: 8:00 AM – 8:00 PM","Friday: 8:00 AM – 8:00 PM","Saturday: 9:00 AM – 8:00 PM","Sunday: 9:00 AM – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:36.821Z',
        '2025-08-05T17:34:36.821Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3f2a23fd-1e8a-4435-8862-6b282868386c',
        'ChIJgR4ZeD6FqkARZS7_Av5t9yE',
        'Джи-Деливъри ООД',
        'g.k. Banishora, ul. "Ivan Turgenev" 2, 1233 Sofia, Bulgaria',
        42.71141160,
        23.31202480,
        '089 781 5999',
        'https://www.facebook.com/profile.php?id=100083139258659',
        NULL,
        '{accounting,finance,point_of_interest,meal_delivery,establishment,food}',
        '{"periods":[{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"1700"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1700"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1700"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1700"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 5:00 PM","Tuesday: 9:00 AM – 5:00 PM","Wednesday: 9:00 AM – 5:00 PM","Thursday: 9:00 AM – 5:00 PM","Friday: 9:00 AM – 5:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:30.918Z',
        '2025-08-05T17:34:30.918Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3f33886b-733c-48db-ab2d-c728bdc99216',
        'ChIJ3-0HumWFqkARSp2qmpuNCg0',
        'Restorant Draga',
        'Sofia Center, ul. "Bacho Kiro" 38, 1202 Sofia, Bulgaria',
        42.70155240,
        23.32648230,
        '02 983 1307',
        NULL,
        NULL,
        '{food,establishment,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 11:00 PM","Tuesday: 10:00 AM – 11:00 PM","Wednesday: 10:30 AM – 11:00 PM","Thursday: 10:30 AM – 11:00 PM","Friday: 10:30 AM – 11:00 PM","Saturday: 10:30 AM – 11:00 PM","Sunday: 10:30 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:15.457Z',
        '2025-08-05T17:34:15.457Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '3fcdd8c9-f4c5-4b6d-8073-9dae79b01d26',
        'ChIJF8FV5YOaqkARld7sHNNBhfk',
        'KFC Liulin 8',
        'zh.k. Lyulin 8, bul. "Tsaritsa Yoanna" 72, 1324 Sofia, Bulgaria',
        42.72014590,
        23.25624510,
        '087 703 4750',
        'http://kfc.bg/',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0930"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"0930"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0930"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0930"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0930"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0930"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"0930"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 9:30 AM – 10:00 PM","Tuesday: 9:30 AM – 10:00 PM","Wednesday: 9:30 AM – 10:00 PM","Thursday: 9:30 AM – 10:00 PM","Friday: 9:30 AM – 10:30 PM","Saturday: 9:30 AM – 10:30 PM","Sunday: 9:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:18.602Z',
        '2025-08-05T17:34:18.602Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4179bab5-26b5-48e7-8ec0-b9a0c1d44c3f',
        'ChIJZwtfTG2FqkARQPxgPjc-bgE',
        '5 Vintage',
        'Old City Center, ul. "William Gladstone" 49, 1000 Sofia, Bulgaria',
        42.69144640,
        23.32150390,
        '088 896 1606',
        'http://www.5vintage.bg/',
        NULL,
        '{establishment,point_of_interest,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:15.130Z',
        '2025-08-05T17:34:15.130Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4182007a-7073-4962-90a2-535c6d2b6e7a',
        'ChIJr6XxnrybqkARIixhzpeTXlY',
        'Sushi Mushi / Суши Муши',
        'Sveta Troitsa, ul. "Georche Petrov" 73, 1309 Sofia, Bulgaria',
        42.71087890,
        23.29096510,
        '088 889 0135',
        'https://www.sushi-mushi.bg/?utm_source=google&utm_medium=wix_google_business_profile&utm_campaign=954402080902797788',
        NULL,
        '{point_of_interest,restaurant,establishment,food,meal_takeaway,meal_delivery}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:31.178Z',
        '2025-08-05T17:34:31.178Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '420125c1-9a58-4a29-8184-3cdb0ce35d1e',
        'ChIJFYJ50KmFqkARMRGJoqTrt04',
        'Best Western Hotel Lozenets',
        'g.k. Lozenets, bul. "Sveti Naum" 23, 1421 Sofia, Bulgaria',
        42.67832370,
        23.32617840,
        '02 965 4444',
        'https://www.lozenetzhotel.com/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:22.850Z',
        '2025-08-05T17:34:22.850Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '426b2303-78d8-427c-aa36-e000e6cc13b1',
        'ChIJh--2gnSFqkARJG1eZeMKOjo',
        'Skapto Burgers, Beers and Fries Shishman',
        'Old City Center, ul. "Tsar Shishman" 20, 1000 Sofia, Bulgaria',
        42.69150350,
        23.32979210,
        '0700 11 313',
        'https://skapto.bg/',
        NULL,
        '{store,liquor_store,establishment,point_of_interest,restaurant,meal_takeaway,food}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:00 PM","Tuesday: 11:30 AM – 10:00 PM","Wednesday: 11:30 AM – 10:00 PM","Thursday: 11:30 AM – 11:30 PM","Friday: 11:30 AM – 11:30 PM","Saturday: 11:30 AM – 11:30 PM","Sunday: 11:30 AM – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:23.762Z',
        '2025-08-05T17:34:23.762Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '431a3fcd-49b0-4876-993a-5c10caba9d4b',
        'ChIJFbgqvW-FqkARbQ6ah8MzHIk',
        'Punto Rosso',
        'Sofia Center, ul. "Veslets" 6, 1000 Sofia, Bulgaria',
        42.69852320,
        23.32606130,
        '087 735 5054',
        'https://www.facebook.com/Punto-Rosso-620012751530162/',
        NULL,
        '{restaurant,meal_takeaway,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0700"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0700"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0700"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0700"},"close":{"day":5,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 7:00 PM","Tuesday: 7:00 AM – 7:00 PM","Wednesday: 7:00 AM – 7:00 PM","Thursday: 7:00 AM – 7:00 PM","Friday: 7:00 AM – 7:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:36.421Z',
        '2025-08-05T17:34:36.421Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '44f4a02d-9e7c-4239-8bc2-faec364331e4',
        'ChIJAU1_ToyHqkARWZgJLY5q37Q',
        'Domino''s Pizza - София - Център',
        'Old City Center, "Aleksandar Stamboliyski" Blvd 41, 1532 Sofia, Bulgaria',
        42.69722400,
        23.31707600,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:21.676Z',
        '2025-08-05T17:34:21.676Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '47052625-f327-489f-8dd9-7857ee6adcad',
        'ChIJW0LtU8yFqkARnZZn1vtRU8I',
        'The French Box Bakery & Coffee',
        'Old City Center, ul. Budapeshta, 1000 Sofia, Bulgaria',
        42.70040320,
        23.32769640,
        '088 820 1281',
        'https://thefrenchbox.bg/',
        NULL,
        '{point_of_interest,bakery,store,establishment,food,cafe}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"0730"},"close":{"day":1,"time":"1930"}},{"open":{"day":2,"time":"0730"},"close":{"day":2,"time":"1930"}},{"open":{"day":3,"time":"0730"},"close":{"day":3,"time":"1930"}},{"open":{"day":4,"time":"0730"},"close":{"day":4,"time":"1930"}},{"open":{"day":5,"time":"0730"},"close":{"day":5,"time":"1930"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 7:30 AM – 7:30 PM","Tuesday: 7:30 AM – 7:30 PM","Wednesday: 7:30 AM – 7:30 PM","Thursday: 7:30 AM – 7:30 PM","Friday: 7:30 AM – 7:30 PM","Saturday: 8:00 AM – 6:00 PM","Sunday: 8:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:36.625Z',
        '2025-08-05T17:34:36.625Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '47393e7c-2c8f-4a94-b9b6-b8a3b339a632',
        'ChIJq_bLnUglqxQR5DVuI3cHs3w',
        'Уиски Бар Caldo Whiskey and Friends',
        'София, ул. Г.С. Раковски 125, Old City Center, 1000 Sofia, Bulgaria',
        42.69399960,
        23.32862630,
        '088 255 8000',
        'http://www.caldo.bg/',
        NULL,
        '{point_of_interest,establishment,night_club,bar}',
        '{"periods":[{"open":{"day":0,"time":"1800"},"close":{"day":1,"time":"0100"}},{"open":{"day":1,"time":"1100"},"close":{"day":2,"time":"0100"}},{"open":{"day":2,"time":"1100"},"close":{"day":3,"time":"0200"}},{"open":{"day":3,"time":"1100"},"close":{"day":4,"time":"0200"}},{"open":{"day":4,"time":"1100"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0300"}},{"open":{"day":6,"time":"1800"},"close":{"day":0,"time":"0300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 1:00 AM","Tuesday: 11:00 AM – 2:00 AM","Wednesday: 11:00 AM – 2:00 AM","Thursday: 11:00 AM – 2:00 AM","Friday: 11:00 AM – 3:00 AM","Saturday: 6:00 PM – 3:00 AM","Sunday: 6:00 PM – 1:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.50,
        false,
        '2025-08-05T17:34:25.533Z',
        '2025-08-05T17:34:25.533Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4776f18a-f241-4303-a224-c40ee19a1cc6',
        'ChIJN_z3rGyBqkAR3AHVt84ZIyA',
        'Hotel Restaurant Chairite',
        '1434, в.з. Симеоново - изтокVitosha, Boulevard "Simeonovsko Shose 269, 1434 Sofia, Bulgaria',
        42.60618700,
        23.34796510,
        '089 919 7949',
        NULL,
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0730"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"0730"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0730"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0730"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0730"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0730"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0730"},"close":{"day":6,"time":"1900"}}],"open_now":false,"weekday_text":["Monday: 7:30 AM – 7:00 PM","Tuesday: 7:30 AM – 7:00 PM","Wednesday: 7:30 AM – 7:00 PM","Thursday: 7:30 AM – 7:00 PM","Friday: 7:30 AM – 7:00 PM","Saturday: 7:30 AM – 7:00 PM","Sunday: 7:30 AM – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:17.352Z',
        '2025-08-05T17:34:17.352Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '47c40593-591f-4437-bcb3-b9a52b26dabc',
        'ChIJ-RJHv2yFqkARv7PZZbCfFaM',
        'Rosslyn Thracia Hotel Sofia',
        '30, Old City Center, Solunska Street Str, 1000 Sofia, Bulgaria',
        42.69311570,
        23.31858440,
        '02 801 7900',
        'https://thracia.rosslyn-hotels.com/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:22.002Z',
        '2025-08-05T17:34:22.002Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '47dbfc9d-7abd-459e-b473-2d1b66d8499f',
        'ChIJkQg0f5OFqkARnpTfOtAkjKY',
        'SATSANGA Vegetarian Restaurant',
        'Sofia Center, ul. "Georgi Benkovski" 8, 1000 Sofia, Bulgaria',
        42.69511920,
        23.32847910,
        '088 598 3933',
        NULL,
        NULL,
        '{establishment,restaurant,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 10:00 PM","Tuesday: 9:00 AM – 10:00 PM","Wednesday: 9:00 AM – 10:00 PM","Thursday: 9:00 AM – 10:00 PM","Friday: 9:00 AM – 10:00 PM","Saturday: 9:00 AM – 10:00 PM","Sunday: 9:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        6.80,
        false,
        '2025-08-05T17:34:20.500Z',
        '2025-08-05T17:34:20.500Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '485a7817-f727-4fed-a279-9945bbd162cd',
        'ChIJ4yR7twuZqkARUqjy5d141wE',
        'Pizza Bankya',
        'ul. "Aleksandar Stamboliyski", 1320 Bankya, Bulgaria',
        42.70721760,
        23.14723200,
        '089 910 4845',
        NULL,
        NULL,
        '{establishment,food,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 11:00 PM","Tuesday: 8:00 AM – 11:00 PM","Wednesday: 8:00 AM – 11:00 PM","Thursday: 8:00 AM – 11:00 PM","Friday: 8:00 AM – 11:00 PM","Saturday: 8:00 AM – 11:00 PM","Sunday: 8:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:16.110Z',
        '2025-08-05T17:34:16.110Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '48dda46a-f1d6-49e0-a3cb-15f863fddd8e',
        'ChIJVVXlAEeFqkAR8MV1TbZ_CKs',
        'Oscar Wilde Apartment',
        'Зона 5-Б, ul. "Odrin" 14, вх. В, ап. 138, 1301 Sofia, Bulgaria',
        42.69755660,
        23.30325670,
        '089 912 8333',
        'https://eli-recommends.com/oscar-wilde-apartment-bulgaria',
        NULL,
        '{lodging,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:29.211Z',
        '2025-08-05T17:34:29.211Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '48de0a41-e7af-4fa6-8579-df87294f9462',
        'ChIJ5yCkGseFqkARwP3F4h-7avU',
        'Vita Rama Vegan Restaurant',
        'Old City Center, ul. "Doctor Peter Beron" 9, 1142 Sofia, Bulgaria',
        42.68529520,
        23.32166450,
        '089 446 5545',
        'http://www.vitarama.bg/',
        NULL,
        '{establishment,food,store,point_of_interest,health,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1500"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 3:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        7.10,
        false,
        '2025-08-05T17:34:20.894Z',
        '2025-08-05T17:34:20.894Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '490fffb5-638c-4d5d-b7b5-88ed730e3e84',
        'ChIJIzO4twmFqkARvaJ6EJTYSi8',
        'HAMACHI-Ni - Japanese Fish Restaurant',
        'Sofia Center, ulitsa „Georgi S. Rakovski“ 179, 1142 Sofia, Bulgaria',
        42.68751850,
        23.32310430,
        '088 426 2244',
        'http://www.hamachi.bg/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:40.420Z',
        '2025-08-05T17:34:40.420Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '49a32aef-faa4-4700-b179-05d8eba208a9',
        'ChIJc8aDm2mFqkARKCfL-FWzV4Y',
        'Level Up - Slaveykov',
        'Old City Center, pl. "Petko R. Slaveykov" 7b, 1000 Sofia, Bulgaria',
        42.69209870,
        23.32489260,
        '087 994 2118',
        'https://www.facebook.com/LevelUpSofia/',
        NULL,
        '{cafe,food,point_of_interest,establishment,liquor_store,bar,store}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.50,
        false,
        '2025-08-05T17:34:25.271Z',
        '2025-08-05T17:34:25.271Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4a3b3f4e-361f-45f1-a621-1ef4dd809cab',
        'ChIJ3X1-BDmEqkARTddS9mDn3hc',
        'Korean Restaurant Korea',
        'жк.витоша 8, Студентски Комплекс, 1700 София, Bulgaria',
        42.65682310,
        23.33960760,
        '089 991 2404',
        NULL,
        NULL,
        '{point_of_interest,establishment,food,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:00 PM","Tuesday: 11:30 AM – 10:00 PM","Wednesday: 11:30 AM – 10:00 PM","Thursday: 11:30 AM – 10:00 PM","Friday: 11:30 AM – 10:00 PM","Saturday: 11:30 AM – 10:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:39.897Z',
        '2025-08-05T17:34:39.897Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4a56b956-6d7e-457a-a02a-e163c854df90',
        'ChIJueyfIXSZqkARV92I_g25czo',
        'Гостилница Каприз',
        '"ulitsa "Stefan Stambolov" 20, 1320 Bankya, Bulgaria',
        42.70823800,
        23.15162390,
        '088 908 5347',
        NULL,
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:15.783Z',
        '2025-08-05T17:34:15.783Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4b96484e-d588-4bb5-9f7c-ddd830c57a91',
        'ChIJsX_ajVaFqkARqVkxNX4hESY',
        'Shahrayar Premium Fast Food',
        'Pette Kyosheta, bul. "Vitosha" 81, 1463 Sofia, Bulgaria',
        42.68460180,
        23.31645570,
        '088 874 9195',
        'https://shahrayarpremium.bg/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":1,"time":"0330"}},{"open":{"day":1,"time":"1030"},"close":{"day":2,"time":"0330"}},{"open":{"day":2,"time":"1030"},"close":{"day":3,"time":"0330"}},{"open":{"day":3,"time":"1030"},"close":{"day":4,"time":"0330"}},{"open":{"day":4,"time":"1030"},"close":{"day":5,"time":"0330"}},{"open":{"day":5,"time":"1030"},"close":{"day":6,"time":"0330"}},{"open":{"day":6,"time":"1030"},"close":{"day":0,"time":"0330"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 3:30 AM","Tuesday: 10:30 AM – 3:30 AM","Wednesday: 10:30 AM – 3:30 AM","Thursday: 10:30 AM – 3:30 AM","Friday: 10:30 AM – 3:30 AM","Saturday: 10:30 AM – 3:30 AM","Sunday: 10:30 AM – 3:30 AM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:33.731Z',
        '2025-08-05T17:34:33.731Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4d0ba6df-5366-4aa0-aeec-697b95a4324b',
        'ChIJq6iRmuqEqkARp55t3gElLMU',
        'Meng Fu Yuan 2',
        'Manastirski Livadi, ul. "Pirin" 89, 1680 Sofia, Bulgaria',
        42.66358030,
        23.28528310,
        '088 797 7767',
        'http://www.mengfuyuan.com/',
        NULL,
        '{point_of_interest,food,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:16.503Z',
        '2025-08-05T17:34:16.503Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4d22b8a3-b440-4811-b36d-df266c15f0a8',
        'ChIJpdowVJCFqkARaWLqLunxJjg',
        'Costa Coffee',
        'Serdika Center, Oborishte, Sitnyakovo Blvd 48, ет. 1, 1505 Sofia, Bulgaria',
        42.69180290,
        23.35348970,
        '088 545 7200',
        'https://www.costacoffee.bg/',
        NULL,
        '{establishment,point_of_interest,store,cafe,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2130"}},{"open":{"day":1,"time":"0830"},"close":{"day":1,"time":"2130"}},{"open":{"day":2,"time":"0830"},"close":{"day":2,"time":"2130"}},{"open":{"day":3,"time":"0830"},"close":{"day":3,"time":"2130"}},{"open":{"day":4,"time":"0830"},"close":{"day":4,"time":"2130"}},{"open":{"day":5,"time":"0830"},"close":{"day":5,"time":"2130"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2130"}}],"open_now":true,"weekday_text":["Monday: 8:30 AM – 9:30 PM","Tuesday: 8:30 AM – 9:30 PM","Wednesday: 8:30 AM – 9:30 PM","Thursday: 8:30 AM – 9:30 PM","Friday: 8:30 AM – 9:30 PM","Saturday: 9:00 AM – 9:30 PM","Sunday: 9:00 AM – 9:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:24.680Z',
        '2025-08-05T17:34:24.680Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4faa9748-6ff6-450c-9f29-cdca837f8ceb',
        'ChIJUbATRcGFqkARYEmy4TA_a2I',
        'Mon Ami',
        'Geo Milev, Boulevard "Shipchenski Prohod" 18, 1113 Sofia, Bulgaria',
        42.67911160,
        23.36047780,
        '088 877 3291',
        'http://facebook.com/bgmonami',
        NULL,
        '{food,cafe,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"1700"}},{"open":{"day":1,"time":"0830"},"close":{"day":1,"time":"1930"}},{"open":{"day":2,"time":"0830"},"close":{"day":2,"time":"1930"}},{"open":{"day":3,"time":"0830"},"close":{"day":3,"time":"1930"}},{"open":{"day":4,"time":"0830"},"close":{"day":4,"time":"1930"}},{"open":{"day":5,"time":"0830"},"close":{"day":5,"time":"1930"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 8:30 AM – 7:30 PM","Tuesday: 8:30 AM – 7:30 PM","Wednesday: 8:30 AM – 7:30 PM","Thursday: 8:30 AM – 7:30 PM","Friday: 8:30 AM – 7:30 PM","Saturday: 10:00 AM – 5:00 PM","Sunday: 10:00 AM – 5:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:29.277Z',
        '2025-08-05T17:34:29.277Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '4fe98d84-1632-4a48-9bac-4db9e70fdb5e',
        'ChIJvQLFFXaFqkARPjb8eGVqBmA',
        'Crystal Palace Boutique',
        'Doctor''s Garden, Shipka Street 14, 1504 Sofia, Bulgaria',
        42.69372520,
        23.33741030,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:13.948Z',
        '2025-08-05T17:34:13.948Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '50613e92-e3f5-4b95-a2fb-56b481f6b5a4',
        'ChIJZ-kWlZ2FqkARkIu4ANOhVwg',
        'Raffy Bar & Gelato',
        'Sofia Center, Shipka Street 9, 1504 Sofia, Bulgaria',
        42.69351150,
        23.34021680,
        '089 784 7154',
        'http://raffy.bg/',
        NULL,
        '{food,establishment,point_of_interest,store,bakery,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0830"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"0830"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"0830"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"0830"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"0830"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"0830"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"0830"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 8:30 AM – 12:00 AM","Tuesday: 8:30 AM – 12:00 AM","Wednesday: 8:30 AM – 12:00 AM","Thursday: 8:30 AM – 12:00 AM","Friday: 8:30 AM – 12:00 AM","Saturday: 8:30 AM – 12:00 AM","Sunday: 8:30 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.70,
        false,
        '2025-08-05T17:34:19.913Z',
        '2025-08-05T17:34:19.913Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '50f3124d-485a-4522-92cd-c265d50693e4',
        'ChIJ-w4QBhWFqkARRHGrBlg0MIc',
        'Zlaten Klas - Emil Georgiev',
        'Sofia Center, bul. "General Mihail D. Skobelev" 50, 1606 Sofia, Bulgaria',
        42.69176000,
        23.31139000,
        '088 823 2123',
        NULL,
        NULL,
        '{bakery,store,food,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"0630"},"close":{"day":1,"time":"1830"}},{"open":{"day":2,"time":"0630"},"close":{"day":2,"time":"1830"}},{"open":{"day":3,"time":"0630"},"close":{"day":3,"time":"1830"}},{"open":{"day":4,"time":"0630"},"close":{"day":4,"time":"1830"}},{"open":{"day":5,"time":"0630"},"close":{"day":5,"time":"1830"}},{"open":{"day":6,"time":"0700"},"close":{"day":6,"time":"1830"}}],"open_now":true,"weekday_text":["Monday: 6:30 AM – 6:30 PM","Tuesday: 6:30 AM – 6:30 PM","Wednesday: 6:30 AM – 6:30 PM","Thursday: 6:30 AM – 6:30 PM","Friday: 6:30 AM – 6:30 PM","Saturday: 7:00 AM – 6:30 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:37.083Z',
        '2025-08-05T17:34:37.083Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '519c4646-980f-4f3e-bfdd-550ed34a1dcb',
        'ChIJByooS56bqkARQnq-WdIPloc',
        'Insomnia Pizza - Инсомниа Света троица',
        'Sveta Troitsa, ul. "Babina Polyana", 1309 Sofia, Bulgaria',
        42.71036250,
        23.29090800,
        '089 426 0055',
        'https://insomnia.pizza/',
        NULL,
        '{establishment,meal_delivery,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1900"},"close":{"day":1,"time":"0500"}},{"open":{"day":1,"time":"1900"},"close":{"day":2,"time":"0500"}},{"open":{"day":2,"time":"1900"},"close":{"day":3,"time":"0500"}},{"open":{"day":3,"time":"1900"},"close":{"day":4,"time":"0500"}},{"open":{"day":4,"time":"1900"},"close":{"day":5,"time":"0500"}},{"open":{"day":5,"time":"1900"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"1900"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: 7:00 PM – 5:00 AM","Tuesday: 7:00 PM – 5:00 AM","Wednesday: 7:00 PM – 5:00 AM","Thursday: 7:00 PM – 5:00 AM","Friday: 7:00 PM – 5:00 AM","Saturday: 7:00 PM – 5:00 AM","Sunday: 7:00 PM – 5:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:31.048Z',
        '2025-08-05T17:34:31.048Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '51db4258-5353-4bed-87d8-13b6780b9245',
        'ChIJo5vi8kWFqkARn7_9DguuApQ',
        'НКП "Левски"',
        'Sofia Center, bul. "Todor Alexandrov" 25-19, 1000 Sofia, Bulgaria',
        42.69847540,
        23.31749540,
        '02 471 9819',
        NULL,
        NULL,
        '{establishment,point_of_interest,food,cafe}',
        '{"periods":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"1800"}}],"open_now":false,"weekday_text":["Monday: 11:00 AM – 6:00 PM","Tuesday: 11:00 AM – 6:00 PM","Wednesday: 11:00 AM – 6:00 PM","Thursday: 11:00 AM – 6:00 PM","Friday: 11:00 AM – 6:00 PM","Saturday: 11:00 AM – 6:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.90,
        false,
        '2025-08-05T17:34:23.176Z',
        '2025-08-05T17:34:23.176Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '52da9204-b535-4885-8962-22d02a949448',
        'ChIJiTM4ugGFqkARYnpUvSVKjb8',
        'The Golden Apple Restaurant',
        'g.k. Lozenets, ul. "Tsvetna Gradina" 37, 1421 Sofia, Bulgaria',
        42.67526980,
        23.31836600,
        '02 426 3093',
        NULL,
        NULL,
        '{restaurant,meal_delivery,establishment,meal_takeaway,food,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:37.344Z',
        '2025-08-05T17:34:37.344Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '536ee174-77fb-4028-b0c7-b141f1f2b2a6',
        'ChIJLTm3qRKFqkAR4A5tEKhDK6k',
        'Tapeti Design',
        'Sofia Center, ul. "Angel Kanchev" 23А, 1000 Sofia, Bulgaria',
        42.69092000,
        23.32213000,
        '088 777 0917',
        NULL,
        NULL,
        '{real_estate_agency,home_goods_store,bar,point_of_interest,furniture_store,store,general_contractor,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1300"},"close":{"day":0,"time":"1700"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1930"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"1930"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"1930"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"1930"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"1930"}},{"open":{"day":6,"time":"1300"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 7:30 PM","Tuesday: 11:00 AM – 7:30 PM","Wednesday: 11:00 AM – 7:30 PM","Thursday: 11:00 AM – 7:30 PM","Friday: 11:00 AM – 7:30 PM","Saturday: 1:00 – 5:00 PM","Sunday: 1:00 – 5:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:28.949Z',
        '2025-08-05T17:34:28.949Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '545cba70-c612-4b2f-a38e-ae57937a645e',
        'ChIJFcsIMxqEqkARtVpe2SuvDTw',
        'Chinese Restaurant',
        'улица „акад. Борис Стефанов" 58 Студентски град, бл. 58, Studentski Kompleks, 1700 Sofia, Bulgaria',
        42.64430740,
        23.34170830,
        '087 828 2878',
        'http://kitaiski.com/',
        NULL,
        '{point_of_interest,food,restaurant,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:30 PM","Tuesday: 12:00 – 10:30 PM","Wednesday: 12:00 – 10:30 PM","Thursday: 12:00 – 10:30 PM","Friday: 12:00 – 10:30 PM","Saturday: 12:00 – 10:30 PM","Sunday: 12:00 – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.60,
        false,
        '2025-08-05T17:34:32.291Z',
        '2025-08-05T17:34:32.291Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '55a93974-84c0-4800-a6b2-b8051a2c3624',
        'ChIJrxxdtxSFqkARSJ3jMacI0k8',
        'Veda House',
        'Old City Center, ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
        42.69224820,
        23.31492440,
        '088 210 8108',
        'http://www.vedahouse.bg/',
        NULL,
        '{food,store,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 10:00 PM","Tuesday: 10:30 AM – 10:00 PM","Wednesday: 10:30 AM – 10:00 PM","Thursday: 10:30 AM – 10:00 PM","Friday: 10:30 AM – 10:00 PM","Saturday: 10:30 AM – 10:00 PM","Sunday: 10:30 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        5.80,
        false,
        '2025-08-05T17:34:23.960Z',
        '2025-08-05T17:34:23.960Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '564de97e-9f87-4263-a167-4f636df070a5',
        'ChIJj-jhRmeFqkAR0zNdATDk4yg',
        'Hotel Knyaz Boris I',
        'Sofia Center, ul. "Knyaz Boris I" 188, 1202 Sofia, Bulgaria',
        42.70478040,
        23.32149340,
        '02 931 3142',
        NULL,
        NULL,
        '{establishment,point_of_interest,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:18.073Z',
        '2025-08-05T17:34:18.073Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '570cfbac-c0d5-4015-9347-f2c9a7785c55',
        'ChIJBcUpk_-EqkARVaallaoWeak',
        'Captain Cook',
        'g.k. Lozenets, Blvd "James Bourchier" 100, 1407 Sofia, Bulgaria',
        42.67219700,
        23.31899500,
        '088 299 9001',
        'http://captaincook.bg/',
        NULL,
        '{food,restaurant,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1200"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1200"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1200"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1200"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1200"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 12:00 PM – 12:00 AM","Tuesday: 12:00 PM – 12:00 AM","Wednesday: 12:00 PM – 12:00 AM","Thursday: 12:00 PM – 12:00 AM","Friday: 12:00 PM – 12:00 AM","Saturday: 12:00 PM – 12:00 AM","Sunday: 12:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:19.061Z',
        '2025-08-05T17:34:19.061Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '574a4b47-abcb-4dae-be46-a8cc58321e70',
        'ChIJc3VIfa2FqkAR7B6DgtTYCn8',
        'Hotel "Strawberry 88"',
        'кв.,,, в.з. Симеоново - северVitosha, ul. "Akademik Dimitar Angelov" 4, 1434 Sofia, Bulgaria',
        42.61954230,
        23.33742950,
        '088 409 5051',
        'http://www.hotelyagoda88.com/',
        NULL,
        '{food,restaurant,lodging,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"0000"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"0000"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"0000"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"0000"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"0000"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"0000"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 12:00 AM – 11:30 PM","Tuesday: 12:00 AM – 11:30 PM","Wednesday: 12:00 AM – 11:30 PM","Thursday: 12:00 AM – 11:30 PM","Friday: 12:00 AM – 11:30 PM","Saturday: 12:00 AM – 11:30 PM","Sunday: 12:00 AM – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:27.433Z',
        '2025-08-05T17:34:27.433Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '57ad2183-7726-4093-8b34-b40a988c7143',
        'ChIJKUo7fDSFqkARWJoT0lYrgck',
        'Botequim da Sil - Brazilian Food, Snacks, Cakes and Desserts - Caterer',
        'g.k. Banishora, ul. "Vranya" 81А, 1309 Sofia, Bulgaria',
        42.70683130,
        23.30626230,
        '087 795 8406',
        'https://eusouoluiz.com/botequim-da-sil',
        NULL,
        '{meal_delivery,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"1700"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"1700"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1700"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1700"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1700"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1700"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 5:00 PM","Tuesday: 9:00 AM – 5:00 PM","Wednesday: 9:00 AM – 5:00 PM","Thursday: 9:00 AM – 5:00 PM","Friday: 9:00 AM – 5:00 PM","Saturday: 9:00 AM – 5:00 PM","Sunday: 9:00 AM – 5:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:30.852Z',
        '2025-08-05T17:34:30.852Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '57f03cb0-b966-4aaf-a615-370abf089ac4',
        'ChIJK4KfbmyFqkAR8y7taSKOG5k',
        'Alabin Central',
        'Old City Center, ул. „Алабин И. Вл.“ 22, 1000 Sofia, Bulgaria',
        42.69473670,
        23.31724430,
        '02 987 8766',
        'https://alabin-central.hotelrr.com/',
        NULL,
        '{point_of_interest,establishment,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.937Z',
        '2025-08-05T17:34:21.937Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '58373be2-f9af-47f4-8eb7-4b5b1d84f22e',
        'ChIJZXoW_MyGqkARDoLDfANMFjU',
        'Lime Cafe & Cocktails',
        'Old City Center, ul. "Graf Ignatiev" 40, 1000 Sofia, Bulgaria',
        42.68994300,
        23.32656100,
        '087 999 8586',
        'https://www.instagram.com/lime.grafa/',
        NULL,
        '{point_of_interest,bar,cafe,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"0800"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"0800"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"0800"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"0800"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"0800"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"0800"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 12:00 AM","Tuesday: 8:00 AM – 12:00 AM","Wednesday: 8:00 AM – 12:00 AM","Thursday: 8:00 AM – 12:00 AM","Friday: 8:00 AM – 12:00 AM","Saturday: 8:00 AM – 12:00 AM","Sunday: 8:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.70,
        false,
        '2025-08-05T17:34:24.483Z',
        '2025-08-05T17:34:24.483Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '583e2fd7-9eff-4256-8b10-00666e319622',
        'ChIJDR16eb2FqkAR7_kfdvtfI-c',
        'La Terra Ristorante',
        'Manastirski Livadi, ul. "Boyan Petrov" 7, 1404 Sofia, Bulgaria',
        42.66064410,
        23.29383400,
        '089 900 0119',
        'http://www.laterra.bg/',
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:37.998Z',
        '2025-08-05T17:34:37.998Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '597934dc-ddd5-4bfd-898b-fd2605de8a28',
        'ChIJDf6IqneFqkARZSSfBwUidxw',
        'Mediterraneo Restaurant',
        'Doctor''s Garden, ul. "Oborishte" 9Б, 1000 Sofia, Bulgaria',
        42.69581090,
        23.33699980,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:25.794Z',
        '2025-08-05T17:34:25.794Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '5ab02efc-71ac-45e1-942f-d59ac1f08d8e',
        'ChIJE-wjWgCZqkARbM40nTOMMg0',
        'Ресторант - Басейн "Синьо лято"',
        'ul. "Tsar Simeon" 73, 1320 Bankya, Bulgaria',
        42.69584900,
        23.14924890,
        NULL,
        'http://siniolqto.bg/',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:15.653Z',
        '2025-08-05T17:34:15.653Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '5adae6d5-3092-4b27-bcdf-43bddb58ac1c',
        'ChIJtR41yo2FqkARIs4dPXtT75I',
        'JUNGLE BURGER',
        'Borovo, ul. "Topli dol" 6, 1680 Sofia, Bulgaria',
        42.67016740,
        23.28974980,
        '087 678 5387',
        'https://www.facebook.com/profile.php?id=61556115313692',
        NULL,
        '{establishment,restaurant,food,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"1500"}},{"open":{"day":1,"time":"1530"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"1400"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"1400"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"1530"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1230"},"close":{"day":5,"time":"1530"}},{"open":{"day":5,"time":"1700"},"close":{"day":5,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 3:00 PM, 3:30 – 8:00 PM","Tuesday: 2:00 – 9:00 PM","Wednesday: 2:00 – 9:00 PM","Thursday: 3:30 – 10:00 PM","Friday: 12:30 – 3:30 PM, 5:00 – 10:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.90,
        false,
        '2025-08-05T17:34:16.373Z',
        '2025-08-05T17:34:16.373Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '5be9f548-1bb7-49b8-a052-8d15424a037e',
        'ChIJHyWYvA-FqkARPKnDwMll6Qw',
        'Chevermeto',
        'София, пл. България 1, Ндк, Проното, Pette Kyosheta, Pencho Slaveykov Boulevard, 1463 Sofia, Bulgaria',
        42.68294460,
        23.31622400,
        '088 563 0308',
        'http://chevermeto-bg.com/',
        NULL,
        '{point_of_interest,establishment,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"1300"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1200"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1200"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1200"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1200"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1300"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 12:00 PM – 12:00 AM","Tuesday: 12:00 PM – 12:00 AM","Wednesday: 12:00 PM – 12:00 AM","Thursday: 12:00 PM – 12:00 AM","Friday: 12:00 PM – 12:00 AM","Saturday: 1:00 PM – 12:00 AM","Sunday: 1:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:14.804Z',
        '2025-08-05T17:34:14.804Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '5d1b981b-c2f6-4920-953f-78bd88883239',
        'ChIJe1H_c3GFqkARlaBr0EMWcMI',
        'Ресторант VICTORIA Цар Освободител',
        'Old City Center, bul. "Tsar Osvoboditel" 7, 1000 Sofia, Bulgaria',
        42.69510630,
        23.33009940,
        '088 839 3077',
        'https://www.victoria.bg/bg/restaurants/sofiya/restorant-victoria-tsar-osvoboditel/',
        NULL,
        '{meal_takeaway,food,meal_delivery,point_of_interest,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:29.734Z',
        '2025-08-05T17:34:29.734Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '5d35d25f-849a-464a-ba67-1ac334e9509e',
        'ChIJr81ONg6FqkAROOxs-i1w0pM',
        'Subway @ NDK underpass',
        'g.k. Triaditza, "Bulgaria" square 1, Ндк, 1421 София, Bulgaria',
        42.68560060,
        23.31937900,
        '088 462 4948',
        NULL,
        NULL,
        '{point_of_interest,meal_takeaway,food,restaurant,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:00 PM","Tuesday: 10:00 AM – 10:00 PM","Wednesday: 10:00 AM – 10:00 PM","Thursday: 10:00 AM – 10:00 PM","Friday: 10:00 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 10:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:37.411Z',
        '2025-08-05T17:34:37.411Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '5d4e14cb-e23e-4fe3-a564-5d0ec85acc95',
        'ChIJAV1Fdw2FqkARLiLCvNBBniI',
        'JoVan The Dutch Bakery',
        'Sofia Center, ul. "Angel Kanchev" 37, 1000 Sofia, Bulgaria',
        42.68926010,
        23.32179850,
        '088 588 6190',
        NULL,
        NULL,
        '{bakery,store,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 8:00 PM","Tuesday: 8:00 AM – 8:00 PM","Wednesday: 8:00 AM – 8:00 PM","Thursday: 8:00 AM – 8:00 PM","Friday: 8:00 AM – 8:00 PM","Saturday: 8:00 AM – 8:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        3.70,
        false,
        '2025-08-05T17:34:17.417Z',
        '2025-08-05T17:34:17.417Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '5db0dcd3-7f09-4efa-ac18-892f87a9e855',
        'ChIJEYAOA2aFqkARrR4dlCBzyFU',
        'Hotel Central Club',
        'Old City Center, bul. "Knyaginya Maria Luiza" 20, 1000 Sofia, Bulgaria',
        42.70077850,
        23.32285670,
        '02 995 0810',
        NULL,
        NULL,
        '{point_of_interest,establishment,lodging}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.350Z',
        '2025-08-05T17:34:21.350Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '60f39fd2-a1b5-4979-b879-abc2e11ed418',
        'ChIJveOeY2mFqkAR0pcfP7-eIWA',
        'Subway',
        '33, Old City Center, бул. „Александър Стамболийски“ Blvd, 1301 София, Bulgaria',
        42.69709090,
        23.31813710,
        '088 723 2893',
        'https://restaurants.subway.com/bg/%D0%B1%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F/sofia/33-al-sambolijski-blvd?utm_source=yxt-goog&utm_medium=local&utm_term=acq&utm_content=49443&utm_campaign=evergreen-2020&y_source=1_MTQ5Mjk3NjItNzE1LWxvY2F0aW9uLndlYnNpdGU%3D',
        NULL,
        '{establishment,restaurant,meal_takeaway,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 11:00 PM","Tuesday: 8:00 AM – 11:00 PM","Wednesday: 8:00 AM – 11:00 PM","Thursday: 8:00 AM – 11:00 PM","Friday: 8:00 AM – 11:00 PM","Saturday: 8:00 AM – 11:00 PM","Sunday: 9:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        5.50,
        false,
        '2025-08-05T17:34:20.959Z',
        '2025-08-05T17:34:20.959Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '64b0e4ad-45fb-4742-b7e2-f4d67e3cc420',
        'ChIJjc8lvJaEqkARu3BwWiRY2io',
        'Victoria',
        'Manastirski Livadi, blvd. "Bulgaria" 118, 1618 Sofia, Bulgaria',
        42.65605170,
        23.28361080,
        '088 210 8070',
        'https://www.victoria.bg/bg/restaurants/sofiya/restorant-victoria-bulgariya/',
        NULL,
        '{restaurant,meal_takeaway,food,point_of_interest,establishment,meal_delivery}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:30 PM","Tuesday: 12:00 – 11:30 PM","Wednesday: 12:00 – 11:30 PM","Thursday: 12:00 – 11:30 PM","Friday: 12:00 – 11:30 PM","Saturday: 12:00 – 11:30 PM","Sunday: 12:00 – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        3.50,
        false,
        '2025-08-05T17:34:39.635Z',
        '2025-08-05T17:34:39.635Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '64e64515-783d-4488-a77c-9a73e0c25e5f',
        'ChIJ1-lPFg2FqkARs4o6-hZeDKg',
        'Green Deli Café',
        'Sofia Center, ulitsa „Georgi S. Rakovski“ 165, 1000 Sofia, Bulgaria',
        42.68977840,
        23.32353590,
        '087 925 6565',
        'http://greendelicafe.com/',
        NULL,
        '{restaurant,point_of_interest,food,store,establishment,cafe}',
        '{"periods":[{"open":{"day":0,"time":"0830"},"close":{"day":0,"time":"1730"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"0830"},"close":{"day":6,"time":"1730"}}],"open_now":false,"weekday_text":["Monday: 8:00 AM – 6:00 PM","Tuesday: 8:00 AM – 6:00 PM","Wednesday: 8:00 AM – 6:00 PM","Thursday: 8:00 AM – 6:00 PM","Friday: 8:00 AM – 6:00 PM","Saturday: 8:30 AM – 5:30 PM","Sunday: 8:30 AM – 5:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:25.403Z',
        '2025-08-05T17:34:25.403Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '64fc8eaf-2834-45af-bf99-ea27ca1ee52f',
        'ChIJMfAU1UOFqkARjw1juWNusTs',
        'Мис Каприз',
        'Pette Kyosheta, "Aleksandar Stamboliyski" Blvd 72, 1303 Sofia, Bulgaria',
        42.69855710,
        23.31087090,
        '088 848 4826',
        'https://www.misskapriz.com/',
        NULL,
        '{food,restaurant,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2220"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 10:00 PM","Tuesday: 10:30 AM – 10:00 PM","Wednesday: 10:30 AM – 10:00 PM","Thursday: 10:30 AM – 10:00 PM","Friday: 10:30 AM – 10:00 PM","Saturday: Closed","Sunday: 10:30 AM – 10:20 PM"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:20.763Z',
        '2025-08-05T17:34:20.763Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '65f6ffc1-f448-4ce0-b887-30d5711929a2',
        'ChIJ5SHacueFqkARUuc9pC9Bp3c',
        'Martines Specialty Coffee Shop & Roastery Sofia',
        'Old City Center, ul. "Hristo Belchev" 1, 1000 Sofia, Bulgaria',
        42.69457120,
        23.32192610,
        '088 845 4288',
        'https://martines.coffee/',
        NULL,
        '{establishment,food,restaurant,store,point_of_interest,cafe}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 6:00 PM","Tuesday: 9:00 AM – 6:00 PM","Wednesday: 9:00 AM – 6:00 PM","Thursday: 9:00 AM – 6:00 PM","Friday: 9:00 AM – 6:00 PM","Saturday: 10:00 AM – 6:00 PM","Sunday: 10:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:33.797Z',
        '2025-08-05T17:34:33.797Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '660c0653-6ae8-40bf-a81d-b6f78ce85fea',
        'ChIJ0dKQDIaDqkARDrqPDW2hnNY',
        'Il Rustico',
        'KinotsentarVitosha, ul. "Nartsis" 58, 1415 Sofia, Bulgaria',
        42.63571510,
        23.30111880,
        '087 864 2827',
        'http://www.leospizza.bg/',
        NULL,
        '{point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:31.374Z',
        '2025-08-05T17:34:31.374Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '66a0cd84-9c18-46da-9a80-8f87d0c766e0',
        'ChIJKdnug5qFqkARCRjVIg_250E',
        'Restaurant Victoria',
        'Oborishte, ul. "Cherkovna" 75 В, 1505 Sofia, Bulgaria',
        42.69198120,
        23.35192640,
        '088 791 1000',
        'https://www.victoria.bg/bg/restaurants/sofiya/restorant-victoria-cherkovna/',
        NULL,
        '{meal_delivery,meal_takeaway,establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:26.515Z',
        '2025-08-05T17:34:26.515Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '670c213e-0e6c-4a99-9f0a-913ddc35ea12',
        'ChIJQzk3l2CFqkARVI2bPNheyXk',
        'Hadjidraganov''s Houses Restaurant',
        'Sofia Center, ul. "Kozloduy" 75, 1202 Sofia, Bulgaria',
        42.70655660,
        23.32261350,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:34.848Z',
        '2025-08-05T17:34:34.848Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '671bd3bd-b602-476a-92a0-dfaf835241c1',
        'ChIJAZHpBwyZqkARd2rpPJhaVs4',
        'Katrin - Irena Draganova',
        'ul. "Ivan Vazov" 5, 1320 Bankya, Bulgaria',
        42.70353640,
        23.14477760,
        '089 873 3899',
        NULL,
        NULL,
        '{point_of_interest,establishment,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 10:30 PM","Tuesday: 9:00 AM – 10:30 PM","Wednesday: 9:00 AM – 10:30 PM","Thursday: 9:00 AM – 10:30 PM","Friday: 9:00 AM – 10:30 PM","Saturday: 9:00 AM – 10:30 PM","Sunday: 9:00 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:39.372Z',
        '2025-08-05T17:34:39.372Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '675b6e24-0661-4200-a008-b48694a0ea34',
        'ChIJx1xh4gyFqkAR4hX9F3HPZns',
        'Franco''s Pizza',
        'Sofia Center, ul. "Han Asparuh" 37, 1000 Sofia, Bulgaria',
        42.68967610,
        23.31967490,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:39.569Z',
        '2025-08-05T17:34:39.569Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '69d0b641-e484-46d7-982b-2771863ff8b5',
        'ChIJAXA5G9mEqkARVkXcGw-LIYg',
        'Nedelya',
        'ж.к. Белите брези, bul. "Gotse Delchev" 9, 1612 Sofia, Bulgaria',
        42.67754120,
        23.28688050,
        '088 830 3704',
        'https://nedelya.com/sladkarnitsi',
        NULL,
        '{food,store,establishment,cafe,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 9:00 PM","Tuesday: 9:00 AM – 9:00 PM","Wednesday: 9:00 AM – 9:00 PM","Thursday: 9:00 AM – 9:00 PM","Friday: 9:00 AM – 9:00 PM","Saturday: 9:00 AM – 9:00 PM","Sunday: 9:00 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.20,
        false,
        '2025-08-05T17:34:40.289Z',
        '2025-08-05T17:34:40.289Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '69dff68d-b850-4b0a-8df0-a5fb7b1cc542',
        'ChIJpRlU0jKFqkARtfpCixU5oBo',
        'Sofia Delivery Crew',
        'Old City Center, ul. "Pozitano" 22, 1000 Sofia, Bulgaria',
        42.69639350,
        23.31793990,
        '0700 70 755',
        NULL,
        NULL,
        '{food,establishment,laundry,meal_delivery,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.80,
        false,
        '2025-08-05T17:34:30.523Z',
        '2025-08-05T17:34:30.523Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '6c095c27-7639-4cc8-bb59-b4bb2dab52dc',
        'ChIJgSeBFbmFqkAR37RjC-_ZJPA',
        'Pizza Grazie Italia',
        'Hipodruma, ul. "Bulair" 13, 1612 Sofia, Bulgaria',
        42.68108110,
        23.29477190,
        '088 999 4106',
        NULL,
        NULL,
        '{point_of_interest,meal_delivery,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2130"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2130"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2130"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2130"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2130"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2130"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2130"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 9:30 PM","Tuesday: 10:30 AM – 9:30 PM","Wednesday: 10:30 AM – 9:30 PM","Thursday: 10:30 AM – 9:30 PM","Friday: 10:30 AM – 9:30 PM","Saturday: 10:30 AM – 9:30 PM","Sunday: 10:30 AM – 9:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:30.983Z',
        '2025-08-05T17:34:30.983Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '6c4a9acd-2f5c-438d-9882-2338c6e224de',
        'ChIJR11Y3G2FqkARfT_MFyIJ3Mg',
        'Bedroom Premium',
        'Sofia Center, ul. Lege 2, 1000 Sofia, Bulgaria',
        42.69507320,
        23.32373620,
        '088 876 4422',
        'http://www.bedroom.bg/',
        NULL,
        '{establishment,night_club,point_of_interest}',
        '{"periods":[{"open":{"day":4,"time":"2200"},"close":{"day":5,"time":"0600"}},{"open":{"day":5,"time":"2200"},"close":{"day":6,"time":"0600"}},{"open":{"day":6,"time":"2200"},"close":{"day":0,"time":"0600"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: 10:00 PM – 6:00 AM","Friday: 10:00 PM – 6:00 AM","Saturday: 10:00 PM – 6:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:27.171Z',
        '2025-08-05T17:34:27.171Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '6d33ecbd-4bee-423a-a69f-b655205d24dd',
        'ChIJZ-22XnGFqkARq9PZQ3hG9Dg',
        'Piatto Collezione',
        'Sofia Center, ul. "Verila" 5, 1463 Sofia, Bulgaria',
        42.68752770,
        23.31736970,
        '088 376 2222',
        'https://www.piatto.bg/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1100"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 12:00 AM","Saturday: 11:00 AM – 12:00 AM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.80,
        false,
        '2025-08-05T17:34:40.158Z',
        '2025-08-05T17:34:40.158Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '6d645cfe-c411-4d1b-933e-5cd24237e67d',
        'ChIJ3wauYNCZqkAR4xp8SE4oJ2Q',
        'Sunset bar & dinner',
        'ul. "Aleksandar Stamboliyski" 1, 1320 Bankya, Bulgaria',
        42.70641280,
        23.14797870,
        '088 878 3383',
        NULL,
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 11:00 PM","Tuesday: 8:00 AM – 11:00 PM","Wednesday: 8:00 AM – 11:00 PM","Thursday: 8:00 AM – 11:00 PM","Friday: 8:00 AM – 11:00 PM","Saturday: 8:00 AM – 11:00 PM","Sunday: 8:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:15.587Z',
        '2025-08-05T17:34:15.587Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '6e1dca8c-d975-4d0e-a30c-34ee254e1d83',
        'ChIJDRt67MiFqkARr7afb9L4900',
        'Osteria Tartufo - Hristo Belchev',
        'Sofia Center, ul. "Hristo Belchev" 32, 1000 Sofia, Bulgaria',
        42.69118790,
        23.32065450,
        '087 779 4999',
        'https://osteriatartufo.com/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:20.174Z',
        '2025-08-05T17:34:20.174Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '6e94f5ce-a2d1-41fe-8e9f-5274e2ce5a04',
        'ChIJLYVOchOFqkARvEAUyrJ_-CQ',
        'Hotel "Niky"',
        'Old City Center, ul. "Neofit Rilski" 16, 1000 Sofia, Bulgaria',
        42.69069530,
        23.31660770,
        '02 952 3058',
        'http://hotel-niky.com/',
        NULL,
        '{establishment,point_of_interest,lodging}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1200"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1200"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1200"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1200"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1200"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 12:00 PM – 12:00 AM","Tuesday: 12:00 PM – 12:00 AM","Wednesday: 12:00 PM – 12:00 AM","Thursday: 12:00 PM – 12:00 AM","Friday: 12:00 PM – 12:00 AM","Saturday: 12:00 PM – 12:00 AM","Sunday: 12:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.50,
        false,
        '2025-08-05T17:34:22.524Z',
        '2025-08-05T17:34:22.524Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '6fa3fd43-6dcb-442a-8dc0-cac26a557008',
        'ChIJQZOpHmyFqkARPWjvO_btmrI',
        'Spaghetti Kitchen & Bar - Sveta Nedelya',
        'Old City Center, pl. "Sveta Nedelya" 3, 1000 Sofia, Bulgaria',
        42.69605520,
        23.32067680,
        '089 304 6666',
        'https://www.spaghetti-kitchen.com/',
        NULL,
        '{point_of_interest,food,restaurant,establishment,bar}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 11:30 PM","Tuesday: 9:00 AM – 11:30 PM","Wednesday: 9:00 AM – 11:30 PM","Thursday: 9:00 AM – 11:30 PM","Friday: 9:00 AM – 11:30 PM","Saturday: 11:00 AM – 11:30 PM","Sunday: 11:00 AM – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:31.635Z',
        '2025-08-05T17:34:31.635Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '704708a6-6763-4db3-89c6-13535e21c8d1',
        'ChIJF-1hNwCFqkAREM9Xe7UBrRA',
        'Fantastic Food',
        'Old City Center, bul. "Knyaginya Maria Luiza", 1000 Sofia, Bulgaria',
        42.70021640,
        23.32240090,
        '088 331 5333',
        NULL,
        NULL,
        '{restaurant,meal_takeaway,food,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"0800"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"0800"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"0800"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"0800"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"0800"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"0800"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 12:00 AM","Tuesday: 8:00 AM – 12:00 AM","Wednesday: 8:00 AM – 12:00 AM","Thursday: 8:00 AM – 12:00 AM","Friday: 8:00 AM – 12:00 AM","Saturday: 8:00 AM – 12:00 AM","Sunday: 8:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:29.997Z',
        '2025-08-05T17:34:29.997Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '70c1ed04-2462-4b64-b6f5-c5d405156f20',
        'ChIJq7JtV5CFqkARrasxtyy4A9w',
        'Subway',
        'Serdika Center, Oborishte, Sitnyakovo Blvd 48, 1505 Sofia, Bulgaria',
        42.69188310,
        23.35353110,
        '02 495 2374',
        'https://restaurants.subway.com/bg/%D0%B1%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F/sofia/sitnyakovo-no-48?utm_source=yxt-goog&utm_medium=local&utm_term=acq&utm_content=46811&utm_campaign=evergreen-2020&y_source=1_MTQ5Mjk3NTgtNzE1LWxvY2F0aW9uLndlYnNpdGU%3D',
        NULL,
        '{restaurant,establishment,meal_takeaway,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:00 PM","Tuesday: 10:00 AM – 10:00 PM","Wednesday: 10:00 AM – 10:00 PM","Thursday: 10:00 AM – 10:00 PM","Friday: 10:00 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 10:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:37.278Z',
        '2025-08-05T17:34:37.278Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '712fc006-5dca-4ecc-9608-ee1a8c200a5e',
        'ChIJ4WBSZWmFqkARJZBNT1dEQmY',
        'KFC СТАМБОЛИЙСКИ',
        'Old City Center, "Aleksandar Stamboliyski" Blvd 28, 1000 Sofia, Bulgaria',
        42.69740460,
        23.31810680,
        '0700 11 999',
        'https://kfc.bg/',
        NULL,
        '{establishment,meal_takeaway,meal_delivery,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 10:00 PM","Tuesday: 10:30 AM – 10:00 PM","Wednesday: 10:30 AM – 10:00 PM","Thursday: 10:30 AM – 10:00 PM","Friday: 10:30 AM – 10:00 PM","Saturday: 10:30 AM – 10:00 PM","Sunday: 10:30 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:24.418Z',
        '2025-08-05T17:34:24.418Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7144854c-46ed-48c7-8977-c9b7b62e7573',
        'ChIJWTlWjrSFqkARp-dlyIpQFFk',
        'Pinsata Pizzeria Ristorante Take Away',
        'Pette Kyosheta, ul. "Otets Paisiy" 60, 1303 Sofia, Bulgaria',
        42.70169970,
        23.31366330,
        '088 808 8597',
        NULL,
        NULL,
        '{food,establishment,meal_delivery,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:37.673Z',
        '2025-08-05T17:34:37.673Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '71fcac7e-803f-4234-b8cb-bf09301794b4',
        'ChIJaaUNXUGFqkARIiygimkicN4',
        'KFC',
        'Zona B-5, "Aleksandar Stamboliyski" Blvd 103, 1303 Sofia, Bulgaria',
        42.69849320,
        23.30840890,
        '02 920 9920',
        'http://kfc.bg/',
        NULL,
        '{establishment,restaurant,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2130"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2130"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2130"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2130"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2130"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2130"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2130"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 9:30 PM","Tuesday: 10:00 AM – 9:30 PM","Wednesday: 10:00 AM – 9:30 PM","Thursday: 10:00 AM – 9:30 PM","Friday: 10:00 AM – 9:30 PM","Saturday: 10:00 AM – 9:30 PM","Sunday: 10:00 AM – 9:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:38.523Z',
        '2025-08-05T17:34:38.523Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '72668f3f-e29f-419f-b9a8-180de1015cd4',
        'ChIJZ_UvwpeFqkARj5LpTYYhsHs',
        'Centobuchi',
        'g.k. Lozenets, ul. "Midzhur" 39, 1421 Sofia, Bulgaria',
        42.67923850,
        23.32651870,
        '088 911 2100',
        'https://centobuchi.com/',
        NULL,
        '{meal_delivery,restaurant,meal_takeaway,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1800"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1800"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1800"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1800"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2200"}}],"open_now":false,"weekday_text":["Monday: 6:00 – 10:00 PM","Tuesday: 6:00 – 10:00 PM","Wednesday: 6:00 – 10:00 PM","Thursday: 6:00 – 10:00 PM","Friday: 6:00 – 10:00 PM","Saturday: 11:30 AM – 10:00 PM","Sunday: 11:30 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:37.737Z',
        '2025-08-05T17:34:37.737Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '739f461d-682e-4d02-b0bb-11161b95b9bc',
        'ChIJvV-nfgaGqkARlytaDcFpzNA',
        'ibis Sofia Airport',
        'ul. "Mimi Balkanska" 132, 1517 Sofia, Bulgaria',
        42.68671660,
        23.39736810,
        '02 944 4488',
        'https://all.accor.com/lien_externe.svlt?goto=fiche_hotel&code_hotel=9671&merchantid=seo-maps-BG-9671&sourceid=aw-cen&utm_medium=seo%20maps&utm_source=google%20Maps&utm_campaign=seo%20maps',
        NULL,
        '{food,point_of_interest,restaurant,lodging,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:17.482Z',
        '2025-08-05T17:34:17.482Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7414b6f8-b385-4c85-b52b-2fe733b2e244',
        'ChIJ5W6gWwCFqkARRWPstaOzxzE',
        'Grab Go Pizza Station Vitosha',
        'Old City Center, ул. „Алабин И. Вл.“ 46, 1000 Sofia, Bulgaria',
        42.69490370,
        23.32052010,
        NULL,
        NULL,
        NULL,
        '{point_of_interest,restaurant,meal_takeaway,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1030"},"close":{"day":5,"time":"0530"}},{"open":{"day":5,"time":"1030"},"close":{"day":6,"time":"0530"}},{"open":{"day":6,"time":"1130"},"close":{"day":0,"time":"0530"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 10:30 PM","Tuesday: 10:30 AM – 10:30 PM","Wednesday: 10:30 AM – 10:30 PM","Thursday: 10:30 AM – 5:30 AM","Friday: 10:30 AM – 5:30 AM","Saturday: 11:30 AM – 5:30 AM","Sunday: 11:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:30.063Z',
        '2025-08-05T17:34:30.063Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '74a8dc8c-c132-40d3-8135-29479edf4a8c',
        'ChIJXRrqW2yFqkAR1dC8SSSJWoA',
        'Wok to Walk',
        'Old City Center, bul. "Vitosha" 8, 1000 Sofia, Bulgaria',
        42.69443620,
        23.32042430,
        '02 434 3333',
        'https://www.woktowalk.bg/',
        NULL,
        '{restaurant,meal_takeaway,establishment,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":1,"time":"0200"}},{"open":{"day":1,"time":"1100"},"close":{"day":2,"time":"0200"}},{"open":{"day":2,"time":"1100"},"close":{"day":3,"time":"0200"}},{"open":{"day":3,"time":"1100"},"close":{"day":4,"time":"0200"}},{"open":{"day":4,"time":"1100"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0200"}},{"open":{"day":6,"time":"1100"},"close":{"day":0,"time":"0200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 2:00 AM","Tuesday: 11:00 AM – 2:00 AM","Wednesday: 11:00 AM – 2:00 AM","Thursday: 11:00 AM – 2:00 AM","Friday: 11:00 AM – 2:00 AM","Saturday: 11:00 AM – 2:00 AM","Sunday: 11:00 AM – 2:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.80,
        false,
        '2025-08-05T17:34:20.434Z',
        '2025-08-05T17:34:20.434Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '74cddd8f-1f7e-4c29-8a17-2a1e9e3b2787',
        'ChIJp2pZB2iFqkARUxS2cD3AJvA',
        'Orient Express Hostel',
        'Old City Center, ul. "Balkan" 2, 1303 Sofia, Bulgaria',
        42.70165620,
        23.31771820,
        '088 838 4828',
        NULL,
        NULL,
        '{point_of_interest,establishment,lodging}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:22.654Z',
        '2025-08-05T17:34:22.654Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '753b6a38-cf20-4ad6-a4eb-fcdef9181fc4',
        'ChIJI60nA5tiqkAR7s9gVeopqXg',
        'Eurostars Sofia City',
        'Old City Center, ul. "Stara Planina" 6, 1000 Sofia, Bulgaria',
        42.69902150,
        23.33243750,
        '02 915 1500',
        'https://www.eurostarssofiacity.com/?referer_code=lb0gg00yx&utm_source=google&utm_medium=business&utm_campaign=lb0gg00yx',
        NULL,
        '{establishment,lodging,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:13.816Z',
        '2025-08-05T17:34:13.816Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '75a59e97-8d90-4893-8b74-5081bdbb5faf',
        'ChIJUyiUDHSFqkARhKqG65b4Y0E',
        'Fast Food Vkusotilnica',
        'Old City Center, ul. "Tsar Shishman" 4, 1191 Sofia, Bulgaria',
        42.69279900,
        23.33126000,
        '02 444 5355',
        'https://vkusotilnica.com/',
        NULL,
        '{point_of_interest,food,establishment,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:00 PM","Tuesday: 8:00 AM – 7:00 PM","Wednesday: 8:00 AM – 7:00 PM","Thursday: 8:00 AM – 7:00 PM","Friday: 8:00 AM – 7:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        3.20,
        false,
        '2025-08-05T17:34:37.868Z',
        '2025-08-05T17:34:37.868Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '75c13b62-e656-4968-b49a-acdda315561a',
        'ChIJI18KiueFqkARTF9uzsbLjZE',
        'Prima Bread',
        'Geo Milev, ul. "Alexander Zhendov" 1, 1113 Sofia, Bulgaria',
        42.67906570,
        23.35545330,
        '02 970 5687',
        'https://www.primabread.eu/',
        NULL,
        '{food,store,point_of_interest,establishment,bakery}',
        NULL,
        '{}',
        NULL,
        NULL,
        4.00,
        false,
        '2025-08-05T17:34:13.882Z',
        '2025-08-05T17:34:13.882Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '75e675d3-2c5d-4a69-8762-e70a7ffc5056',
        'ChIJU3dKXm-FqkARcM-nx6lMX8M',
        'Kafe Mania Boutique & Bar',
        'g.k. Lozenets, Blvd. "Cherni vrah" 25, 1000 Sofia, Bulgaria',
        42.67774250,
        23.32215380,
        '02 439 8104',
        'https://kafemania.bg/',
        NULL,
        '{cafe,point_of_interest,store,food,establishment}',
        '{"periods":[{"open":{"day":1,"time":"0930"},"close":{"day":1,"time":"1830"}},{"open":{"day":2,"time":"0930"},"close":{"day":2,"time":"1830"}},{"open":{"day":3,"time":"0930"},"close":{"day":3,"time":"1830"}},{"open":{"day":4,"time":"0930"},"close":{"day":4,"time":"1830"}},{"open":{"day":5,"time":"0930"},"close":{"day":5,"time":"1830"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 9:30 AM – 6:30 PM","Tuesday: 9:30 AM – 6:30 PM","Wednesday: 9:30 AM – 6:30 PM","Thursday: 9:30 AM – 6:30 PM","Friday: 9:30 AM – 6:30 PM","Saturday: 10:00 AM – 7:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:28.884Z',
        '2025-08-05T17:34:28.884Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '77c16731-1e85-4d00-b924-d6928709e3ff',
        'ChIJzcJYn_SFqkARgtP3mqOmf0Q',
        'Smash N’ Pass | Sofia',
        'Sofia Center, bul. "Vitosha" 102, 1463 Sofia, Bulgaria',
        42.68605770,
        23.31734250,
        '088 668 8683',
        'https://www.instagram.com/smash.n.pass/?igsh=amkwdGdlenJ0djJ3&utm_source=qr#',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:36.028Z',
        '2025-08-05T17:34:36.028Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '77f5d472-beb9-4fef-9a71-30638637c4bc',
        'ChIJacBldACZqkAR4o-a_c4OheY',
        'Ресторант "Ламар"',
        'ul. "Tsar Osvoboditel" 21, 1320 Bankya, Bulgaria',
        42.71142200,
        23.16280620,
        '088 844 6555',
        NULL,
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:16.045Z',
        '2025-08-05T17:34:16.045Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '783f13e1-472c-443a-827e-d6fe205996f1',
        'ChIJC-PUSGyFqkARKPBECp-fhiA',
        'Pizza Point',
        'Sofia Center, ул. „Алабин И. Вл.“ 50, 1000 Sofia, Bulgaria',
        42.69474590,
        23.32132020,
        '087 670 7970',
        'https://www.facebook.com/pizzapointbg/',
        NULL,
        '{point_of_interest,restaurant,food,meal_takeaway,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:00 PM","Tuesday: 10:00 AM – 10:00 PM","Wednesday: 10:00 AM – 10:00 PM","Thursday: 10:00 AM – 10:00 PM","Friday: 10:00 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 10:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:30.129Z',
        '2025-08-05T17:34:30.129Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '787a03d4-0078-41cb-b909-f203e4c69b06',
        'ChIJH9N9c1WFqkARTmHZOq61PKE',
        'easyHotel Sofia',
        'Sofia Center, ul. "Aldomirovska" 108, 1309 Sofia, Bulgaria',
        42.70086310,
        23.30242300,
        '02 920 1654',
        'https://www.easyhotel.com/hotels/bulgaria/sofia/sofia?utm_source=google&utm_medium=organic&utm_campaign=GMB-franchised-sofia',
        NULL,
        '{establishment,point_of_interest,lodging}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:28.818Z',
        '2025-08-05T17:34:28.818Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7bfbd662-d9bf-4a14-98d0-905ad69b8319',
        'ChIJKVpsZsGFqkARaNSES-KiOV8',
        'УниПек Коперник',
        'Geo Milev, ul. "Nikolay Kopernik" 21А, 1111 Sofia, Bulgaria',
        42.67973580,
        23.36108440,
        NULL,
        'http://www.unipek.com/',
        NULL,
        '{point_of_interest,food,bakery,store,establishment}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:00 PM","Tuesday: 8:00 AM – 7:00 PM","Wednesday: 8:00 AM – 7:00 PM","Thursday: 8:00 AM – 7:00 PM","Friday: 8:00 AM – 7:00 PM","Saturday: 8:00 AM – 6:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:27.890Z',
        '2025-08-05T17:34:27.890Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7c911305-3626-4e60-925b-3ad5a6e7f803',
        'ChIJ7w-6xl2EqkARfYeqzn0CRjY',
        'Mr. Pizza - Paradise Center',
        'Hladilnika, Blvd. "Cherni vrah" 100, 1407 Sofia, Bulgaria',
        42.65717280,
        23.31561050,
        '089 561 1022',
        'http://www.mrpizza.bg/',
        NULL,
        '{point_of_interest,food,meal_takeaway,meal_delivery,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":1,"time":"0100"}},{"open":{"day":1,"time":"1100"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1100"},"close":{"day":3,"time":"0100"}},{"open":{"day":3,"time":"1100"},"close":{"day":4,"time":"0100"}},{"open":{"day":4,"time":"1100"},"close":{"day":5,"time":"0100"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":0,"time":"0100"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 12:00 AM","Tuesday: 11:00 AM – 1:00 AM","Wednesday: 11:00 AM – 1:00 AM","Thursday: 11:00 AM – 1:00 AM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 1:00 AM","Sunday: 11:00 AM – 1:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:31.439Z',
        '2025-08-05T17:34:31.439Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7e13b485-894b-42ae-8e30-a890c80ad04e',
        'ChIJ3zgiAAuFqkARuZSDO0j-sR8',
        'Mimas',
        'Sofia Center, ul. "Graf Ignatiev" 47Б, 1142 Sofia, Bulgaria',
        42.68749200,
        23.32985920,
        NULL,
        NULL,
        NULL,
        '{point_of_interest,meal_takeaway,establishment,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":1,"time":"0100"}},{"open":{"day":1,"time":"0900"},"close":{"day":2,"time":"0100"}},{"open":{"day":2,"time":"0900"},"close":{"day":3,"time":"0100"}},{"open":{"day":3,"time":"0900"},"close":{"day":4,"time":"0100"}},{"open":{"day":4,"time":"0900"},"close":{"day":5,"time":"0100"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0100"}},{"open":{"day":6,"time":"0900"},"close":{"day":0,"time":"0100"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 1:00 AM","Tuesday: 9:00 AM – 1:00 AM","Wednesday: 9:00 AM – 1:00 AM","Thursday: 9:00 AM – 1:00 AM","Friday: 9:00 AM – 1:00 AM","Saturday: 9:00 AM – 1:00 AM","Sunday: 9:00 AM – 1:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.70,
        false,
        '2025-08-05T17:34:23.566Z',
        '2025-08-05T17:34:23.566Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7e82259f-c07b-48b2-926a-9e293244ef0a',
        'ChIJwaHPq1mFqkARrZQzoM-RWUg',
        'Двата лъва',
        'Sofia Center, ul. "Chiprovtsi" 1, 1303 Sofia, Bulgaria',
        42.70063570,
        23.31736440,
        '02 967 6112',
        NULL,
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:30 PM","Tuesday: 11:30 AM – 10:30 PM","Wednesday: 11:30 AM – 10:30 PM","Thursday: 11:30 AM – 10:30 PM","Friday: 11:30 AM – 10:30 PM","Saturday: 11:30 AM – 10:30 PM","Sunday: 11:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.60,
        false,
        '2025-08-05T17:34:32.420Z',
        '2025-08-05T17:34:32.420Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7f363c90-f4f4-4267-96b1-faf812fbfcab',
        'ChIJgaghUGyFqkARuPNYlcqXeuI',
        'Piazza Italia Club',
        'Sofia Center, bul. "Vitosha" 13, 1000 Sofia, Bulgaria',
        42.69446410,
        23.32094540,
        '02 987 3433',
        NULL,
        NULL,
        '{bar,food,cafe,restaurant,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 11:30 PM","Tuesday: 8:00 AM – 11:30 PM","Wednesday: 8:00 AM – 11:30 PM","Thursday: 8:00 AM – 11:30 PM","Friday: 8:00 AM – 11:30 PM","Saturday: 8:00 AM – 11:30 PM","Sunday: 8:00 AM – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:29.473Z',
        '2025-08-05T17:34:29.473Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '7f3bfb86-2b43-42d5-8871-fd12d30a4e71',
        'ChIJCR6YoQmFqkARJVGx7tG7qdw',
        'Soul Kitchen',
        'g.k. Lozenets, ul. "Kokiche" 13, 1164 Sofia, Bulgaria',
        42.68432380,
        23.32737170,
        '087 644 0003',
        'http://soulkitchen.bg/',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        NULL,
        '{}',
        NULL,
        NULL,
        7.80,
        false,
        '2025-08-05T17:34:22.263Z',
        '2025-08-05T17:34:22.263Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '81d43228-1374-4405-85ba-539c998c8a50',
        'ChIJAQAAAD-EqkARac37_x0NnJY',
        'Hotel ZOO Sofia',
        'zh.g. Zoopark, Boulevard "Simeonovsko Shose 6, 1700 Sofia, Bulgaria',
        42.65857600,
        23.33613470,
        '089 666 6888',
        'http://hotelzoosofia.com/',
        NULL,
        '{establishment,food,parking,point_of_interest,health,lodging,gym,spa,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        4.00,
        false,
        '2025-08-05T17:34:16.569Z',
        '2025-08-05T17:34:16.569Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '81da08f2-55eb-41ac-bf7c-0b0dacbb66b2',
        'ChIJN8l41EyFqkARjOKMhrPS63s',
        'Thai Chai Cafe - Thai Чай Cafe',
        'Old City Center, ul. "Trapezitsa" 4 str, 1000 Sofia, Bulgaria',
        42.69836400,
        23.32103680,
        NULL,
        'https://www.facebook.com/Thai.Chai.Cafe',
        NULL,
        '{store,point_of_interest,food,cafe,establishment}',
        '{"periods":[{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 7:00 PM","Tuesday: 10:00 AM – 7:00 PM","Wednesday: 10:00 AM – 7:00 PM","Thursday: 10:00 AM – 7:00 PM","Friday: 10:00 AM – 7:00 PM","Saturday: 10:00 AM – 7:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:25.599Z',
        '2025-08-05T17:34:25.599Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8207fa8a-f6ff-49ef-bfcf-55e511dd849f',
        'ChIJ70LHZWyFqkARL1PV0ogOyLs',
        'Restorant Kratunite',
        'Old City Center, ul. "Graf Ignatiev" 26, 1000 Sofia, Bulgaria',
        42.69078590,
        23.32508370,
        '089 661 6552',
        'https://kratunitebg.com/',
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:30 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 10:30 PM","Thursday: 12:00 – 10:30 PM","Friday: 12:00 – 10:30 PM","Saturday: 12:00 – 10:30 PM","Sunday: 12:00 – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:20.370Z',
        '2025-08-05T17:34:20.370Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8294bef8-88c5-4c81-8343-e959cb4fd536',
        'ChIJCymhyGmFqkAR9HVvJ7Lrx5w',
        'Furna',
        'Old City Center, bul."Stefan Stambolov" 3, 1000 Sofia, Bulgaria',
        42.69919020,
        23.31611940,
        '089 449 6659',
        'http://www.furna.bg/',
        NULL,
        '{restaurant,food,establishment,bakery,store,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1700"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1700"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1700"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1700"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1700"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 5:00 PM","Tuesday: 8:00 AM – 5:00 PM","Wednesday: 8:00 AM – 5:00 PM","Thursday: 8:00 AM – 5:00 PM","Friday: 8:00 AM – 5:00 PM","Saturday: 8:00 AM – 5:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        4.80,
        false,
        '2025-08-05T17:34:34.450Z',
        '2025-08-05T17:34:34.450Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '83487dd6-14c8-4c4d-96c7-4934584583f1',
        'ChIJp3lZUx2FqkARCv9UxArBGWM',
        'Carnivale Funky Gastrotaverna',
        'Ivan Vazov, bul. "Vitosha" 190, 1408 Sofia, Bulgaria',
        42.67582060,
        23.30898080,
        '02 423 6096',
        'http://linktr.ee/carnivalesofia',
        NULL,
        '{establishment,point_of_interest,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 11:30 PM","Tuesday: 10:00 AM – 11:30 PM","Wednesday: 10:00 AM – 11:30 PM","Thursday: 10:00 AM – 11:30 PM","Friday: 10:00 AM – 11:30 PM","Saturday: 10:00 AM – 11:30 PM","Sunday: 10:00 AM – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        4.20,
        false,
        '2025-08-05T17:34:35.831Z',
        '2025-08-05T17:34:35.831Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '83ca0d86-b5bb-4486-9f24-91c8c05507d3',
        'ChIJP53-bHqFqkARzk9PnZ0f_So',
        'Bona Dea Group',
        'Old City Center, Knyaz Alexander Dondukov Blvd 57, вх. А, 1000 Sofia, Bulgaria',
        42.69883560,
        23.33411760,
        '02 421 4735',
        NULL,
        NULL,
        '{point_of_interest,food,meal_delivery,restaurant,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:30.720Z',
        '2025-08-05T17:34:30.720Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '853299a4-ad8a-42a5-8d31-7fea6e461213',
        'ChIJRfYIb5yFqkARKbXv5dG9-eo',
        'Restaurant Troika',
        'Doctor''s Garden, ul. "Professor Asen Zlatarov" 21, 1504 Sofia, Bulgaria',
        42.69295230,
        23.34404210,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:19.520Z',
        '2025-08-05T17:34:19.520Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8662d4de-5644-40d1-bf34-b2ac218dd536',
        'ChIJnS5kpG2FqkARuKTDP8DMREk',
        'KFC ГАРИБАЛДИ',
        'Old City Center, ul. "Angel Kanchev" 2, 1000 Sofia, Bulgaria',
        42.69388490,
        23.32241230,
        '0700 11 999',
        'https://kfc.bg/',
        NULL,
        '{point_of_interest,establishment,restaurant,meal_takeaway,food}',
        '{"periods":[{"open":{"day":0,"time":"0930"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"0930"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"0930"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"0930"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"0930"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"0930"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"0930"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 9:30 AM – 11:00 PM","Tuesday: 9:30 AM – 11:00 PM","Wednesday: 9:30 AM – 11:00 PM","Thursday: 9:30 AM – 11:00 PM","Friday: 9:30 AM – 12:00 AM","Saturday: 9:30 AM – 12:00 AM","Sunday: 9:30 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:26.580Z',
        '2025-08-05T17:34:26.580Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8679fd3d-075e-4047-bd64-42d2d8b12777',
        'ChIJOd8D2suFqkAR0hppoxJ6MOQ',
        'Indian Restaurant Dilwale',
        'Sofia Center, ul. "Otets Paisiy" 51, 1303 Sofia, Bulgaria',
        42.70093400,
        23.31317590,
        '089 991 9904',
        NULL,
        NULL,
        '{establishment,point_of_interest,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: Closed","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.90,
        false,
        '2025-08-05T17:34:34.255Z',
        '2025-08-05T17:34:34.255Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '876960f3-69a4-4147-936f-d18da1eb216a',
        'ChIJffCS7MmFqkARqYbM-pEd2HI',
        'Chinese Restaurant Hua Sing Lou',
        'g.k. Iztok, bul. "Dragan Tsankov" 17, 1113 Sofia, Bulgaria',
        42.67221580,
        23.35001230,
        '02 971 4771',
        'https://bg-bg.facebook.com/pages/%D0%A5%D1%83%D0%B0-%D0%A1%D0%B8%D0%BD%D0%B3-%D0%9B%D0%BE%D1%83/159632444193917',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:38.064Z',
        '2025-08-05T17:34:38.064Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '87f51a40-1294-4756-90a4-83125e3f074c',
        'ChIJQe774muFqkARnPFRHmJyuvo',
        'Пекарна Сладко и Солено София',
        'Old City Center, ul. "Pirotska" 8, 1000 Sofia, Bulgaria',
        42.69955890,
        23.32054070,
        '087 762 0111',
        NULL,
        NULL,
        '{food,establishment,point_of_interest,store,bakery}',
        '{"periods":[{"open":{"day":0,"time":"0630"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"0630"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0630"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0630"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0630"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0630"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0630"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 6:30 AM – 8:00 PM","Tuesday: 6:30 AM – 8:00 PM","Wednesday: 6:30 AM – 8:00 PM","Thursday: 6:30 AM – 8:00 PM","Friday: 6:30 AM – 8:00 PM","Saturday: 6:30 AM – 8:00 PM","Sunday: 6:30 AM – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:28.411Z',
        '2025-08-05T17:34:28.411Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '89b0a4da-a420-40c3-adfc-18c7955b4203',
        'ChIJGxGshDWFqkARbr3W5K8qBKA',
        'Sweet and Salty Bakery/Cafe',
        'Old City Center, bul. "Vitosha" 62а, 1463 Sofia, Bulgaria',
        42.68918340,
        23.31845680,
        '087 898 7667',
        'https://www.facebook.com/SweetAndSaltyBakeryCafe',
        NULL,
        '{restaurant,food,bakery,point_of_interest,establishment,store}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 8:00 PM","Tuesday: 8:00 AM – 8:00 PM","Wednesday: 8:00 AM – 8:00 PM","Thursday: 8:00 AM – 8:00 PM","Friday: 8:00 AM – 8:00 PM","Saturday: 8:00 AM – 8:00 PM","Sunday: 8:00 AM – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:34.515Z',
        '2025-08-05T17:34:34.515Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8a89d39a-ab2f-4506-9a65-2080e974d17f',
        'ChIJY5S_y1KFqkAR_6PficyJXwI',
        'TANDIR bake house and coffee',
        'Old City Center, Knyaz Alexander Dondukov Blvd 29, 1000 Sofia, Bulgaria',
        42.69847700,
        23.33085040,
        NULL,
        'https://instagram.com/tandir.bakehouse?igshid=OGQ5ZDc2ODk2ZA==',
        NULL,
        '{point_of_interest,restaurant,bakery,food,establishment,cafe,store}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 8:00 PM","Tuesday: 8:00 AM – 8:00 PM","Wednesday: 8:00 AM – 8:00 PM","Thursday: 8:00 AM – 8:00 PM","Friday: 8:00 AM – 10:00 PM","Saturday: 9:00 AM – 10:00 PM","Sunday: 9:00 AM – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:36.290Z',
        '2025-08-05T17:34:36.290Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8d7eba13-5390-433d-b61c-88f0d658982c',
        'ChIJYVHgKHSFqkAR84FOZdt44y0',
        'Yalta',
        'Old City Center, bul. "Tsar Osvoboditel" 20, 1000 Sofia, Bulgaria',
        42.69279040,
        23.33385480,
        '089 787 0230',
        NULL,
        NULL,
        '{night_club,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0000"},"close":{"day":1,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 9:00 PM","Tuesday: 9:00 AM – 9:00 PM","Wednesday: 9:00 AM – 9:00 PM","Thursday: 9:00 AM – 9:00 PM","Friday: 9:00 AM – 9:00 PM","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.634Z',
        '2025-08-05T17:34:35.634Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8d97c602-ed91-4ab9-86bd-e184c76a63d9',
        'ChIJxyhVc3CFqkAR2vFb_zE3o8I',
        'Miyabi',
        'Old City Center, ul. "Stara Planina" 5, 1000 Sofia, Bulgaria',
        42.69858140,
        23.33045460,
        '088 727 5064',
        'https://miyabi.bg/',
        NULL,
        '{point_of_interest,food,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:33.012Z',
        '2025-08-05T17:34:33.012Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8e2d5d13-78d5-47b6-ac01-17df3c65e9bd',
        'ChIJE7_-0KaFqkARN-CMVWCgH7M',
        'Swingin'' Hall',
        'g.k. Lozenets, bul. "Dragan Tsankov" 8, 1164 Sofia, Bulgaria',
        42.68328570,
        23.33407780,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:18.008Z',
        '2025-08-05T17:34:18.008Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8ee5ea86-50e6-4804-a02c-18e15b625674',
        'ChIJYRP8dsyFqkARwYbsNQq2_i0',
        'Mezze',
        'g.k. Iztok, ul. "Nikolay Haytov" 12, 1113 Sofia, Bulgaria',
        42.66996000,
        23.35279000,
        '089 841 5004',
        'https://www.mezze.bg/',
        NULL,
        '{establishment,food,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:30 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:30 PM","Saturday: 12:00 – 11:30 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:40.224Z',
        '2025-08-05T17:34:40.224Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8f040e80-be59-4ef2-9005-1640228cae40',
        'ChIJK_QUgEKFqkARggr-y0qzh9k',
        'Bristol Hotel - Best Western Plus',
        'Sofia Center, Hristo Botev Blvd 69, 1303 Sofia, Bulgaria',
        42.69986020,
        23.31568490,
        '02 980 4444',
        'http://www.bristolhotel.bg/en/',
        NULL,
        '{food,restaurant,point_of_interest,establishment,lodging}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        4.00,
        false,
        '2025-08-05T17:34:14.014Z',
        '2025-08-05T17:34:14.014Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8f3a4b3a-8039-43a7-9d25-41c5b5526f0b',
        'ChIJ9bGAOJuFqkARDz4Rybaz1yk',
        'Globe Systems',
        'Oborishte, ul. "Murphy" 4, 1505 Sofia, Bulgaria',
        42.69435610,
        23.34813860,
        '02 946 3202',
        'http://vodi4ka.com/',
        NULL,
        '{point_of_interest,food,establishment,meal_delivery}',
        '{"periods":[{"open":{"day":1,"time":"0830"},"close":{"day":1,"time":"1730"}},{"open":{"day":2,"time":"0830"},"close":{"day":2,"time":"1730"}},{"open":{"day":3,"time":"0830"},"close":{"day":3,"time":"1730"}},{"open":{"day":4,"time":"0830"},"close":{"day":4,"time":"1730"}},{"open":{"day":5,"time":"0830"},"close":{"day":5,"time":"1730"}}],"open_now":true,"weekday_text":["Monday: 8:30 AM – 5:30 PM","Tuesday: 8:30 AM – 5:30 PM","Wednesday: 8:30 AM – 5:30 PM","Thursday: 8:30 AM – 5:30 PM","Friday: 8:30 AM – 5:30 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:30.589Z',
        '2025-08-05T17:34:30.589Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8f4b7399-6c2f-483d-9851-710a10a50a0f',
        'ChIJ5-lIwsGFqkARRciWBA9KjOI',
        'Китайски ресторант Златен Дракон',
        'Sofia Center, ul. "Trapezitsa" 4A, 1000 Sofia, Bulgaria',
        42.69834350,
        23.32113120,
        NULL,
        NULL,
        NULL,
        '{food,establishment,meal_takeaway,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 6:00 PM","Tuesday: 11:00 AM – 6:00 PM","Wednesday: 11:00 AM – 6:00 PM","Thursday: 11:00 AM – 6:00 PM","Friday: 11:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.80,
        false,
        '2025-08-05T17:34:37.213Z',
        '2025-08-05T17:34:37.213Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '8f576a5e-c0b8-40b8-b60a-c1772f319db3',
        'ChIJjx2JXt-EqkARpvIDxFFmThM',
        'The Neighbours (Sasedite)',
        'Motopista, bul. "Gotse Delchev" 102, вход А, 1404 Sofia, Bulgaria',
        42.66543780,
        23.30206530,
        '088 999 2200',
        NULL,
        NULL,
        '{food,meal_takeaway,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 10:00 PM","Tuesday: 10:30 AM – 10:00 PM","Wednesday: 10:30 AM – 10:00 PM","Thursday: 10:30 AM – 10:00 PM","Friday: 10:30 AM – 10:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:29.800Z',
        '2025-08-05T17:34:29.800Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '90b70cc1-f6a4-4deb-ab47-556a1b3663a7',
        'ChIJjVuZWW6FqkARitCWuAcK9ic',
        'Ramada by Wyndham Sofia City Center',
        'Sofia Center, bul. "Knyaginya Maria Luiza" 131, 1202 Sofia, Bulgaria',
        42.70822940,
        23.32213960,
        '02 933 8888',
        'https://www.wyndhamhotels.com/ramada/sofia-bulgaria/ramada-sofia-city-center/overview?CID=LC:wmcic5n98gs1g0r:47657&iata=00093796',
        NULL,
        '{point_of_interest,establishment,lodging}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:22.719Z',
        '2025-08-05T17:34:22.719Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '90deb709-a7a6-46d9-a738-982c9c583d0f',
        'ChIJOT3dwxKFqkARNJr012O-Wpc',
        'Social Island 55',
        'Old City Center, bul. "Vitosha" 55, 1000 Sofia, Bulgaria',
        42.69088600,
        23.31985010,
        '088 589 1852',
        NULL,
        NULL,
        '{establishment,point_of_interest,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:20.239Z',
        '2025-08-05T17:34:20.239Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '90ef1dbc-4e40-47e0-973f-b0bb53c2d5a2',
        'ChIJv9mhQI6HqkARKOOL4f6OMG0',
        'Garam Masala Indian Restaurant Sofia',
        'M92Q+QGC, 7-Mi KilometarMladost, Boulevard "Tsarigradsko shose" 72, 1784 Sofia, Bulgaria',
        42.65191970,
        23.38866770,
        '088 923 6699',
        'https://www.garammasalasofia.com/',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:00 PM","Tuesday: 10:00 AM – 10:00 PM","Wednesday: 10:00 AM – 10:00 PM","Thursday: 10:00 AM – 10:00 PM","Friday: 10:00 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 10:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.438Z',
        '2025-08-05T17:34:35.438Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '91d1c6cd-4293-40ff-b264-4976f8a69d27',
        'ChIJXce1bnGFqkARkathCFQgdE0',
        'Cactus',
        'улица „Христо Белчев“ 20, Old City Center, Solunska Street 14, 1000 Sofia, Bulgaria',
        42.69271570,
        23.32111890,
        '089 785 4725',
        'http://www.cactus.bg/',
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:40.356Z',
        '2025-08-05T17:34:40.356Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '922a780a-709c-44b8-ace2-c78575d9eda5',
        'ChIJyWURl3uPqkARWuKD5WBlpTw',
        'Burger House',
        'Stefan Karadzha, ul. "Sopot" 31, 1510 Sofia, Bulgaria',
        42.70874450,
        23.35964850,
        '089 675 0450',
        'http://www.burgerhouse.online/',
        NULL,
        '{point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:00 PM","Tuesday: 10:00 AM – 10:00 PM","Wednesday: 10:00 AM – 10:00 PM","Thursday: 10:00 AM – 10:00 PM","Friday: 10:00 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 10:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:35.896Z',
        '2025-08-05T17:34:35.896Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '944de5a9-5151-4299-bbd0-7e3bb4d2b7ab',
        'ChIJPwLAiGyFqkARhNE-zl9vtIM',
        'The Sushi Bar',
        'Old City Center, ul. "Ivan Denkoglu" 18, 1000 Sofia, Bulgaria',
        42.69406570,
        23.31881770,
        '088 576 0176',
        'http://www.thesushibar.bg/',
        NULL,
        '{food,restaurant,establishment,point_of_interest,meal_takeaway}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:24.092Z',
        '2025-08-05T17:34:24.092Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '949d2a03-6471-47f2-9243-b7f7ddc6cb43',
        'ChIJO-HG6AyFqkARlOKfwxHo24s',
        'Divaka',
        'Old City Center, ul. "6-ti septemvri" 41А, 1000 Sofia, Bulgaria',
        42.68931520,
        23.32534310,
        '088 670 2996',
        'https://divaka.bg/%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82-%D0%B4%D0%B8%D0%B2%D0%B0%D0%BA%D0%B0/',
        NULL,
        '{point_of_interest,food,restaurant,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:14.607Z',
        '2025-08-05T17:34:14.607Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '94c90bb7-5404-479c-83ea-eaf6218c7168',
        'ChIJ-yvsDwyFqkART6ZRMsKtnn0',
        'Hotel Downtown',
        'Old City Center, bul. "Vasil Levski" 27А, 1040 Sofia, Bulgaria',
        42.68693830,
        23.32475480,
        '02 930 5200',
        'https://hoteldowntownsofia.com/',
        NULL,
        '{establishment,point_of_interest,lodging}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:22.915Z',
        '2025-08-05T17:34:22.915Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '952f0613-794b-4b56-b453-291872166830',
        'ChIJz0Wz-3KFqkARS2C7p0dgYhE',
        'Carrusel Club',
        'Old City Center, ulitsa „Georgi S. Rakovski“ 108, 1000 Sofia, Bulgaria',
        42.69246780,
        23.32629770,
        '087 707 8080',
        'https://carruselclub.com/',
        NULL,
        '{point_of_interest,night_club,establishment}',
        '{"periods":[{"open":{"day":4,"time":"2300"},"close":{"day":5,"time":"0600"}},{"open":{"day":5,"time":"2300"},"close":{"day":6,"time":"0600"}},{"open":{"day":6,"time":"2300"},"close":{"day":0,"time":"0600"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: 11:00 PM – 6:00 AM","Friday: 11:00 PM – 6:00 AM","Saturday: 11:00 PM – 6:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:25.860Z',
        '2025-08-05T17:34:25.860Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9560d42b-cf4b-4aec-a453-71440f772631',
        'ChIJn8afrg6FqkARUctySHFU3Dc',
        'DABOV Specialty Coffee Sofia 1',
        'Old City Center, ul. "Lyuben Karavelov" 58, 1142 Sofia, Bulgaria',
        42.68583670,
        23.32438690,
        '088 247 7000',
        'https://bg.dabov.coffee/',
        NULL,
        '{establishment,store,point_of_interest,cafe,food}',
        '{"periods":[{"open":{"day":0,"time":"0930"},"close":{"day":0,"time":"1730"}},{"open":{"day":1,"time":"0830"},"close":{"day":1,"time":"1830"}},{"open":{"day":2,"time":"0830"},"close":{"day":2,"time":"1830"}},{"open":{"day":3,"time":"0830"},"close":{"day":3,"time":"1830"}},{"open":{"day":4,"time":"0830"},"close":{"day":4,"time":"1830"}},{"open":{"day":5,"time":"0830"},"close":{"day":5,"time":"1830"}},{"open":{"day":6,"time":"0930"},"close":{"day":6,"time":"1730"}}],"open_now":true,"weekday_text":["Monday: 8:30 AM – 6:30 PM","Tuesday: 8:30 AM – 6:30 PM","Wednesday: 8:30 AM – 6:30 PM","Thursday: 8:30 AM – 6:30 PM","Friday: 8:30 AM – 6:30 PM","Saturday: 9:30 AM – 5:30 PM","Sunday: 9:30 AM – 5:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:22.459Z',
        '2025-08-05T17:34:22.459Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '958132de-4ef8-4949-9505-78c5f3555326',
        'ChIJrd3JOVKFqkARcOfHiRk3fkw',
        'Bar White',
        'Sveta Troitsa, Boulevard "Slivnitsa" 228, 1309 Sofia, Bulgaria',
        42.70784980,
        23.29897720,
        '088 708 8788',
        NULL,
        NULL,
        '{bar,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 11:00 PM","Tuesday: 8:00 AM – 11:00 PM","Wednesday: 8:00 AM – 11:00 PM","Thursday: 8:00 AM – 11:00 PM","Friday: 8:00 AM – 11:00 PM","Saturday: 8:00 AM – 11:00 PM","Sunday: 8:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:26.122Z',
        '2025-08-05T17:34:26.122Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '95be39b2-323e-450f-abca-cf51181bbd9d',
        'ChIJrWECp7KHqkARzI6l70lEr0U',
        'SUSHI SMILEFOOD Bulgaria',
        'Pette Kyosheta, ul. "Pirotska" 52, 1303 Sofia, Bulgaria',
        42.70061500,
        23.31427060,
        '088 600 6549',
        'https://sushi.smilefood.bg/',
        NULL,
        '{food,establishment,meal_delivery,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:30.393Z',
        '2025-08-05T17:34:30.393Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '963bbbb1-1d28-4dd2-86c2-afd2527ae16f',
        'ChIJD027T5iFqkARyV5VRX3VHCw',
        'Restaurant Victoria Ivan Asen',
        'g.k. Yavorov, ul. "Tsar Ivan Asen II" 66, 1124 Sofia, Bulgaria',
        42.68815770,
        23.34559230,
        '088 863 1282',
        'https://www.victoria.bg/bg/restaurants/sofiya/restorant-victoria-ivan-asen/',
        NULL,
        '{point_of_interest,food,restaurant,meal_takeaway,meal_delivery,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:20.631Z',
        '2025-08-05T17:34:20.631Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9696a539-17df-44d6-81d6-8b9aad50be5a',
        'ChIJeXHe-wqFqkAR3GJrUuWeTL0',
        'Restorant Djani',
        'Sofia, Lyuben Karavelov St 17, Old City Center, 1142 Sofia, Bulgaria',
        42.68755150,
        23.33041410,
        '02 986 4876',
        NULL,
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 11:00 PM","Tuesday: 9:00 AM – 11:00 PM","Wednesday: 9:00 AM – 11:00 PM","Thursday: 9:00 AM – 11:00 PM","Friday: 9:00 AM – 11:00 PM","Saturday: 10:30 AM – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:20.828Z',
        '2025-08-05T17:34:20.828Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '974aa424-66c0-4e8c-ab12-0b1a829541f9',
        'ChIJv7rJxwCFqkARGFdjoKB4hvs',
        'Cleopatra Erotic Bar / Клеопатра Еротик Бар',
        'g.k. Lozenets, Blvd. "Cherni vrah" 25, 1421 Sofia, Bulgaria',
        42.67774250,
        23.32215380,
        '087 620 9909',
        'https://cleopatra-bg.com/contact/',
        NULL,
        '{bar,night_club,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"2200"},"close":{"day":1,"time":"0500"}},{"open":{"day":1,"time":"2200"},"close":{"day":2,"time":"0500"}},{"open":{"day":2,"time":"2200"},"close":{"day":3,"time":"0500"}},{"open":{"day":3,"time":"2200"},"close":{"day":4,"time":"0500"}},{"open":{"day":4,"time":"2200"},"close":{"day":5,"time":"0500"}},{"open":{"day":5,"time":"2200"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"2200"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: 10:00 PM – 5:00 AM","Tuesday: 10:00 PM – 5:00 AM","Wednesday: 10:00 PM – 5:00 AM","Thursday: 10:00 PM – 5:00 AM","Friday: 10:00 PM – 5:00 AM","Saturday: 10:00 PM – 5:00 AM","Sunday: 10:00 PM – 5:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:38.782Z',
        '2025-08-05T17:34:38.782Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '97e09c65-771e-4b38-a8a8-53473a0e6aaa',
        'ChIJDXx082uFqkARbwOkEsS9mfw',
        'Radi''s Apartments',
        'Old City Center, ul. "Knyaz Boris I" 114, 1000 Sofia, Bulgaria',
        42.69572050,
        23.31866760,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:19.979Z',
        '2025-08-05T17:34:19.979Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '98a40ac6-05cc-44b0-85aa-7a40a815f471',
        'ChIJ2e8m946FqkAR-2Y7-cFaajE',
        'Simple Food Punkt',
        'Old City Center, ul. "William Gladstone" 18, 1000 Sofia, Bulgaria',
        42.69189180,
        23.31726760,
        '089 594 9407',
        'https://m.facebook.com/Simple.Food.Punkt/',
        NULL,
        '{establishment,point_of_interest,restaurant,meal_takeaway,food}',
        '{"periods":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 6:00 PM","Tuesday: 11:00 AM – 6:00 PM","Wednesday: 11:00 AM – 6:00 PM","Thursday: 11:00 AM – 6:00 PM","Friday: 11:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.174Z',
        '2025-08-05T17:34:35.174Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '992fccb8-ca5c-4d94-852d-27983a106717',
        'ChIJUQqk3mOZqkARvae-ZieDZBw',
        'Ресторант Жеравна',
        '1320 Bankya, Bulgaria',
        42.70842360,
        23.14574110,
        NULL,
        NULL,
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 10:00 PM","Tuesday: 9:00 AM – 10:00 PM","Wednesday: 9:00 AM – 10:00 PM","Thursday: 9:00 AM – 10:00 PM","Friday: 9:00 AM – 10:00 PM","Saturday: 9:00 AM – 10:00 PM","Sunday: 9:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:27.237Z',
        '2025-08-05T17:34:27.237Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9979e591-6a1b-484d-9807-783d09178737',
        'ChIJt3McoymFqkARXb_mcC6h3XA',
        'rCurry Sri Lankan Restaurant',
        'Old City Center, ul. "Stefan Karadzha" 11Б, 1000 Sofia, Bulgaria',
        42.69178270,
        23.32675350,
        '088 882 6677',
        'http://rcurry.net/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:00 PM","Tuesday: 11:30 AM – 10:00 PM","Wednesday: 11:30 AM – 10:00 PM","Thursday: 11:30 AM – 10:00 PM","Friday: 11:30 AM – 10:00 PM","Saturday: 11:30 AM – 10:00 PM","Sunday: 11:30 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.503Z',
        '2025-08-05T17:34:35.503Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9d5d6da6-9db2-4c3b-aa5a-6fa0de28192b',
        'ChIJZUpGCWaFqkARW-HbGEYeHNs',
        'Locanda di Serdika',
        'Sofia Center, ul. "Tsar Simeon" 82, 1202 Sofia, Bulgaria',
        42.70120160,
        23.32340810,
        '089 664 4919',
        'https://www.facebook.com/share/1Ei6LvQhik/',
        NULL,
        '{point_of_interest,establishment,restaurant,food}',
        '{"periods":[{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"1500"}},{"open":{"day":2,"time":"1800"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"1500"}},{"open":{"day":3,"time":"1800"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"1500"}},{"open":{"day":4,"time":"1800"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"1500"}},{"open":{"day":5,"time":"1800"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"1500"}},{"open":{"day":6,"time":"1800"},"close":{"day":6,"time":"2300"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: 12:00 – 3:00 PM, 6:00 – 11:00 PM","Wednesday: 12:00 – 3:00 PM, 6:00 – 11:00 PM","Thursday: 12:00 – 3:00 PM, 6:00 – 11:00 PM","Friday: 12:00 – 3:00 PM, 6:00 – 11:00 PM","Saturday: 12:00 – 3:00 PM, 6:00 – 11:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.80,
        false,
        '2025-08-05T17:34:38.261Z',
        '2025-08-05T17:34:38.261Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9d6ea75d-780e-42bd-8395-2eea129c869e',
        'ChIJ9VbemVeFqkARZRKfe2D2QRk',
        'Site Bulgari Zaedno',
        'g.k. Banishora, бул. „Генерал Николай Г. Столетов“ 37, 1233 Sofia, Bulgaria',
        42.71117020,
        23.30975810,
        '02 931 5161',
        'https://www.sitebulgarizaedno.com/index.php?option=com_content&view=article&id=22&Itemid=29',
        NULL,
        '{food,restaurant,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1130"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1130"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1130"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1130"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1130"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1130"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 12:00 AM","Tuesday: 11:30 AM – 12:00 AM","Wednesday: 11:30 AM – 12:00 AM","Thursday: 11:30 AM – 12:00 AM","Friday: 11:30 AM – 12:00 AM","Saturday: 11:30 AM – 12:00 AM","Sunday: 11:30 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.90,
        false,
        '2025-08-05T17:34:19.585Z',
        '2025-08-05T17:34:19.585Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9de21e36-3627-4c2f-af16-a933cc095909',
        'ChIJWUvR3wyFqkARlHB-lRGlyGA',
        'Halbite Beer Hall',
        'Old City Center, ul. "Neofit Rilski" 72, 1000 Sofia, Bulgaria',
        42.68970240,
        23.32473640,
        '087 873 7786',
        'https://www.halbite.com/',
        NULL,
        '{bar,point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":1,"time":"1000"}},{"open":{"day":1,"time":"1100"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1100"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1100"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1100"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1100"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 12:00 AM","Tuesday: 11:00 AM – 12:00 AM","Wednesday: 11:00 AM – 12:00 AM","Thursday: 11:00 AM – 12:00 AM","Friday: 11:00 AM – 12:00 AM","Saturday: 11:00 AM – 12:00 AM","Sunday: 11:00 AM – 10:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:14.999Z',
        '2025-08-05T17:34:14.999Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9f1a38d4-7ef7-48f6-a90e-0e030c119907',
        'ChIJNXmMLQ6FqkAR6uGT_xsX9Rs',
        'Royal Sofia Club',
        'Ndk, bul. "Vitosha" 104, 1463 Sofia, Bulgaria',
        42.68598380,
        23.31723020,
        '088 512 2222',
        NULL,
        NULL,
        '{point_of_interest,night_club,establishment}',
        '{"periods":[{"open":{"day":2,"time":"2200"},"close":{"day":3,"time":"0500"}},{"open":{"day":3,"time":"2200"},"close":{"day":4,"time":"0500"}},{"open":{"day":4,"time":"2200"},"close":{"day":5,"time":"0500"}},{"open":{"day":5,"time":"2200"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"2200"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: 10:00 PM – 5:00 AM","Wednesday: 10:00 PM – 5:00 AM","Thursday: 10:00 PM – 5:00 AM","Friday: 10:00 PM – 5:00 AM","Saturday: 10:00 PM – 5:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:26.649Z',
        '2025-08-05T17:34:26.649Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '9fbef00b-e52d-4cfe-b62f-f1d7f8ff0e27',
        'ChIJwWsTKQGFqkARTv-r9QaXa_k',
        'Casa De Cuba',
        'g.k. Lozenets, ul. "Tsvetna Gradina" 1, 1421 Sofia, Bulgaria',
        42.67737790,
        23.32083520,
        '088 545 5633',
        NULL,
        NULL,
        '{point_of_interest,establishment,bar}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"0900"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"0900"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"0900"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"0900"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"0900"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 12:00 AM","Tuesday: 9:00 AM – 12:00 AM","Wednesday: 9:00 AM – 12:00 AM","Thursday: 9:00 AM – 12:00 AM","Friday: 9:00 AM – 12:00 AM","Saturday: 9:00 AM – 12:00 AM","Sunday: 9:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.20,
        false,
        '2025-08-05T17:34:25.991Z',
        '2025-08-05T17:34:25.991Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a057d592-6b2e-47d3-9650-c1b859b505e7',
        'ChIJneQKZ4-aqkARTj23q54mh38',
        'KFC ЛЮЛИН',
        'ж.к. Люлин 7, bul. "Jawaharlal Neru", 1324 Sofia, Bulgaria',
        42.71461170,
        23.25999280,
        '0700 11 999',
        'https://kfc.bg/',
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:18.406Z',
        '2025-08-05T17:34:18.406Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a0a2e3e5-f268-4716-9354-84604ae4e752',
        'ChIJ6QxCNm2FqkARlInwWCEy2m4',
        'Chucky''s Coffee House',
        'Sofia Center, ul. "Hristo Belchev" 29, 1000 Sofia, Bulgaria',
        42.69184790,
        23.32103530,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:25.206Z',
        '2025-08-05T17:34:25.206Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a0f6abf8-0553-4da6-a926-d46347b4f14d',
        'ChIJo7k3AmyFqkARVrl5araOjw0',
        'Rocentro Hotel',
        'Sofia Center, pl. "Vazrazhdane" 2, 1000 Sofia, Bulgaria',
        42.69717330,
        23.31478620,
        '02 986 0939',
        'https://centralplazahotel.bg/',
        NULL,
        '{lodging,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.023Z',
        '2025-08-05T17:34:21.023Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a14146c7-fc40-451d-bd78-86d41ad2e3c3',
        'ChIJf1fJhWiFqkARmQ6JhQP6BIM',
        'Scotty''s Boutique Hotel',
        'Old City Center, ul. "Ekzarh Yosif" 11, 1000 Sofia, Bulgaria',
        42.70064120,
        23.32061970,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:16.961Z',
        '2025-08-05T17:34:16.961Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a1f7d63b-a36d-4f5f-81d1-3a9f69d3ce14',
        'ChIJpc7dgW-FqkARfbejnjZ7b0A',
        'Felicità',
        'Sofia Center, ul. "Iskar" 11, 1000 Sofia, Bulgaria',
        42.69965010,
        23.32620650,
        '088 612 1999',
        NULL,
        NULL,
        '{point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:31.504Z',
        '2025-08-05T17:34:31.504Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a30f6063-ffb0-4a67-a808-2af8e0230c1a',
        'ChIJjTH59zSFqkARCRuUwDMYJdU',
        'BKP Bakery',
        'ж.к. Разсадника - Коньовица, bul. "Vardar" 26, 1330 Sofia, Bulgaria',
        42.69607110,
        23.28744260,
        '02 442 1111',
        NULL,
        NULL,
        '{restaurant,establishment,meal_delivery,point_of_interest,food}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:29.931Z',
        '2025-08-05T17:34:29.931Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a3618833-1906-4a1b-a302-d8872e0048b1',
        'ChIJpWizqnKFqkARcvZMLoGGfMA',
        'Divaka',
        'Old City Center, ul. "William Gladstone" 54, 1000 Sofia, Bulgaria',
        42.69125330,
        23.32248390,
        '088 744 0011',
        'https://divaka.bg/%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82-%D0%B4%D0%B8%D0%B2%D0%B0%D0%BA%D0%B0/',
        NULL,
        '{point_of_interest,establishment,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 11:00 PM","Tuesday: 11:30 AM – 11:00 PM","Wednesday: 11:30 AM – 11:00 PM","Thursday: 11:30 AM – 11:00 PM","Friday: 11:30 AM – 11:00 PM","Saturday: 11:30 AM – 11:00 PM","Sunday: 11:30 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:14.739Z',
        '2025-08-05T17:34:14.739Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a367bcc0-8399-4541-af75-f01d3dce88c7',
        'ChIJZa_edjyEqkAR2eWIbEjG4d0',
        'CLUB 35',
        'Блок 35, Studentski Kompleks, ул. „Йордан Йосифов“, 1700 Sofia, Bulgaria',
        42.65401570,
        23.34315860,
        '088 490 0016',
        'http://club35.bg/',
        NULL,
        '{point_of_interest,establishment,bar,store,cafe,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":1,"time":"0300"}},{"open":{"day":1,"time":"0900"},"close":{"day":2,"time":"0300"}},{"open":{"day":2,"time":"0900"},"close":{"day":3,"time":"0300"}},{"open":{"day":3,"time":"0900"},"close":{"day":4,"time":"0300"}},{"open":{"day":4,"time":"0900"},"close":{"day":5,"time":"0300"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0300"}},{"open":{"day":6,"time":"0900"},"close":{"day":0,"time":"0300"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 3:00 AM","Tuesday: 9:00 AM – 3:00 AM","Wednesday: 9:00 AM – 3:00 AM","Thursday: 9:00 AM – 3:00 AM","Friday: 9:00 AM – 3:00 AM","Saturday: 9:00 AM – 3:00 AM","Sunday: 9:00 AM – 3:00 AM"]}',
        '{}',
        NULL,
        NULL,
        4.00,
        false,
        '2025-08-05T17:34:39.700Z',
        '2025-08-05T17:34:39.700Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a39af5c0-bb66-4fe2-afb5-2e0124f3b645',
        'ChIJIdMRsHqFqkARtc36QzC-ewU',
        'Зоната на МАМА - шоколад и вино',
        'g.k. Lozenets, ul. "Krichim" 22, 1407 Sofia, Bulgaria',
        42.67032970,
        23.32426610,
        '087 833 2447',
        NULL,
        NULL,
        '{point_of_interest,restaurant,convenience_store,store,meal_delivery,establishment,food}',
        '{"periods":[{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 8:00 PM","Tuesday: 9:00 AM – 8:00 PM","Wednesday: 9:00 AM – 8:00 PM","Thursday: 9:00 AM – 8:00 PM","Friday: 9:00 AM – 8:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:31.244Z',
        '2025-08-05T17:34:31.244Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a3b13a7a-72f7-48bb-8788-29198d48116f',
        'ChIJ6fEEIHCFqkAR_8S_-A9Q-NE',
        'Магнито',
        'Sofia Center, ul. Lege 8, 1000 Sofia, Bulgaria',
        42.69564620,
        23.32386000,
        '088 814 4777',
        'http://www.magnito.bg/',
        NULL,
        '{point_of_interest,establishment,bar}',
        '{"periods":[{"open":{"day":4,"time":"2200"},"close":{"day":5,"time":"0500"}},{"open":{"day":5,"time":"2200"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"2200"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: 10:00 PM – 5:00 AM","Friday: 10:00 PM – 5:00 AM","Saturday: 10:00 PM – 5:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.90,
        false,
        '2025-08-05T17:34:25.729Z',
        '2025-08-05T17:34:25.729Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a42619c3-5da1-4ecc-bf05-a4e31c950276',
        'ChIJ_03EkmyFqkARJbsFc1bM1uA',
        'Kubcheto',
        'Sofia Center, ul. "Tsar Asen" 14, 1000 Sofia, Bulgaria',
        42.69365310,
        23.31912410,
        '089 541 4868',
        'https://www.facebook.com/kubcheto.friends',
        NULL,
        '{bar,point_of_interest,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:15.196Z',
        '2025-08-05T17:34:15.196Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a4cf1473-bc9d-4c59-ae8f-61071b7cae93',
        'ChIJfTQA6GaFqkAROBzY6XVQwBo',
        'Shawarma Algafari',
        'Sofia Center, bul. "Knyaginya Maria Luiza" 52, 1202 Sofia, Bulgaria',
        42.70387090,
        23.32372820,
        '087 750 8855',
        'http://www.facebook.com/Shawarmaalgafari/',
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":1,"time":"0200"}},{"open":{"day":1,"time":"0900"},"close":{"day":2,"time":"0400"}},{"open":{"day":2,"time":"0900"},"close":{"day":3,"time":"0400"}},{"open":{"day":3,"time":"0900"},"close":{"day":4,"time":"0400"}},{"open":{"day":4,"time":"0900"},"close":{"day":5,"time":"0400"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0400"}},{"open":{"day":6,"time":"0900"},"close":{"day":0,"time":"0400"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 4:00 AM","Tuesday: 9:00 AM – 4:00 AM","Wednesday: 9:00 AM – 4:00 AM","Thursday: 9:00 AM – 4:00 AM","Friday: 9:00 AM – 4:00 AM","Saturday: 9:00 AM – 4:00 AM","Sunday: 9:00 AM – 2:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.80,
        false,
        '2025-08-05T17:34:13.738Z',
        '2025-08-05T17:34:13.738Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a5d65a76-d490-46b8-984e-71d28bcaa78c',
        'ChIJF2KcHkmFqkARQGwsSUqtavA',
        'Da Nino Pizza & Food',
        'Old City Center, ул. „Алабин И. Вл.“ 46, 1000 Sofia, Bulgaria',
        42.69489980,
        23.32055380,
        '089 433 6551',
        'https://daninopizza.com/',
        NULL,
        '{meal_takeaway,food,point_of_interest,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 10:30 PM","Tuesday: 10:30 AM – 10:30 PM","Wednesday: 10:30 AM – 10:30 PM","Thursday: 10:30 AM – 10:30 PM","Friday: 10:30 AM – 10:30 PM","Saturday: 10:30 AM – 10:30 PM","Sunday: 10:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:37.542Z',
        '2025-08-05T17:34:37.542Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a63a2dc8-6c79-4fd8-92f7-0105ca1a9654',
        'ChIJ4cQ28aOFqkARNGDsvdzgzh8',
        '&hlyab (&bread)',
        'Old City Center, ul. "Ekzarh Yosif" 69, 1000 Sofia, Bulgaria',
        42.70065550,
        23.32822080,
        NULL,
        'https://www.andbread.bg/',
        NULL,
        '{point_of_interest,store,bakery,food,establishment}',
        '{"periods":[{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: Closed","Tuesday: 9:00 AM – 7:00 PM","Wednesday: 9:00 AM – 7:00 PM","Thursday: 9:00 AM – 7:00 PM","Friday: 9:00 AM – 7:00 PM","Saturday: 9:00 AM – 5:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:34.384Z',
        '2025-08-05T17:34:34.384Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a663a11a-6cd3-4cce-94ba-80ff318ae1c8',
        'ChIJG-VNnQ2FqkAR0ZeDadj8kA0',
        'Agarta',
        'Sofia Center, ul. "Han Asparuh" 36, 1000 Sofia, Bulgaria',
        42.68938830,
        23.32156150,
        '088 863 0951',
        NULL,
        NULL,
        '{food,establishment,restaurant,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:20.044Z',
        '2025-08-05T17:34:20.044Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a6e7e427-6569-46ad-881b-92d5f5a6d1ad',
        'ChIJc4YB2RCPqkARRPp8FyO7l6k',
        'Insomnia Pizza - Инсомния Хаджи Димитър',
        'ul. "Rezbarska" 3, 1510 Sofia, Bulgaria',
        42.71008870,
        23.34604300,
        '089 426 0055',
        'https://www.insomnia.pizza/',
        NULL,
        '{food,meal_delivery,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1900"},"close":{"day":1,"time":"0500"}},{"open":{"day":1,"time":"1900"},"close":{"day":2,"time":"0500"}},{"open":{"day":2,"time":"1900"},"close":{"day":3,"time":"0500"}},{"open":{"day":3,"time":"1900"},"close":{"day":4,"time":"0500"}},{"open":{"day":4,"time":"1900"},"close":{"day":5,"time":"0500"}},{"open":{"day":5,"time":"1900"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"1900"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: 7:00 PM – 5:00 AM","Tuesday: 7:00 PM – 5:00 AM","Wednesday: 7:00 PM – 5:00 AM","Thursday: 7:00 PM – 5:00 AM","Friday: 7:00 PM – 5:00 AM","Saturday: 7:00 PM – 5:00 AM","Sunday: 7:00 PM – 5:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:27.956Z',
        '2025-08-05T17:34:27.956Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a776b789-edf7-42ed-a37a-46210dcafd26',
        'ChIJoa671m2FqkARtIafbl6UdRQ',
        'Hotel Rila Sofia',
        'Sofia Center, ul. "Tsar Kaloyan" 6, 1000 Sofia, Bulgaria',
        42.69556060,
        23.32307080,
        '088 479 7969',
        'http://www.hotelrila.bg/',
        NULL,
        '{establishment,point_of_interest,lodging}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:22.133Z',
        '2025-08-05T17:34:22.133Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a7ca4128-d18c-489f-9a8e-f1cc23a077bd',
        'ChIJyz5tw26FqkARQpE_yzblOqg',
        'St. George Hotel',
        'Old City Center, ul. "Knyaz Boris I" 64, 1463 Sofia, Bulgaria',
        42.69033870,
        23.31704050,
        '02 465 0130',
        'http://www.stgeorge-bg.com/',
        NULL,
        '{lodging,point_of_interest,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:17.222Z',
        '2025-08-05T17:34:17.222Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a89f9045-b771-46af-97d9-82c783c0edab',
        'ChIJS3mVXOqFqkARVS4KbFdJE5I',
        'Ribs&Sticks Гео Милев',
        'Geo Milev, ul. "Boris Hristov" 20, 1574 Sofia, Bulgaria',
        42.68480100,
        23.35625930,
        '087 687 6059',
        'https://ribsandsticks.bg/',
        NULL,
        '{point_of_interest,restaurant,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:00 PM","Tuesday: 11:30 AM – 10:00 PM","Wednesday: 11:30 AM – 10:00 PM","Thursday: 11:30 AM – 10:00 PM","Friday: 11:30 AM – 10:00 PM","Saturday: 11:30 AM – 10:00 PM","Sunday: 11:30 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:35.962Z',
        '2025-08-05T17:34:35.962Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a8d148ad-3c53-438b-946e-8755364136e8',
        'ChIJZ8BNJtqFqkARD-9t1ix36Mo',
        'Osteria Tartufo - Shipka',
        'Sofia Center, Shipka Street 11, 1504 Sofia, Bulgaria',
        42.69346860,
        23.34041310,
        '089 324 2400',
        'https://osteriatartufo.com/',
        NULL,
        '{point_of_interest,food,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:32.617Z',
        '2025-08-05T17:34:32.617Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'a9c8a7c5-51d4-4ec0-b069-fd66eb6c85ee',
        'ChIJdRaAIF6FqkAR3CvTSVWxC0A',
        'Hotel Favorit',
        'Sofia Center, ul. "Knyaz Boris I" 193, 1202 Sofia, Bulgaria',
        42.70686100,
        23.32171700,
        '088 585 8985',
        'https://www.hotelfavorit.bg/',
        NULL,
        '{lodging,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:36.094Z',
        '2025-08-05T17:34:36.094Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'aa4f187a-0965-4ec9-b695-aad467796981',
        'ChIJ5VEOrCqFqkAR1cjQoKPG59s',
        'Chickeno',
        'Old City Center, ul. "Stara Planina" 3, 1000 Sofia, Bulgaria',
        42.69852000,
        23.33037000,
        '088 880 0486',
        NULL,
        NULL,
        '{establishment,point_of_interest,food,meal_takeaway,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2030"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2030"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2030"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2030"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2030"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 8:30 PM","Tuesday: 9:00 AM – 8:30 PM","Wednesday: 9:00 AM – 8:30 PM","Thursday: 9:00 AM – 8:30 PM","Friday: 9:00 AM – 8:30 PM","Saturday: 11:00 AM – 8:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.70,
        false,
        '2025-08-05T17:34:33.405Z',
        '2025-08-05T17:34:33.405Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ab6aba55-2aa3-43b8-964f-6e119901933c',
        'ChIJDxaoaO6FqkARgXLA--MyZ5Q',
        'Raw & More',
        'Doctor''s Garden, San Stefano St 9, 1504 Sofia, Bulgaria',
        42.69557800,
        23.34002900,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:35.045Z',
        '2025-08-05T17:34:35.045Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'aba7bda3-d012-4158-a58b-6bb11965dc3a',
        'ChIJtX2Y5AqFqkARNFKgMurssoU',
        'Red Coffee & Restorante',
        'Old City Center, ul. "Lyuben Karavelov" 15, 1142 Sofia, Bulgaria',
        42.68768590,
        23.33067900,
        '02 981 8718',
        NULL,
        NULL,
        '{point_of_interest,cafe,store,food,establishment,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"1030"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1030"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1030"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1030"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1030"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 10:30 AM – 11:00 PM","Tuesday: 10:30 AM – 11:00 PM","Wednesday: 10:30 AM – 11:00 PM","Thursday: 10:30 AM – 11:00 PM","Friday: 10:30 AM – 11:00 PM","Saturday: 10:30 AM – 11:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.80,
        false,
        '2025-08-05T17:34:29.407Z',
        '2025-08-05T17:34:29.407Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'abf938d8-7440-4b38-bd33-31ba5d41ae6f',
        'ChIJ1wft4ReEqkARES718xUUYfk',
        'Saffron Indian Restaurant',
        'София, Ул. Франсоа Митеран,до Блок 42б, Studentski Kompleks, 1700 Sofia, Bulgaria',
        42.64977010,
        23.33924000,
        '087 633 8370',
        'https://saffron-bg.com/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        6.30,
        false,
        '2025-08-05T17:34:19.323Z',
        '2025-08-05T17:34:19.323Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ac0e4d14-e7d2-4886-9d75-d93f318ae53b',
        'ChIJyz5tw26FqkAR04X87fnZXWQ',
        'Two Lions - Dvata Luva Restaurant',
        'ж.к. Красно село, bul. "Gotse Delchev" 48, 1680 Sofia, Bulgaria',
        42.67502560,
        23.28973650,
        '089 792 3427',
        'http://dvataluva.bg/',
        NULL,
        '{meal_takeaway,restaurant,food,establishment,meal_delivery,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:30 PM","Tuesday: 12:00 – 10:30 PM","Wednesday: 12:00 – 10:30 PM","Thursday: 12:00 – 10:30 PM","Friday: 12:00 – 10:30 PM","Saturday: 12:00 – 10:30 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:24.288Z',
        '2025-08-05T17:34:24.288Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ad0523aa-5750-4c56-a2bd-55a617167e73',
        'ChIJOdpKr2iFqkARTo_vF5EErb4',
        'Introvert Maria Luisa',
        '29 "Knyaginya, Sofia Center, bul. "Knyaginya Maria Luiza", 1000 Sofia, Bulgaria',
        42.70052650,
        23.32222690,
        '088 535 5688',
        'http://introverthotels.com/',
        NULL,
        '{lodging,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:22.328Z',
        '2025-08-05T17:34:22.328Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ae3fdcd8-0c5c-486a-9e09-13bc8de66347',
        'ChIJS_q1t4uGqkARMx9yP8w4NKA',
        'ATM Center Hotel',
        'Tsarigradsko Shosse 131, Sofia 1784, 7-Mi Kilometar, 1784 Sofia, Bulgaria',
        42.65633160,
        23.38807890,
        '02 965 8481',
        'http://www.atm-hotel.com/',
        NULL,
        '{point_of_interest,restaurant,bar,lodging,food,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.20,
        false,
        '2025-08-05T17:34:18.275Z',
        '2025-08-05T17:34:18.275Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'aeb4813f-7398-482b-93c0-dc8e3c7fa55c',
        'ChIJgbsAzJOGqkARkP2j0nFCLg4',
        'Pizza Best',
        'ж.к. Младост 1А 510, ж.к. Младост 1АMladost, 1729 Sofia, Bulgaria',
        42.64882540,
        23.38038050,
        '02 974 3058',
        NULL,
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:18.864Z',
        '2025-08-05T17:34:18.864Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'af2445c9-f9c6-4c41-8402-82ffc48e3c55',
        'ChIJPeuxby-FqkARrsXYVo0BhLs',
        '33 Waffles and Pancakes (Sofia) - 33 Гофрети и палачинки Красно село',
        'ж.к. Белите брези, bul. "Gotse Delchev" 3, 1612 Sofia, Bulgaria',
        42.67813710,
        23.28602900,
        NULL,
        NULL,
        NULL,
        '{point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1100"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1100"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1100"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1100"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1100"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 12:00 AM","Tuesday: 11:00 AM – 12:00 AM","Wednesday: 11:00 AM – 12:00 AM","Thursday: 11:00 AM – 12:00 AM","Friday: 11:00 AM – 12:00 AM","Saturday: 11:00 AM – 12:00 AM","Sunday: 11:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:33.602Z',
        '2025-08-05T17:34:33.602Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'af320f9b-d714-437f-91e3-b0e586864d6f',
        'ChIJhRoupQeQqkAR9MfPJ7WXib8',
        'Kaufland',
        'g.k. Banishora, ul. "Skopie" 1, 1233 Sofia, Bulgaria',
        42.71103230,
        23.30246370,
        '0800 12 220',
        'https://www.kaufland.bg/?cid=BG:loc:google_1627538199456',
        NULL,
        '{establishment,point_of_interest,store,supermarket,bakery,grocery_or_supermarket,food}',
        '{"periods":[{"open":{"day":0,"time":"0700"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0700"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0700"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0700"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0700"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0700"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 10:00 PM","Tuesday: 7:00 AM – 10:00 PM","Wednesday: 7:00 AM – 10:00 PM","Thursday: 7:00 AM – 10:00 PM","Friday: 7:00 AM – 10:00 PM","Saturday: 7:00 AM – 10:00 PM","Sunday: 7:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:28.687Z',
        '2025-08-05T17:34:28.687Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'af8fbc1b-6ab5-4656-9cab-808c14ffbb64',
        'ChIJGxx0c22FqkAR0iI7KIzcUXw',
        'MEAT Gourmet Sandwiches and Burgers',
        'Old City Center, ul. "Angel Kanchev" 1, 1000 Sofia, Bulgaria',
        42.69322660,
        23.32253320,
        '088 707 8455',
        'https://www.facebook.com/MeatGourmetSandwichesAndBurgers/?ref=bookmarks',
        NULL,
        '{point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2130"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2130"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2130"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2130"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2130"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2130"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2130"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 9:30 PM","Tuesday: 12:00 – 9:30 PM","Wednesday: 12:00 – 9:30 PM","Thursday: 12:00 – 9:30 PM","Friday: 12:00 – 9:30 PM","Saturday: 12:00 – 9:30 PM","Sunday: 12:00 – 9:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:31.701Z',
        '2025-08-05T17:34:31.701Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'afc80602-ba81-46d6-852e-3aa1866df241',
        'ChIJQWEW9Y6FqkARCudwTR0_rMo',
        'café MaBaker',
        'Old City Center, bul. "Vitosha" 44, 1000 Sofia, Bulgaria',
        42.69095410,
        23.31931560,
        '089 567 8449',
        'https://mabaker.bg/catering/',
        NULL,
        '{store,establishment,bakery,food,point_of_interest,cafe}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 8:00 PM","Tuesday: 8:00 AM – 8:00 PM","Wednesday: 8:00 AM – 8:00 PM","Thursday: 8:00 AM – 8:00 PM","Friday: 8:00 AM – 8:00 PM","Saturday: 9:00 AM – 7:00 PM","Sunday: 9:00 AM – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:34.646Z',
        '2025-08-05T17:34:34.646Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'afe7557c-3fb9-4e10-8935-fb3cb88f501c',
        'ChIJ_Thm-2iFqkARe9cZcKBvgiI',
        'Edgy Veggy',
        'улица Уилям Гладстон, От страната на, Old City Center, ul. "Knyaz Boris I" 18Б, 1000 Sofia, Bulgaria',
        42.69181700,
        23.31720890,
        '087 733 3397',
        'http://www.edgyveggy-sofia.com/',
        NULL,
        '{restaurant,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 8:00 PM","Tuesday: 12:00 – 8:00 PM","Wednesday: 12:00 – 8:00 PM","Thursday: 12:00 – 8:00 PM","Friday: 12:00 – 8:00 PM","Saturday: 12:00 – 8:00 PM","Sunday: 12:00 – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        7.40,
        false,
        '2025-08-05T17:34:33.666Z',
        '2025-08-05T17:34:33.666Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b05e5ce4-0678-462b-a44b-393a3d300b57',
        'ChIJHyWYvA-FqkAREEQLPkQC_TU',
        'STIX Bar & Billiards',
        'National Palace of Culture, main underpass, Ndk, sq. "Bulgaria 1, 1463 Sofia, Bulgaria',
        42.68564130,
        23.31963180,
        '088 288 2082',
        'http://www.stix.bg/',
        NULL,
        '{bar,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0600"}},{"open":{"day":1,"time":"1000"},"close":{"day":2,"time":"0600"}},{"open":{"day":2,"time":"1000"},"close":{"day":3,"time":"0600"}},{"open":{"day":3,"time":"1000"},"close":{"day":4,"time":"0600"}},{"open":{"day":4,"time":"1000"},"close":{"day":5,"time":"0600"}},{"open":{"day":5,"time":"1000"},"close":{"day":6,"time":"0600"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0600"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 6:00 AM","Tuesday: 10:00 AM – 6:00 AM","Wednesday: 10:00 AM – 6:00 AM","Thursday: 10:00 AM – 6:00 AM","Friday: 10:00 AM – 6:00 AM","Saturday: 10:00 AM – 6:00 AM","Sunday: 10:00 AM – 6:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.60,
        false,
        '2025-08-05T17:34:25.926Z',
        '2025-08-05T17:34:25.926Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b063e9f2-cf5d-4c9c-aa56-b0cf06867862',
        'ChIJ0aCdmGWFqkARz7bPN_Dh4tI',
        'Barista Coffee and More',
        'str. 26-30, Old City Center, ul. "Bacho Kiro", 1000 Sofia, Bulgaria',
        42.70050960,
        23.32663980,
        '088 902 2011',
        NULL,
        NULL,
        '{establishment,food,point_of_interest,store,cafe}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"0730"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0730"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0730"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0730"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0730"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 7:30 AM – 8:00 PM","Tuesday: 7:30 AM – 8:00 PM","Wednesday: 7:30 AM – 8:00 PM","Thursday: 7:30 AM – 8:00 PM","Friday: 7:30 AM – 8:00 PM","Saturday: 8:00 AM – 8:00 PM","Sunday: 8:00 AM – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:23.306Z',
        '2025-08-05T17:34:23.306Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b0f378d4-e8f4-4a7e-91fb-ff9fa85ec025',
        'ChIJRRFFUQCFqkARI-dTR_gByPw',
        'Coffee Point & Bakery Lavele 18',
        'Sofia Center, ul. "Laveleye" 18, 1000 Sofia, Bulgaria',
        42.69671730,
        23.31935690,
        '088 806 4040',
        NULL,
        NULL,
        '{point_of_interest,food,establishment,bakery,store}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 6:00 PM","Tuesday: 8:00 AM – 6:00 PM","Wednesday: 8:00 AM – 6:00 PM","Thursday: 8:00 AM – 6:00 PM","Friday: 8:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:28.345Z',
        '2025-08-05T17:34:28.345Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b145e505-75d6-4256-acaa-b420a13915cd',
        'ChIJ5XPmbnGFqkAR8EneoFpInY0',
        'Chervilo',
        'Old City Center, bul. "Tsar Osvoboditel" 9, 1000 Sofia, Bulgaria',
        42.69499550,
        23.33039760,
        '088 811 1999',
        NULL,
        NULL,
        '{establishment,night_club,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:26.844Z',
        '2025-08-05T17:34:26.844Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b1616bff-98a9-43c5-a75f-5e6eb30b85a4',
        'ChIJVQEtKPyEqkAR5uahgbHuzqw',
        'Italiashop.bg',
        'Yuzhen Park, ul. "Tsvetna Gradina" 72, 1421 Sofia, Bulgaria',
        42.67162690,
        23.31290080,
        '0700 17 227',
        'http://italiashop.bg/',
        NULL,
        '{food,point_of_interest,cafe,establishment,store}',
        '{"periods":[{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 6:00 PM","Tuesday: 9:00 AM – 6:00 PM","Wednesday: 9:00 AM – 6:00 PM","Thursday: 9:00 AM – 6:00 PM","Friday: 9:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.60,
        false,
        '2025-08-05T17:34:22.980Z',
        '2025-08-05T17:34:22.980Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b31e4424-b630-406a-b2a8-9f0b6dc167fb',
        'ChIJtQ-wwQOFqkARSeb6sASQ4AE',
        'Burrata Italiana Shipka',
        'Doctor''s Garden, Shipka Street 34, 1504 Sofia, Bulgaria',
        42.69296000,
        23.34051750,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:32.878Z',
        '2025-08-05T17:34:32.878Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b36b399d-1aa2-4993-9ae6-3efaeea900bb',
        'ChIJzXtU4QyFqkARFoQ60233NF0',
        'Manastirska Magernitsa Restaurant',
        'Old City Center, ul. "Han Asparuh" 67, 1000 Sofia, Bulgaria',
        42.68934160,
        23.32458500,
        '089 994 9400',
        'http://www.magernitsa.com/',
        NULL,
        '{establishment,food,restaurant,point_of_interest,meal_delivery}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:14.213Z',
        '2025-08-05T17:34:14.213Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b43e0834-5b65-4f8c-a0df-5d0adc276485',
        'ChIJswmnEGmFqkARM_rL4ahD-PY',
        'SugarClub',
        'Old City Center, ul. "Knyaz Boris I" 121, 1000 Sofia, Bulgaria',
        42.69843550,
        23.31923580,
        '089 910 3617',
        'http://www.sugarclub.eu/',
        NULL,
        '{point_of_interest,establishment,night_club,bar}',
        '{"periods":[{"open":{"day":5,"time":"2300"},"close":{"day":6,"time":"0600"}},{"open":{"day":6,"time":"2300"},"close":{"day":0,"time":"0600"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: Closed","Friday: 11:00 PM – 6:00 AM","Saturday: 11:00 PM – 6:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:19.387Z',
        '2025-08-05T17:34:19.387Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b44b1449-f31b-46f2-b952-d0d4ddab9ad9',
        'ChIJv3ux2vKFqkARXiBtlwEoSvM',
        'Hell pizza&sandwiches',
        'Sofia Center, ul. "Knyaz Boris I" 99, 1000 Sofia, Bulgaria',
        42.69602840,
        23.31846830,
        '087 647 8055',
        NULL,
        NULL,
        '{point_of_interest,restaurant,establishment,meal_takeaway,food}',
        '{"periods":[{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"1830"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"1830"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"1830"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"1830"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"1830"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 6:30 PM","Tuesday: 10:00 AM – 6:30 PM","Wednesday: 10:00 AM – 6:30 PM","Thursday: 10:00 AM – 6:30 PM","Friday: 10:00 AM – 6:30 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:30.197Z',
        '2025-08-05T17:34:30.197Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b4cc90f2-bf02-4c55-97f0-f375b0fff6c6',
        'ChIJb7OkrAmFqkAR9GNPQpapBLE',
        'On The Spot',
        'Old City Center, bul. "Vitosha" 1, 1000 Sofia, Bulgaria',
        42.69566200,
        23.32123310,
        '087 700 3035',
        NULL,
        NULL,
        '{store,food,point_of_interest,bakery,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1930"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1930"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1930"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1930"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1930"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:30 PM","Tuesday: 8:00 AM – 7:30 PM","Wednesday: 8:00 AM – 7:30 PM","Thursday: 8:00 AM – 7:30 PM","Friday: 8:00 AM – 7:30 PM","Saturday: 11:00 AM – 6:00 PM","Sunday: 11:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:28.280Z',
        '2025-08-05T17:34:28.280Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b56c560e-60f3-4121-968f-654c78c0babe',
        'ChIJ6Z2dgXaFqkARdeM7U_55E9w',
        'Oborishte 63 Boutique Hotel',
        'Doctor''s Garden, ul. "Oborishte" 63, 1504 Sofia, Bulgaria',
        42.69441500,
        23.34549780,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:22.588Z',
        '2025-08-05T17:34:22.588Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b62f0d61-ac58-4f73-97e0-eb8e21704a4c',
        'ChIJHSP-9sWFqkARODO4MYXg-ms',
        'Altruist - Urban Coffee Shop & Bakery',
        'Old City Center, ul. "Ekzarh Yosif" 49, 1000 Sofia, Bulgaria',
        42.70036660,
        23.32513220,
        '088 627 0555',
        'http://altruist.bg/',
        NULL,
        '{store,food,cafe,bakery,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0700"},"close":{"day":0,"time":"1930"}},{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"1930"}},{"open":{"day":2,"time":"0700"},"close":{"day":2,"time":"1930"}},{"open":{"day":3,"time":"0700"},"close":{"day":3,"time":"1930"}},{"open":{"day":4,"time":"0700"},"close":{"day":4,"time":"1930"}},{"open":{"day":5,"time":"0700"},"close":{"day":5,"time":"1930"}},{"open":{"day":6,"time":"0700"},"close":{"day":6,"time":"1930"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 7:30 PM","Tuesday: 7:00 AM – 7:30 PM","Wednesday: 7:00 AM – 7:30 PM","Thursday: 7:00 AM – 7:30 PM","Friday: 7:00 AM – 7:30 PM","Saturday: 7:00 AM – 7:30 PM","Sunday: 7:00 AM – 7:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:33.927Z',
        '2025-08-05T17:34:33.927Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b6398b5f-31fa-429a-ad64-facd2fc33647',
        'ChIJ-84JbjmFqkARCCGar4qtvd4',
        '369 Specialty Coffee + Bakery',
        'Old City Center, bul. "Patriarh Evtimiy" 11, 1142 Sofia, Bulgaria',
        42.68809120,
        23.32666870,
        NULL,
        'https://www.instagram.com/369specialtycoffee/',
        NULL,
        '{store,food,cafe,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"1730"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"1730"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"1730"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"1730"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"1730"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 5:30 PM","Tuesday: 9:00 AM – 5:30 PM","Wednesday: 9:00 AM – 5:30 PM","Thursday: 9:00 AM – 5:30 PM","Friday: 9:00 AM – 5:30 PM","Saturday: 9:00 AM – 7:00 PM","Sunday: 9:00 AM – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.20,
        false,
        '2025-08-05T17:34:34.189Z',
        '2025-08-05T17:34:34.189Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b75fc007-606d-4bd3-b8ef-7de66d5255f7',
        'ChIJr8M4IhOFqkARvfNDYRJn3ns',
        'Black Label Coffee House and Bakery',
        'Old City Center, ul. "Han Asparuh" 13, 1000 Sofia, Bulgaria',
        42.69023360,
        23.31543220,
        NULL,
        'https://www.facebook.com/blacklabelcoffeehouseandbakery/',
        NULL,
        '{establishment,store,cafe,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1930"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1930"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1930"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1930"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1930"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1930"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:30 PM","Tuesday: 8:00 AM – 7:30 PM","Wednesday: 8:00 AM – 7:30 PM","Thursday: 8:00 AM – 7:30 PM","Friday: 8:00 AM – 7:30 PM","Saturday: 8:00 AM – 7:30 PM","Sunday: 9:00 AM – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:33.993Z',
        '2025-08-05T17:34:33.993Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b77ad05c-ba5a-4168-b58c-1f6e3eaf0dfb',
        'ChIJDRoTbkKFqkAR26Wy4-UrXmM',
        'Hotel Anel',
        'Pette Kyosheta, bul. "Todor Alexandrov" 14, 1303 Sofia, Bulgaria',
        42.69932760,
        23.31429290,
        '02 911 9900',
        'https://www.hotelanel.com/',
        NULL,
        '{lodging,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.219Z',
        '2025-08-05T17:34:21.219Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b7aa79d2-1169-45d1-a0b3-22afb5a2e42c',
        'ChIJa2wrRPaPqkARL2AQ2K5wacE',
        'Mehana Sofia',
        'Tsentralna Zhp Gara, bul. "Knyaginya Maria Luiza" 106, 1233 Sofia, Bulgaria',
        42.71286290,
        23.31735440,
        '087 810 5627',
        'https://mehanasofia.bg/',
        NULL,
        '{bar,establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1600"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"1600"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"1600"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"1600"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1700"},"close":{"day":0,"time":"0000"}}],"open_now":false,"weekday_text":["Monday: 11:00 AM – 4:00 PM","Tuesday: 11:00 AM – 4:00 PM","Wednesday: 11:00 AM – 4:00 PM","Thursday: 11:00 AM – 4:00 PM","Friday: 11:00 AM – 12:00 AM","Saturday: 5:00 PM – 12:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:18.930Z',
        '2025-08-05T17:34:18.930Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'b9d0513f-7249-40dd-a331-e167825bdf0d',
        'ChIJjWf4HK-FqkARzQLkRYlgfZw',
        'Coffee Syndicate',
        'Old City Center, ul. "Moskovska" 3, 1000 Sofia, Bulgaria',
        42.69738180,
        23.32627480,
        '087 732 5743',
        'https://mentalsyndicate.com/coffee-syndicate/',
        NULL,
        '{establishment,food,cafe,point_of_interest,store}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2000"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 8:00 PM","Tuesday: 8:00 AM – 8:00 PM","Wednesday: 8:00 AM – 8:00 PM","Thursday: 8:00 AM – 8:00 PM","Friday: 8:00 AM – 8:00 PM","Saturday: 10:00 AM – 8:00 PM","Sunday: 10:00 AM – 8:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:34.124Z',
        '2025-08-05T17:34:34.124Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ba889229-cdb9-4d1a-918f-995675d1c96c',
        'ChIJb1A0WHCFqkARGNJC_Hn3I_k',
        'Restaurant "Elam"',
        'g.k. Lozenets, ul. "Sveta Gora" 40, 1164 Sofia, Bulgaria',
        42.67554180,
        23.32954460,
        '088 905 7263',
        NULL,
        NULL,
        '{food,restaurant,meal_delivery,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 10:00 PM","Tuesday: 8:00 AM – 10:00 PM","Wednesday: 8:00 AM – 10:00 PM","Thursday: 8:00 AM – 10:00 PM","Friday: 8:00 AM – 10:00 PM","Saturday: 8:00 AM – 10:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:37.148Z',
        '2025-08-05T17:34:37.148Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'bb6d0296-b99d-49da-b175-5b8ae26c40a1',
        'ChIJ50hXj3qFqkARJpF5u_fEDxw',
        'Restaurant La Vita E Bella',
        'Sofia Center, ul. "Stara Planina" 10, 1000 Sofia, Bulgaria',
        42.69897890,
        23.33233260,
        '02 989 7007',
        NULL,
        NULL,
        '{restaurant,food,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        3.20,
        false,
        '2025-08-05T17:34:19.126Z',
        '2025-08-05T17:34:19.126Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'bbadffc0-fffb-4e0f-9d4c-48ede8ce4bdb',
        'ChIJ0b_NyW6FqkARJXGz7W-es9k',
        'Sofia Balkan Palace',
        '5, Old City Center, пл. „Света Неделя“ Square, 1000 София, Bulgaria',
        42.69702610,
        23.32230470,
        '02 981 6541',
        'http://www.sofiabalkanpalace.com/',
        NULL,
        '{establishment,point_of_interest,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:22.393Z',
        '2025-08-05T17:34:22.393Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'bcb592ab-04e0-4416-baca-f0ff2ea69a55',
        'ChIJjet60BKFqkARCIsRBYWTH00',
        'Rosslyn Central Park Hotel Sofia',
        'Pette Kyosheta, bul. "Vitosha" 106, 1463 Sofia, Bulgaria',
        42.68581190,
        23.31710800,
        '02 805 8181',
        'http://www.centralparkhotel.bg/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:15.064Z',
        '2025-08-05T17:34:15.064Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'bd272a74-7dd2-4999-b7dd-f66f0d60c84e',
        'ChIJz7GvCQqZqkARNxzyu4V0A20',
        'Friends restaurant',
        'ул. „Георги Сава Раковски“ 28, 1320 Bankya, Bulgaria',
        42.71037870,
        23.14879050,
        '087 681 2576',
        'https://www.facebook.com/pages/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82-%D0%9F%D1%80%D0%B8%D1%8F%D1%82%D0%B5%D0%BB%D0%B8-%D0%B3%D1%80-%D0%91%D0%B0%D0%BD%D0%BA%D1%8F-%D0%9A%D0%BE%D1%80%D1%82%D0%BE%D0%B2%D0%B5%D1%82%D0%B5/1599235546963007?fref=ts',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:30 PM","Tuesday: 10:00 AM – 10:30 PM","Wednesday: 10:00 AM – 10:30 PM","Thursday: 10:00 AM – 10:30 PM","Friday: 10:00 AM – 10:30 PM","Saturday: 10:00 AM – 10:30 PM","Sunday: 10:00 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:15.718Z',
        '2025-08-05T17:34:15.718Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'bdc988c1-fd10-4bc2-baf3-14df0d2257f7',
        'ChIJr3MAVWiBqkARODnTT6TkH5w',
        'Hotel Jasmin',
        'в.з. Симеоново - северVitosha, Boulevard "Simeonovsko Shose 252, 1434 Sofia, Bulgaria',
        42.62326090,
        23.33244390,
        '02 969 8555',
        'http://www.jasminhotel.com/',
        NULL,
        '{restaurant,lodging,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:28.752Z',
        '2025-08-05T17:34:28.752Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'be021434-9ec8-4920-a701-3e24868c1be6',
        'ChIJU7ZqbD-FqkARXJzXF8h0Meg',
        'Padrini Pizza',
        'Old City Center, ul. "Tsar Shishman" 3, 1000 Sofia, Bulgaria',
        42.69281580,
        23.33150390,
        NULL,
        NULL,
        NULL,
        '{restaurant,grocery_or_supermarket,meal_delivery,meal_takeaway,bakery,food,point_of_interest,establishment,store}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 7:00 PM","Tuesday: 8:00 AM – 7:00 PM","Wednesday: 8:00 AM – 7:00 PM","Thursday: 8:00 AM – 7:00 PM","Friday: 8:00 AM – 7:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:30.654Z',
        '2025-08-05T17:34:30.654Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'be03bbea-5215-4f94-9a5c-dddf3659a46e',
        'ChIJawQGSlCFqkARzUXTNV6qH4c',
        'Non-Stop My Shop - Alcohol & Tobacco 2',
        'Old City Center, bul. "Knyaginya Maria Luiza" 21, 1000 Sofia, Bulgaria',
        42.69896620,
        23.32180340,
        NULL,
        'https://instagram.com/my.shop.alcohol.and.tobacco?igshid=MzRlODBiNWFlZA==',
        NULL,
        '{point_of_interest,establishment,food,store,cafe}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:25.664Z',
        '2025-08-05T17:34:25.664Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'be0fbb8b-a586-44bb-bf58-dd46110c594a',
        'ChIJtdUVioqHqkARNwWDNH5r2ZY',
        'Суши маркет София',
        'Motopista, ul. "Rikkardo Vakkarini" 10А, 1404 Sofia, Bulgaria',
        42.66646390,
        23.29581210,
        '088 651 9616',
        'https://sushimarket-bg.com/',
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1000"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1000"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1000"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1000"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1000"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 12:00 AM","Tuesday: 10:00 AM – 12:00 AM","Wednesday: 10:00 AM – 12:00 AM","Thursday: 10:00 AM – 12:00 AM","Friday: 10:00 AM – 12:00 AM","Saturday: 10:00 AM – 12:00 AM","Sunday: 10:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:38.392Z',
        '2025-08-05T17:34:38.392Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'be518e8f-a1a8-4596-9c16-7a10b45d04f4',
        'ChIJ7Ua4GHSFqkARmNEOoWMC11M',
        'club Hacienda',
        'Sofia Center, pl. "Narodno sabranie" 3, 1000 Sofia, Bulgaria',
        42.69336940,
        23.33313100,
        '088 515 2288',
        NULL,
        NULL,
        '{point_of_interest,night_club,establishment}',
        '{"periods":[{"open":{"day":1,"time":"2000"},"close":{"day":2,"time":"0400"}},{"open":{"day":3,"time":"2230"},"close":{"day":4,"time":"0500"}},{"open":{"day":4,"time":"2230"},"close":{"day":5,"time":"0500"}},{"open":{"day":5,"time":"2230"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"2230"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: 8:00 PM – 4:00 AM","Tuesday: Closed","Wednesday: 10:30 PM – 5:00 AM","Thursday: 10:30 PM – 5:00 AM","Friday: 10:30 PM – 5:00 AM","Saturday: 10:30 PM – 5:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.700Z',
        '2025-08-05T17:34:35.700Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c340aa13-3bad-47e6-b1fb-d5ac751c8a48',
        'ChIJJXcATwCFqkAR-UcWrqkXf9A',
        'JIRU Asian Restaurant',
        'Sofia Center, bul. "Tsar Osvoboditel" 16, 1000 Sofia, Bulgaria',
        42.69415190,
        23.33129870,
        '088 902 0020',
        'https://jiru.bg/wp-content/uploads/documents/Jiru_Menu_178x340mm_EN-9.09.pdf',
        NULL,
        '{point_of_interest,restaurant,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"1600"}},{"open":{"day":0,"time":"1900"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"1600"}},{"open":{"day":1,"time":"1900"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"1600"}},{"open":{"day":2,"time":"1900"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"1600"}},{"open":{"day":3,"time":"1900"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"1600"}},{"open":{"day":4,"time":"1900"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"1600"}},{"open":{"day":5,"time":"1900"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"1600"}},{"open":{"day":6,"time":"1900"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 4:00 PM, 7:00 – 11:00 PM","Tuesday: 12:00 – 4:00 PM, 7:00 – 11:00 PM","Wednesday: 12:00 – 4:00 PM, 7:00 – 11:00 PM","Thursday: 12:00 – 4:00 PM, 7:00 – 11:00 PM","Friday: 12:00 – 4:00 PM, 7:00 – 11:00 PM","Saturday: 12:00 – 4:00 PM, 7:00 – 11:00 PM","Sunday: 12:00 – 4:00 PM, 7:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.60,
        false,
        '2025-08-05T17:34:33.274Z',
        '2025-08-05T17:34:33.274Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c3821f4c-966e-4f51-a7bc-d781fcb6dc59',
        'ChIJf6_s5GyFqkARxeeUylLNfPc',
        'Social Cafe Bar & Kitchen restaurant',
        'Old City Center, bul. "Vitosha" 16, 1000 Sofia, Bulgaria',
        42.69344690,
        23.32018220,
        '087 676 7647',
        'https://socialcafe.bg/',
        NULL,
        '{establishment,food,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0100"}},{"open":{"day":1,"time":"1000"},"close":{"day":2,"time":"0100"}},{"open":{"day":2,"time":"1000"},"close":{"day":3,"time":"0100"}},{"open":{"day":3,"time":"1000"},"close":{"day":4,"time":"0100"}},{"open":{"day":4,"time":"1000"},"close":{"day":5,"time":"0100"}},{"open":{"day":5,"time":"1000"},"close":{"day":6,"time":"0100"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0100"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 1:00 AM","Tuesday: 10:00 AM – 1:00 AM","Wednesday: 10:00 AM – 1:00 AM","Thursday: 10:00 AM – 1:00 AM","Friday: 10:00 AM – 1:00 AM","Saturday: 10:00 AM – 1:00 AM","Sunday: 10:00 AM – 1:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:31.898Z',
        '2025-08-05T17:34:31.898Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c3aa1fef-f19b-4933-b48b-1792fb5fec58',
        'ChIJVXs3T7WFqkARO8giF_S3nSs',
        'Yun',
        'g.k. Izgrev, ul. "Elemag" 34, 1113 Sofia, Bulgaria',
        42.66864030,
        23.34390510,
        '02 963 0365',
        'https://www.facebook.com/yun.koreanrest/',
        NULL,
        '{food,establishment,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:00 PM","Tuesday: 11:30 AM – 10:00 PM","Wednesday: 11:30 AM – 10:00 PM","Thursday: 11:30 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:30 AM – 10:00 PM","Sunday: 11:30 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:39.831Z',
        '2025-08-05T17:34:39.831Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c42b6139-094f-4b8b-bbb9-032157269f71',
        'ChIJKVM_0WaFqkAReOIYpd7KyE4',
        'Hotel LION Sofia',
        'Sofia Center, bul. "Knyaginya Maria Luiza" 60, 1202 Sofia, Bulgaria',
        42.70443540,
        23.32393620,
        '02 917 8400',
        'http://hotelslion.bg/',
        NULL,
        '{lodging,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:23.045Z',
        '2025-08-05T17:34:23.045Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c44aafbe-92e1-47e7-b966-fb0b83507cd2',
        'ChIJhcxV1G6FqkARCF66RG34Vm8',
        'Caffetteria',
        'Sofia Center, bul. "Knyaginya Maria Luiza" 9-11, 1000 Sofia, Bulgaria',
        42.69824800,
        23.32162270,
        NULL,
        'http://www.caffetteria-bg.com/',
        NULL,
        '{food,store,establishment,cafe,bakery,point_of_interest,bar}',
        '{"periods":[{"open":{"day":0,"time":"0800"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2030"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 10:00 PM","Tuesday: 8:00 AM – 8:30 PM","Wednesday: 8:00 AM – 10:00 PM","Thursday: 8:00 AM – 10:00 PM","Friday: 8:00 AM – 10:00 PM","Saturday: 8:00 AM – 10:00 PM","Sunday: 8:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        4.00,
        false,
        '2025-08-05T17:34:25.009Z',
        '2025-08-05T17:34:25.009Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c48be93b-af15-4841-a44c-c8f6e4f20839',
        'ChIJt0GZnA6FqkARLarsVpBqUao',
        'By the Way',
        'Old City Center, ulitsa „Georgi S. Rakovski“ 166, 1142 Sofia, Bulgaria',
        42.68651740,
        23.32257960,
        '02 980 3836',
        'http://bytheway.bg/',
        NULL,
        '{point_of_interest,bar,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0930"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"0900"},"close":{"day":2,"time":"0100"}},{"open":{"day":2,"time":"0900"},"close":{"day":3,"time":"0100"}},{"open":{"day":3,"time":"0900"},"close":{"day":4,"time":"0100"}},{"open":{"day":4,"time":"0900"},"close":{"day":5,"time":"0100"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0100"}},{"open":{"day":6,"time":"0900"},"close":{"day":0,"time":"0100"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 1:00 AM","Tuesday: 9:00 AM – 1:00 AM","Wednesday: 9:00 AM – 1:00 AM","Thursday: 9:00 AM – 1:00 AM","Friday: 9:00 AM – 1:00 AM","Saturday: 9:00 AM – 1:00 AM","Sunday: 9:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:27.628Z',
        '2025-08-05T17:34:27.628Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c5cb0385-72c9-4e60-bd83-9c878a083715',
        'ChIJVZpGF3CFqkAR2UCh0kf7vYY',
        'Restaurant "Staria Chinar"',
        'Sofia Center, Knyaz Alexander Dondukov Blvd 71, 1527 Sofia, Bulgaria',
        42.69910230,
        23.33664340,
        '088 745 5050',
        'http://www.stariachinar.com/',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:34.913Z',
        '2025-08-05T17:34:34.913Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c5db9343-5bcf-4ce8-a584-21e42e1cd667',
        'ChIJbz1k4h9UpEARmEKRzVAMJeA',
        'Hotel Aris',
        'Sofia Center, ul. "Seliolu" str, 1, 1202 Sofia, Bulgaria',
        42.70725170,
        23.32139580,
        '088 292 5540',
        'http://www.arishotelsofia.bg/',
        NULL,
        '{lodging,point_of_interest,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:18.210Z',
        '2025-08-05T17:34:18.210Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c600ef56-ef32-4456-9baf-b4b11d1af84a',
        'ChIJkatrhmyFqkARSO7mc_ad8ZY',
        'Baskerville',
        'Old City Center, ul. "Ivan Denkoglu" 16, 1000 Sofia, Bulgaria',
        42.69411510,
        23.31863940,
        '089 552 7345',
        'https://m.facebook.com/ClubBaskervilleSofia/?locale2=bg_BG',
        NULL,
        '{point_of_interest,establishment,bar}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0200"}},{"open":{"day":1,"time":"0900"},"close":{"day":2,"time":"0200"}},{"open":{"day":2,"time":"0900"},"close":{"day":3,"time":"0200"}},{"open":{"day":3,"time":"0900"},"close":{"day":4,"time":"0200"}},{"open":{"day":4,"time":"0900"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0200"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0200"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 2:00 AM","Tuesday: 9:00 AM – 2:00 AM","Wednesday: 9:00 AM – 2:00 AM","Thursday: 9:00 AM – 2:00 AM","Friday: 9:00 AM – 2:00 AM","Saturday: 10:00 AM – 2:00 AM","Sunday: 10:00 AM – 2:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:26.319Z',
        '2025-08-05T17:34:26.319Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c73cf606-d801-4fb8-bf86-c240b8104744',
        'ChIJldM8zQCFqkARfXyqNQ97Ea0',
        'Hemus Hotel',
        'g.k. Lozenets, Blvd. "Cherni vrah" 25, 1421 Sofia, Bulgaria',
        42.67782880,
        23.32212540,
        '02 816 5000',
        'http://www.hemushotels.com/',
        NULL,
        '{lodging,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:17.811Z',
        '2025-08-05T17:34:17.811Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c7409a2f-7adf-4772-b3d0-6b41de5398b6',
        'ChIJoX0RNmmFqkAR-L8dtBFRY8c',
        'Снак бар и био магазин ЗЕЛЕН - Графа',
        'Old City Center, ul. "Graf Ignatiev" 40, 1000 Sofia, Bulgaria',
        42.68999460,
        23.32649920,
        '089 554 9913',
        'https://zelen.bg/',
        NULL,
        '{food,establishment,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 9:00 PM","Tuesday: 9:00 AM – 9:00 PM","Wednesday: 9:00 AM – 9:00 PM","Thursday: 9:00 AM – 9:00 PM","Friday: 9:00 AM – 9:00 PM","Saturday: 9:00 AM – 9:00 PM","Sunday: 9:00 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.109Z',
        '2025-08-05T17:34:35.109Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c749ce52-0af8-4e6d-aaa6-48148a26f8f9',
        'ChIJIYHrRmmFqkARXHAcABE6Txk',
        'Versus',
        'Sofia Center, ul. "Tsar Samuil" 50, 1000 Sofia, Bulgaria',
        42.69687060,
        23.31786740,
        '088 814 0133',
        'http://www.barversus.com/',
        NULL,
        '{point_of_interest,night_club,establishment,bar}',
        '{"periods":[{"open":{"day":0,"time":"2100"},"close":{"day":1,"time":"0200"}},{"open":{"day":1,"time":"2100"},"close":{"day":2,"time":"0200"}},{"open":{"day":2,"time":"2100"},"close":{"day":3,"time":"0200"}},{"open":{"day":3,"time":"2100"},"close":{"day":4,"time":"0200"}},{"open":{"day":4,"time":"2100"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"2100"},"close":{"day":6,"time":"0400"}},{"open":{"day":6,"time":"2100"},"close":{"day":0,"time":"0400"}}],"open_now":false,"weekday_text":["Monday: 9:00 PM – 2:00 AM","Tuesday: 9:00 PM – 2:00 AM","Wednesday: 9:00 PM – 2:00 AM","Thursday: 9:00 PM – 2:00 AM","Friday: 9:00 PM – 4:00 AM","Saturday: 9:00 PM – 4:00 AM","Sunday: 9:00 PM – 2:00 AM"]}',
        '{}',
        NULL,
        NULL,
        0.70,
        false,
        '2025-08-05T17:34:27.106Z',
        '2025-08-05T17:34:27.106Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c8d22033-4258-45ad-a1b4-2145ec5ca443',
        'ChIJfUeYcwuZqkARvMJPXddr-ys',
        'Restorant Brezite',
        'ul. "Raztovarishte" 1, 1320 Bankya, Bulgaria',
        42.70633480,
        23.14887130,
        '02 997 8993',
        'http://brezite.bg/',
        NULL,
        '{establishment,restaurant,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2330"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 11:30 PM","Tuesday: 10:00 AM – 11:30 PM","Wednesday: 10:00 AM – 11:30 PM","Thursday: 10:00 AM – 11:30 PM","Friday: 10:00 AM – 11:30 PM","Saturday: 10:00 AM – 11:30 PM","Sunday: 10:00 AM – 11:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:39.239Z',
        '2025-08-05T17:34:39.239Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c8d5a12a-931f-4d30-b8fe-12f3fcbd8c0d',
        'ChIJz3GXhnCFqkARhMjBvpth-Zo',
        'Taj Mahal Restaurant',
        'Old City Center, ul. "11-ti avgust" 11, 1520 Sofia, Bulgaria',
        42.69812870,
        23.33208160,
        '087 660 0776',
        NULL,
        NULL,
        '{food,point_of_interest,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:30 PM","Tuesday: 11:30 AM – 10:30 PM","Wednesday: 11:30 AM – 10:30 PM","Thursday: 11:30 AM – 10:30 PM","Friday: 11:30 AM – 10:30 PM","Saturday: 11:30 AM – 10:30 PM","Sunday: 11:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        3.70,
        false,
        '2025-08-05T17:34:14.869Z',
        '2025-08-05T17:34:14.869Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'c9d19001-beaf-4368-a6c2-37fe19f7775f',
        'ChIJiyaXYAaFqkARFB8DLmYbBKU',
        'Deli Venue',
        'g.k. Lozenets, ul. "Yakubitsa" 2А, 1164 Sofia, Bulgaria',
        42.67389670,
        23.32835940,
        '088 801 0788',
        'http://www.delivenue.com/',
        NULL,
        '{point_of_interest,cafe,food,restaurant,establishment,store,meal_takeaway}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 10:00 PM","Tuesday: 10:00 AM – 10:00 PM","Wednesday: 10:00 AM – 10:00 PM","Thursday: 10:00 AM – 10:00 PM","Friday: 10:00 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 10:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.568Z',
        '2025-08-05T17:34:35.568Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'cb290cdb-2ca1-4fef-9c03-3af79cbffec9',
        'ChIJ46vLf2WFqkAR72z9LicHh5M',
        'Skapto Burgers, Beers and Fries Iskar',
        'Old City Center, ul. "Iskar" 11А, 1000 Sofia, Bulgaria',
        42.69980180,
        23.32648410,
        '0700 11 313',
        'https://skapto.bg/',
        NULL,
        '{restaurant,food,meal_takeaway,store,point_of_interest,establishment,liquor_store}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:30 PM","Tuesday: 11:30 AM – 10:30 PM","Wednesday: 11:30 AM – 10:30 PM","Thursday: 11:30 AM – 10:30 PM","Friday: 11:30 AM – 10:30 PM","Saturday: 11:30 AM – 10:30 PM","Sunday: 11:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:23.240Z',
        '2025-08-05T17:34:23.240Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'cc95d351-da68-48e8-b27e-422088aa5fdc',
        'ChIJO_0tT6uFqkARrTH3nCVAClU',
        'Haiku Sushi',
        'g.k. Lozenets, ul. "Sveti Teodosiy Tarnovski" 60, 1407 Sofia, Bulgaria',
        42.67233370,
        23.32602440,
        '088 880 0082',
        'https://haikusushi.bg/',
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:00 PM","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:33.077Z',
        '2025-08-05T17:34:33.077Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'cdbe2e7a-f88d-424c-99f6-687716fd5482',
        'ChIJIQ3wc12FqkARPsGUDqvwpNk',
        'Sofia Art Gallery Vacation Apartments',
        'Ulitsa sv. Sv. Kiril i metodeiy, Sofia Center, 2210 Sofia, Bulgaria',
        42.70382810,
        23.31769220,
        '087 761 9673',
        'http://holidays-tourist-apartment-sofia.top/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:27.693Z',
        '2025-08-05T17:34:27.693Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'cedca032-395d-4a23-b929-fadc4d62ab07',
        'ChIJ3zfACoSaqkARxRrXO5flmI0',
        'Casa Ferrari B&B',
        'Sofia Center, ul. "Lyulin planina" 16, 1606 Sofia, Bulgaria',
        42.69120140,
        23.31268130,
        '088 891 2019',
        'http://www.casaferrari.com/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:17.156Z',
        '2025-08-05T17:34:17.156Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'cf7b44b0-5a9f-4839-81e2-d02bbcdb9f4f',
        'ChIJw92EXnKFqkARCQvbs1a5Yj0',
        'Ciccione Panini Bar & Pizza #3 Gurko',
        'Gen. Yosif V. Gurko 9 Str., Sofia Center, ul. "General Gurko" 9, 1000 Sofia, Bulgaria',
        42.69309880,
        23.32607210,
        '088 250 1599',
        'https://www.ciccione.bg/bg',
        NULL,
        '{food,point_of_interest,grocery_or_supermarket,restaurant,establishment,cafe,store,meal_takeaway}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0930"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0930"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0930"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0930"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0930"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 9:30 AM – 10:00 PM","Tuesday: 9:30 AM – 10:00 PM","Wednesday: 9:30 AM – 10:00 PM","Thursday: 9:30 AM – 10:00 PM","Friday: 9:30 AM – 10:00 PM","Saturday: 10:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:23.436Z',
        '2025-08-05T17:34:23.436Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'cfbdd1b3-04cf-46df-9489-7e3a2ee27afb',
        'ChIJ4-PosxKFqkARpxT4kwk6Qrk',
        'Art''Otel',
        '44 William Gladstone Street, Old City Center, 1000 Sofia, Bulgaria',
        42.69135560,
        23.32131670,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:17.613Z',
        '2025-08-05T17:34:17.613Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd02e7786-61d1-4f66-9b59-79c8349157c1',
        'ChIJQ_GKA5uFqkARAp8qGKGIIN0',
        'Ivanko Emanuilov - Emko',
        'Oborishte, ul. "Professor Djovani Gorini" 4, 1505 Sofia, Bulgaria',
        42.69303720,
        23.34851590,
        NULL,
        NULL,
        NULL,
        '{food,cafe,point_of_interest,establishment,store}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 10:00 PM","Tuesday: 8:00 AM – 10:00 PM","Wednesday: 8:00 AM – 10:00 PM","Thursday: 8:00 AM – 10:00 PM","Friday: 8:00 AM – 10:00 PM","Saturday: 9:00 AM – 10:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:25.140Z',
        '2025-08-05T17:34:25.140Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd0502eed-6118-4ade-a3bd-9ce2327ed7e2',
        'ChIJMyD4sXuFqkARxGSHg7MtdXg',
        'Caramel',
        'Sofia Center, ul. "Chernomen" 5, 1527 Sofia, Bulgaria',
        42.70071340,
        23.33476440,
        '088 857 5777',
        'https://caramel.bg/',
        NULL,
        '{store,food,establishment,point_of_interest,bakery}',
        '{"periods":[{"open":{"day":1,"time":"0700"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0700"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0700"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0700"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0700"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1400"}}],"open_now":true,"weekday_text":["Monday: 7:00 AM – 6:00 PM","Tuesday: 7:00 AM – 6:00 PM","Wednesday: 7:00 AM – 6:00 PM","Thursday: 7:00 AM – 6:00 PM","Friday: 7:00 AM – 6:00 PM","Saturday: 8:00 AM – 2:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:27.825Z',
        '2025-08-05T17:34:27.825Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd0fba60d-549d-451e-9abf-b12452c5edd4',
        'ChIJfSx3VymXqkARgnU-Hj2xrxc',
        'Caruso Pizza Center',
        'Sofia Center, ulitsa „Georgi S. Rakovski“ 52, 1202 Sofia, Bulgaria',
        42.70205960,
        23.32905790,
        '089 656 4444',
        'https://carusopizza.bg/',
        NULL,
        '{meal_delivery,meal_takeaway,food,point_of_interest,establishment,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2130"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2130"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2130"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2130"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2130"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2130"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2130"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 9:30 PM","Tuesday: 11:30 AM – 9:30 PM","Wednesday: 11:30 AM – 9:30 PM","Thursday: 11:30 AM – 9:30 PM","Friday: 11:30 AM – 9:30 PM","Saturday: 11:30 AM – 9:30 PM","Sunday: 11:30 AM – 9:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:30.458Z',
        '2025-08-05T17:34:30.458Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd1b51fe2-596d-43d7-9eb8-c688c9cefb79',
        'ChIJi7gzgHqFqkAR7G4hrTYGQds',
        'The Coffee Shop',
        'Sofia Center, ul. "11-ti avgust" 13, 1000 Sofia, Bulgaria',
        42.69857920,
        23.33210570,
        '088 934 7006',
        NULL,
        NULL,
        '{cafe,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"0800"},"close":{"day":6,"time":"1800"}}],"open_now":false,"weekday_text":["Monday: 8:00 AM – 6:00 PM","Tuesday: 8:00 AM – 6:00 PM","Wednesday: 8:00 AM – 6:00 PM","Thursday: 8:00 AM – 6:00 PM","Friday: 8:00 AM – 6:00 PM","Saturday: 8:00 AM – 6:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:25.337Z',
        '2025-08-05T17:34:25.337Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd35b3454-f4cc-4282-ad62-3d5c971df610',
        'ChIJGQe-v32PqkARPAiUuG9g2LY',
        'Domino''s Pizza - София - Сухата река',
        'Poduyane, bul. "Vladimir Vazov" 12-13, 1517 Sofia, Bulgaria',
        42.70383030,
        23.35648100,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:31.113Z',
        '2025-08-05T17:34:31.113Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd3844a23-5d71-48c9-a401-276a73d0c45d',
        'ChIJURAHFQ2FqkARPyWgUnkkKZs',
        'El Shada',
        'Old City Center, ulitsa „Georgi S. Rakovski“ 134, 1000 Sofia, Bulgaria',
        42.68976700,
        23.32308680,
        '089 666 9977',
        'https://www.facebook.com/pages/category/Italian-Restaurant/El-Shada-1524184190979578/',
        NULL,
        '{establishment,restaurant,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:30 PM","Tuesday: 11:30 AM – 10:30 PM","Wednesday: 11:30 AM – 10:30 PM","Thursday: 11:30 AM – 10:30 PM","Friday: 11:30 AM – 10:30 PM","Saturday: 11:30 AM – 10:30 PM","Sunday: 11:30 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:31.310Z',
        '2025-08-05T17:34:31.310Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd44efc40-e303-43c9-9107-0209d6048b7d',
        'ChIJeQTeXXGFqkAR1xiF_iWGrrk',
        'Boom Burgers & Booze',
        'Sofia Center, bul. "Tsar Osvoboditel" 12, 1000 Sofia, Bulgaria',
        42.69447150,
        23.33082240,
        '089 567 8011',
        'http://www.boomburgers.com/',
        NULL,
        '{establishment,food,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.90,
        false,
        '2025-08-05T17:34:31.766Z',
        '2025-08-05T17:34:31.766Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd47155f9-551e-47f2-9780-6d5486e271b3',
        'ChIJfVlwNK-ZqkARRHBP6n24eKE',
        'Парк Кафе',
        'ul. "Mayor Kosta Panitsa", 1320 Bankya, Bulgaria',
        42.70711510,
        23.14429490,
        '089 577 4223',
        'https://www.facebook.com/people/%D0%9F%D0%B0%D1%80%D0%BA-%D0%9A%D0%B0%D1%84%D0%B5/100046869865189/',
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 10:00 PM","Tuesday: 9:00 AM – 10:00 PM","Wednesday: 9:00 AM – 10:00 PM","Thursday: 9:00 AM – 10:00 PM","Friday: 9:00 AM – 10:00 PM","Saturday: 9:00 AM – 10:00 PM","Sunday: 9:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:39.502Z',
        '2025-08-05T17:34:39.502Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd6301844-cd1d-4b13-9c2b-647a5f2f96b6',
        'ChIJRfgwBgCFqkARpYQlSH22YyA',
        'Kraso',
        'Old City Center, 1000 Sofia, Bulgaria',
        42.69572610,
        23.32186680,
        NULL,
        NULL,
        NULL,
        '{food,point_of_interest,bakery,store,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:28.215Z',
        '2025-08-05T17:34:28.215Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd642b79c-6ca1-4d61-9121-cc8202b063c8',
        'ChIJTbvsWGiFqkARU3Of4GRQ4kQ',
        'Sveta Sofia Hotel',
        'Bulgaria, Old City Center, ul. "Pirotska" 18, 1000 Sofia, Bulgaria',
        42.69982650,
        23.31889680,
        '088 868 0886',
        'http://www.hotelsvetasofia.com/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:27.760Z',
        '2025-08-05T17:34:27.760Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd83593c9-7704-431a-9fdf-35f0cfbf71e3',
        'ChIJx96iR2yFqkARVtAwo2Vg4IU',
        'Hesburger',
        'Old City Center, ул. „Алабин И. Вл.“ 29, 1000 Sofia, Bulgaria',
        42.69500640,
        23.32107180,
        '087 629 9360',
        'https://www.hesburger.bg/260?tid=1305',
        NULL,
        '{restaurant,establishment,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"0900"},"close":{"day":0,"time":"0500"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 11:00 PM","Tuesday: 9:00 AM – 11:00 PM","Wednesday: 9:00 AM – 11:00 PM","Thursday: 9:00 AM – 11:00 PM","Friday: 9:00 AM – 5:00 AM","Saturday: 9:00 AM – 5:00 AM","Sunday: 9:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:21.481Z',
        '2025-08-05T17:34:21.481Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd8b4284b-d081-4ce6-81ba-9f1723539f70',
        'ChIJ77pXGaiZqkAR0C50-19H_50',
        'Wood-Lark Pub',
        'ul. "Ivan Vazov", 1320 Bankya, Bulgaria',
        42.70623100,
        23.14478280,
        '02 997 7321',
        'http://www.zavedeniata.com/?page=article&cat=7&pub=1671',
        NULL,
        '{food,restaurant,establishment,point_of_interest,bar}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:15.391Z',
        '2025-08-05T17:34:15.391Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd907bbf2-73f3-4a84-908b-d92a7be1cbc0',
        'ChIJ90unpSuaqkARPt7wF4cN8AQ',
        'Fanshan Restaurant',
        'Sofia, Sofia Center, Struma St 2, 1202 Центр, Bulgaria',
        42.70192410,
        23.32334520,
        '02 836 0469',
        'https://www.foodpanda.bg/restaurant/v5ap/kitayski-restorant-fanshan',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:32.225Z',
        '2025-08-05T17:34:32.225Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'd9225d2f-6901-49cd-a9b1-b7a354b3561d',
        'ChIJSxkFrWSFqkAR6hoadTHfH-M',
        'Hostel E-Sport',
        'Sofia Center, ul. "Tsar Simeon" 14, 1000 Sofia, Bulgaria',
        42.70270540,
        23.33207700,
        '088 777 0335',
        'http://guesthousedune.com/',
        NULL,
        '{establishment,point_of_interest,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:17.943Z',
        '2025-08-05T17:34:17.943Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'db867460-e428-49bc-b586-ed027c6db45b',
        'ChIJEX08hxKFqkARUPFj7jE6OXM',
        'Art Plaza Hotel',
        'Old City Center, ul. "Hristo Belchev" 46, 1000 Sofia, Bulgaria',
        42.68949780,
        23.32037780,
        '02 980 0030',
        'https://www.bestwestern.gr/gr_GR/book/hotel-rooms.77719.html?aff=BGR&iata=00171880&ssob=BLBWI0004G&cid=BLBWI0004G:google:gmb:77719',
        NULL,
        '{point_of_interest,lodging,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:17.286Z',
        '2025-08-05T17:34:17.286Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'dbfe7c20-3574-4f08-aa3a-a4d1115c58ba',
        'ChIJd8xwgWyFqkARsPgYnKA5rp4',
        'Tiffany Sofia',
        'Old City Center, ul. "Ivan Denkoglu" 12, 1000 Sofia, Bulgaria',
        42.69414790,
        23.31840980,
        '088 712 2217',
        NULL,
        NULL,
        '{night_club,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":5,"time":"2300"},"close":{"day":6,"time":"0500"}},{"open":{"day":6,"time":"2300"},"close":{"day":0,"time":"0500"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: Closed","Friday: 11:00 PM – 5:00 AM","Saturday: 11:00 PM – 5:00 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:36.225Z',
        '2025-08-05T17:34:36.225Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'dc3e2c67-99f6-4b1f-8d96-84dca9d13716',
        'ChIJhV0ka3CFqkARAFfqAMZCLds',
        'Loving Hut Sofia',
        'Sofia Center, ulitsa „Georgi S. Rakovski“ 113, 1000 Sofia, Bulgaria',
        42.69798360,
        23.33007510,
        '088 458 3555',
        'https://lovinghut.bg/',
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"1700"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 6:00 PM","Tuesday: 11:00 AM – 6:00 PM","Wednesday: 11:00 AM – 6:00 PM","Thursday: 11:00 AM – 6:00 PM","Friday: 11:00 AM – 6:00 PM","Saturday: 11:00 AM – 5:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        8.00,
        false,
        '2025-08-05T17:34:17.745Z',
        '2025-08-05T17:34:17.745Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'dced068c-92c6-4208-bdec-590a05c5d4f2',
        'ChIJaaW4KmiFqkARXucpBUOXtkw',
        'RESTAURANT BRISTOL SOFIA',
        'Pette Kyosheta, Hristo Botev Blvd 69, 1303 Sofia, Bulgaria',
        42.69982730,
        23.31570050,
        '089 443 0444',
        'http://www.bristolhotel.bg/c/bg/zavedeniya/restorant-bristol/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:20.304Z',
        '2025-08-05T17:34:20.304Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'dde2561b-c5c7-439d-9d04-61d4dac0f929',
        'ChIJJ3vD-xqEqkARRUiu-rMOgl4',
        'Механа Магията на Чергите | Tavern Chergite',
        'Блок 60, Studentski Kompleks, 1000 Sofia, Bulgaria',
        42.64281150,
        23.34022440,
        '087 999 0903',
        'https://chergite.bg/',
        NULL,
        '{establishment,food,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":1,"time":"1200"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1200"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1200"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1200"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0130"}},{"open":{"day":6,"time":"1200"},"close":{"day":0,"time":"0130"}}],"open_now":true,"weekday_text":["Monday: 12:00 PM – 12:00 AM","Tuesday: 12:00 PM – 12:00 AM","Wednesday: 12:00 PM – 12:00 AM","Thursday: 12:00 PM – 12:00 AM","Friday: 12:00 PM – 1:30 AM","Saturday: 12:00 PM – 1:30 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:18.668Z',
        '2025-08-05T17:34:18.668Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'de249530-5fcd-457d-8f2a-7641fe46c756',
        'ChIJsxELynOFqkAREGHGdmTX97g',
        'Chinese Dragon Restaurant',
        'Slavyanska St 3, Old City Center, ul. "Slavyanska" 3, 1000 Sofia, Bulgaria',
        42.69354860,
        23.32839160,
        '02 980 5718',
        NULL,
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:32.093Z',
        '2025-08-05T17:34:32.093Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'deb533b7-6f44-4613-8cb5-50da0fcd6519',
        'ChIJXUUKE_6EqkARPqZgrPToGH4',
        'Nepali Gurkha Restaurant',
        'g.k. Lozenets, ul. "Tsvetna Gradina" 56, 1421 Sofia, Bulgaria',
        42.67323910,
        23.31535580,
        '088 493 9100',
        'http://www.gurkhabg.com/',
        NULL,
        '{point_of_interest,restaurant,establishment,meal_takeaway,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.90,
        false,
        '2025-08-05T17:34:26.253Z',
        '2025-08-05T17:34:26.253Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'defaf3d6-0739-4b50-b664-ae8e6d44f64f',
        'ChIJ19ukTAiFqkARk6LDGdRn9fw',
        'La Bottega Prima',
        '6, Milin kamak street, g.k. Lozenets, 1421 Sofia, Bulgaria',
        42.68322720,
        23.32729580,
        '088 578 0222',
        'http://labottega.bg/la-bottega-prima.html',
        NULL,
        '{meal_takeaway,grocery_or_supermarket,establishment,point_of_interest,store,liquor_store,food,meal_delivery,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 11:00 PM","Tuesday: 10:00 AM – 11:00 PM","Wednesday: 10:00 AM – 11:00 PM","Thursday: 10:00 AM – 11:00 PM","Friday: 10:00 AM – 11:00 PM","Saturday: 10:00 AM – 11:00 PM","Sunday: 10:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.30,
        false,
        '2025-08-05T17:34:36.494Z',
        '2025-08-05T17:34:36.494Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e25d96dc-4303-4579-ac2d-7ce4ad4aba1f',
        'ChIJF1bKyICFqkARiAhArnmE1cA',
        'Pizza Benisimo',
        'Poduyane, ul. "Poduenska" 18, 1505 Sofia, Bulgaria',
        42.70199040,
        23.35302960,
        '089 675 2323',
        'https://benissimo-pizza.gesto.bg/',
        NULL,
        '{restaurant,establishment,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:20.108Z',
        '2025-08-05T17:34:20.108Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e26944ca-1124-4211-a613-e427328e8ceb',
        'ChIJ7VOEDlWEqkARvnAzQtGhQYI',
        'Restaurant Silhouette',
        'g.k. Lozenets, ul. "Dragalevska" 1, 1407 Sofia, Bulgaria',
        42.67083260,
        23.32131920,
        '088 779 5656',
        'https://www.facebook.com/Restaurant.Silhouette/?fref=ts#',
        NULL,
        '{food,restaurant,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.10,
        false,
        '2025-08-05T17:34:38.326Z',
        '2025-08-05T17:34:38.326Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e2917910-1067-45a9-9a1f-97f6d90a58d3',
        'ChIJh3wqsWGFqkARJhMH15GvyBA',
        'Budapest Hotel Sofia',
        'Sofia Center, ul. Budapeshta 92, 1202 Sofia, Bulgaria',
        42.70750660,
        23.32662870,
        '02 421 5800',
        'http://hotelbudapest.bg/',
        NULL,
        '{point_of_interest,lodging,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:29.146Z',
        '2025-08-05T17:34:29.146Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e2c3631c-4020-4ec8-95b8-2e205ba3c67d',
        'ChIJM2IyLsmFqkARRJGJkx41u48',
        'Домашна кухня ЕрДинЧе - Изток',
        'g.k. Iztok, ul. "Charles Darwin" 14А, вход А, 1113 Sofia, Bulgaria',
        42.67212090,
        23.35480660,
        '098 897 9008',
        'https://www.facebook.com/groups/ErDinChe.Home.Kitchen/?ref=bookmarks',
        NULL,
        '{food,establishment,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"1530"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"1530"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"1530"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"1530"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"1530"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 3:30 PM","Tuesday: 11:30 AM – 3:30 PM","Wednesday: 11:30 AM – 3:30 PM","Thursday: 11:30 AM – 3:30 PM","Friday: 11:30 AM – 3:30 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:35.241Z',
        '2025-08-05T17:34:35.241Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e313c864-5cbb-4168-9722-2ea2a4b0371b',
        'ChIJV0Y6EWqFqkARRc4ajOBjnfI',
        'Restaurant Balito',
        'Pette Kyosheta, ul. "Pozitano" 50, 1303 Sofia, Bulgaria',
        42.69696070,
        23.31429010,
        '087 766 1509',
        'https://www.facebook.com/balitorestaurant/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:40.093Z',
        '2025-08-05T17:34:40.093Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e3e0d199-64d7-4818-9abb-8568e13f9b0f',
        'ChIJZ_KrSWyFqkAR1hCYepcuvbw',
        'Dream House',
        'Sofia Center, ул. „Алабин И. Вл.“ 50, 1000 Sofia, Bulgaria',
        42.69474000,
        23.32140160,
        '02 980 8163',
        'http://www.dreamhouse-bg.com/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        5.00,
        false,
        '2025-08-05T17:34:14.935Z',
        '2025-08-05T17:34:14.935Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e3eb0fcd-1a4f-48c5-b4fa-5ab66ae3d20b',
        'ChIJpzoNhIiFqkARoFEh84GjWpc',
        'Bklyn Coffee Bar',
        'Poduyane, ul. "Neofit Bozveli" 7, Ап 37, 1505 Sofia, Bulgaria',
        42.69960150,
        23.35837320,
        '089 779 4470',
        'https://www.facebook.com/Bklyn-Coffee-Bar-416687315352493',
        NULL,
        '{point_of_interest,establishment,food,cafe}',
        '{"periods":[{"open":{"day":1,"time":"0830"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0830"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0830"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0830"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0830"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 8:30 AM – 10:00 PM","Tuesday: 8:30 AM – 10:00 PM","Wednesday: 8:30 AM – 10:00 PM","Thursday: 8:30 AM – 10:00 PM","Friday: 8:30 AM – 10:00 PM","Saturday: 10:30 AM – 10:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:23.697Z',
        '2025-08-05T17:34:23.697Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e481ea62-5b64-42eb-8d4e-8dac423e9b99',
        'ChIJAQCwaJyFqkAR7GdGg3gs_Zs',
        'La Pastaria Sofia',
        'Doctor''s Garden, ul. "Professor Asen Zlatarov" 24, 1504 Sofia, Bulgaria',
        42.69306450,
        23.34373070,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:31.570Z',
        '2025-08-05T17:34:31.570Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e5b193cc-68b2-4da7-b16b-b0ea5fb0f8a7',
        'ChIJlQIMBHSFqkARjCw1vOo8YAw',
        'Grand Hotel Sofia',
        '1, Old City Center, ul. "General Gurko" str, 1000 Sofia, Bulgaria',
        42.69409250,
        23.32479790,
        '02 811 0811',
        'https://www.grandhotelsofia.bg/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.50,
        false,
        '2025-08-05T17:34:22.199Z',
        '2025-08-05T17:34:22.199Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'e6ccba02-9b86-4cb9-af64-4c85fa7c68fb',
        'ChIJXce1bnGFqkAR0JPS3RdNv4Q',
        'Biad Premium Club',
        'Old City Center, ul. "General Gurko" 16, 1000 Sofia, Bulgaria',
        42.69273990,
        23.32631090,
        '089 600 3003',
        'https://www.facebook.com/clubbiad/',
        NULL,
        '{night_club,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":5,"time":"2330"},"close":{"day":6,"time":"0630"}},{"open":{"day":6,"time":"2330"},"close":{"day":0,"time":"0630"}}],"open_now":false,"weekday_text":["Monday: Closed","Tuesday: Closed","Wednesday: Closed","Thursday: Closed","Friday: 11:30 PM – 6:30 AM","Saturday: 11:30 PM – 6:30 AM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:19.192Z',
        '2025-08-05T17:34:19.192Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ea36991a-f24d-4e48-845e-8eaff748a26b',
        'ChIJnVF0HAeFqkARv-CiWMn-q_Y',
        'Мег-Лозенец хотел',
        'g.k. Lozenets, ul. "Krum Popov" 84, 1421 Sofia, Bulgaria',
        42.67879090,
        23.32270770,
        '088 933 8400',
        NULL,
        NULL,
        '{point_of_interest,lodging,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        2.50,
        false,
        '2025-08-05T17:34:17.027Z',
        '2025-08-05T17:34:17.027Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ea83c9e2-238e-4122-b86d-06a5ec83d1e2',
        'ChIJ5a_vEnKFqkARSgJjM0YqNZU',
        'bar Sotsa',
        'Sofia Center, ul. "Ivan Vazov" 2, 1000 Sofia, Bulgaria',
        42.69413490,
        23.32577740,
        '087 952 6826',
        NULL,
        NULL,
        '{establishment,point_of_interest,bar}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.80,
        false,
        '2025-08-05T17:34:36.356Z',
        '2025-08-05T17:34:36.356Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ea95b807-7acd-493c-8b70-71ab7993af9d',
        'ChIJ-dlYqAmFqkAR847TGtCQRaU',
        'Pizza Box (Bakery Pizza)',
        'g.k. Lozenets, ul. "Milin Kamak" 2, 1421 Sofia, Bulgaria',
        42.68392760,
        23.32685690,
        '089 758 6666',
        'http://pizza-box.bg/',
        NULL,
        '{restaurant,point_of_interest,establishment,meal_takeaway,food,meal_delivery}',
        '{"periods":[{"open":{"day":0,"time":"1030"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0930"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0930"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0930"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0930"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0930"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1030"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 9:30 AM – 10:00 PM","Tuesday: 9:30 AM – 10:00 PM","Wednesday: 9:30 AM – 10:00 PM","Thursday: 9:30 AM – 10:00 PM","Friday: 9:30 AM – 10:00 PM","Saturday: 10:30 AM – 10:00 PM","Sunday: 10:30 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        4.90,
        false,
        '2025-08-05T17:34:30.785Z',
        '2025-08-05T17:34:30.785Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'eaae2ce8-4b89-48bd-8285-91cb61bb83f9',
        'ChIJ1TqPZ8SFqkARcxlWG70hv1Q',
        'Wasabi Garden І Суши ресторант І Европейска кухня І Фюжън меню І Доставка на храна І София',
        'Geo Milev, ul. "Aleksandar Von Humboldt" 35А, 1113 Sofia, Bulgaria',
        42.67688320,
        23.36242190,
        '088 983 3434',
        NULL,
        NULL,
        '{food,meal_takeaway,establishment,restaurant,meal_delivery,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 10:30 PM","Tuesday: 11:00 AM – 10:30 PM","Wednesday: 11:00 AM – 10:30 PM","Thursday: 11:00 AM – 10:30 PM","Friday: 11:00 AM – 10:30 PM","Saturday: 11:00 AM – 10:30 PM","Sunday: 11:00 AM – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:19.453Z',
        '2025-08-05T17:34:19.453Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'eacb7792-2e93-4559-b84e-06ee4968b029',
        'ChIJmd6jr5eEqkARDv8JlVNLJSM',
        'Emirates Apart Residence',
        'Manastirski Livadi, blvd. "Bulgaria" 132, 1618 Sofia, Bulgaria',
        42.65558240,
        23.28057470,
        '087 842 3518',
        'http://www.emirates-residence.bg/',
        NULL,
        '{establishment,restaurant,lodging,spa,food,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        2.40,
        false,
        '2025-08-05T17:34:17.091Z',
        '2025-08-05T17:34:17.091Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ebb184fe-c231-4b51-968e-b43048d4b4eb',
        'ChIJF_xim0SFqkARIdZWHBzpeHk',
        'Mangia Station',
        'Sofia Center, bul. "Patriarh Evtimiy" 42, 1142 Sofia, Bulgaria',
        42.68881480,
        23.32249490,
        '088 801 0016',
        'http://bivakfoods.com/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:00 PM","Tuesday: 12:00 – 10:00 PM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 – 10:00 PM","Friday: 12:00 – 10:00 PM","Saturday: 12:00 – 10:00 PM","Sunday: 12:00 – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.20,
        false,
        '2025-08-05T17:34:23.371Z',
        '2025-08-05T17:34:23.371Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ebd6fb94-5d26-4a14-a538-3d344fd2356c',
        'ChIJp5R75m2FqkAR-xzGYe6gIIY',
        'Costa Coffee',
        'Old City Center, ul. "Knyaz Aleksandar I" 10Б, 1000 Sofia, Bulgaria',
        42.69519200,
        23.32430110,
        '088 545 5979',
        'https://www.costacoffee.bg/',
        NULL,
        '{point_of_interest,establishment,cafe,food,store}',
        '{"periods":[{"open":{"day":0,"time":"0830"},"close":{"day":0,"time":"2030"}},{"open":{"day":1,"time":"0730"},"close":{"day":1,"time":"2030"}},{"open":{"day":2,"time":"0730"},"close":{"day":2,"time":"2030"}},{"open":{"day":3,"time":"0730"},"close":{"day":3,"time":"2030"}},{"open":{"day":4,"time":"0730"},"close":{"day":4,"time":"2030"}},{"open":{"day":5,"time":"0730"},"close":{"day":5,"time":"2030"}},{"open":{"day":6,"time":"0830"},"close":{"day":6,"time":"2030"}}],"open_now":true,"weekday_text":["Monday: 7:30 AM – 8:30 PM","Tuesday: 7:30 AM – 8:30 PM","Wednesday: 7:30 AM – 8:30 PM","Thursday: 7:30 AM – 8:30 PM","Friday: 7:30 AM – 8:30 PM","Saturday: 8:30 AM – 8:30 PM","Sunday: 8:30 AM – 8:30 PM"]}',
        '{}',
        NULL,
        NULL,
        4.50,
        false,
        '2025-08-05T17:34:25.075Z',
        '2025-08-05T17:34:25.075Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ebedf149-63a9-4dcf-8d33-e19b4e9ef3de',
        'ChIJV1JP9maFqkAR-GbOf4XylrQ',
        'Shans-2',
        'Sofia Center, ulitsa "Sv. Sveti Kiril I Metodiy" 96, 1202 Sofia, Bulgaria',
        42.70310840,
        23.32223510,
        '02 983 9695',
        NULL,
        NULL,
        '{lodging,establishment,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:17.877Z',
        '2025-08-05T17:34:17.877Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ebf708cd-9e43-4504-b3ce-8217f135df6c',
        'ChIJxY_U52WFqkARBQLoOTE35Os',
        'Vegetarian Buffet - Kring Restaurant',
        'Sofia Center, ul. "Tsar Simeon" 72, 1202 Sofia, Bulgaria',
        42.70117510,
        23.32475360,
        '02 983 4333',
        'https://kring.bg/',
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2000"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2000"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2000"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2000"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2000"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2000"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 8:00 PM","Tuesday: 11:30 AM – 8:00 PM","Wednesday: 11:30 AM – 8:00 PM","Thursday: 11:30 AM – 8:00 PM","Friday: 11:30 AM – 8:00 PM","Saturday: 11:30 AM – 8:00 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        6.80,
        false,
        '2025-08-05T17:34:36.756Z',
        '2025-08-05T17:34:36.756Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ed30a593-f8bc-4b3e-b3d8-661a78311b0d',
        'ChIJ54JPZCOFqkARgxb5bfTZFYM',
        'Hotel Forum',
        'Hipodruma, bul. "Tsar Boris III" 41, 1612 Sofia, Bulgaria',
        42.68425980,
        23.29713130,
        '02 954 4444',
        'http://hotel-forum.bg/',
        NULL,
        '{lodging,restaurant,food,point_of_interest,parking,spa,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        3.00,
        false,
        '2025-08-05T17:34:16.767Z',
        '2025-08-05T17:34:16.767Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ed9771cf-7902-4a82-ba8b-c8a7c192e0a1',
        'ChIJBVnXeTOFqkAR9MyIFTDBdUE',
        'JAZU by Hamachi',
        '55, business park EXPO 2000, Промишлена зона Хладилника, bul. "Nikola Y. Vaptsarov" blvd, 1407 Sofia, Bulgaria',
        42.66710800,
        23.32534800,
        '088 710 4010',
        'https://www.jazu.bg/',
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.70,
        false,
        '2025-08-05T17:34:38.457Z',
        '2025-08-05T17:34:38.457Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'edca62e0-e365-4a1a-8387-e3a34ab2eb2e',
        'ChIJm3P5L7aFqkARC4nRTuFhJT0',
        'Park Hotel "MOSKVA"',
        'Nezabravka Str, g.k. Iztok, ul. "Nezabravka" 25, 1113 Sofia, Bulgaria',
        42.67377420,
        23.34883950,
        '088 514 2901',
        'https://www.parkhotelmoskva.net/',
        NULL,
        '{point_of_interest,lodging,park,establishment,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:16.831Z',
        '2025-08-05T17:34:16.831Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'edfbb793-6da0-4642-abf6-a870bbc3b8d2',
        'ChIJY-E6OKmFqkAR95nJAzE16yo',
        'The Rusty Grill Burger',
        'Sofia Center, Shipka Street № 12, 1000 Sofia, Bulgaria',
        42.69396620,
        23.33681070,
        '088 918 2106',
        'http://rusty.bg/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1130"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1130"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 10:00 PM","Tuesday: 11:30 AM – 10:00 PM","Wednesday: 11:30 AM – 10:00 PM","Thursday: 11:30 AM – 10:00 PM","Friday: 11:30 AM – 10:00 PM","Saturday: 11:30 AM – 10:00 PM","Sunday: 11:30 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:15.914Z',
        '2025-08-05T17:34:15.914Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'eec0a92d-bc2f-4800-ae9e-c7e9930547ba',
        'ChIJ1QY22V2EqkARj8XYd4dWAx4',
        'Happy Bar & Grill Paradise Center',
        'Hladilnika, Blvd. "Cherni vrah" 100, level 2, 1407 Sofia, Bulgaria',
        42.65746360,
        23.31438320,
        '0700 20 888',
        'https://happy.bg/',
        NULL,
        '{establishment,food,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2230"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2230"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2230"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2230"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2230"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2230"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2230"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 10:30 PM","Tuesday: 12:00 – 10:30 PM","Wednesday: 12:00 – 10:30 PM","Thursday: 12:00 – 10:30 PM","Friday: 12:00 – 10:30 PM","Saturday: 12:00 – 10:30 PM","Sunday: 12:00 – 10:30 PM"]}',
        '{}',
        NULL,
        NULL,
        3.10,
        false,
        '2025-08-05T17:34:33.339Z',
        '2025-08-05T17:34:33.339Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'eee71e96-dfc6-4cef-b3d5-9b95b440a97b',
        'ChIJHcxRIA2FqkARZLHqSWGypSY',
        'Ugo',
        'Sofia Center, ul. "Neofit Rilski" 68, 1000 Sofia, Bulgaria',
        42.68974500,
        23.32445050,
        '088 890 9156',
        'https://www.ugo.bg/',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":1,"time":"0300"}},{"open":{"day":1,"time":"1100"},"close":{"day":2,"time":"0300"}},{"open":{"day":2,"time":"1100"},"close":{"day":3,"time":"0300"}},{"open":{"day":3,"time":"1100"},"close":{"day":4,"time":"0300"}},{"open":{"day":4,"time":"1100"},"close":{"day":5,"time":"0300"}},{"open":{"day":5,"time":"1100"},"close":{"day":6,"time":"0300"}},{"open":{"day":6,"time":"1100"},"close":{"day":0,"time":"0300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 3:00 AM","Tuesday: 11:00 AM – 3:00 AM","Wednesday: 11:00 AM – 3:00 AM","Thursday: 11:00 AM – 3:00 AM","Friday: 11:00 AM – 3:00 AM","Saturday: 11:00 AM – 3:00 AM","Sunday: 11:00 AM – 3:00 AM"]}',
        '{}',
        NULL,
        NULL,
        3.50,
        false,
        '2025-08-05T17:34:38.847Z',
        '2025-08-05T17:34:38.847Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ef258879-0df7-4cb7-ae34-b3e74b3577ec',
        'ChIJq89_Nm2FqkARgTMX4N96KEE',
        'Hotel Sofia Place',
        'Sofia Center, ul. "Hristo Belchev" 29, 1000 Sofia, Bulgaria',
        42.69193890,
        23.32110090,
        '088 478 9203',
        'https://sofiaplacehotel.com/',
        NULL,
        '{establishment,lodging,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.088Z',
        '2025-08-05T17:34:21.088Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'efbd53f4-c9b2-4307-9d6b-f6ebf7ec8179',
        'ChIJlwUjpW6FqkARi8PDirjI8t4',
        'Happy Bar & Grill Rakovski',
        'Sofia street, Old City Center, ulitsa „Georgi S. Rakovski“ 145А, 1000 Sofia, Bulgaria',
        42.69203950,
        23.32627420,
        '0700 20 888',
        'https://happy.bg/',
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.50,
        false,
        '2025-08-05T17:34:38.978Z',
        '2025-08-05T17:34:38.978Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f0a4a4f8-24a5-4983-ae36-b50361a92953',
        'ChIJ-wf0NKGDqkARTxTJ3pJqT68',
        'Италиански ресторант La Casetta da Beerto',
        'в.з. Киноцентър,Драгалевци, KinotsentarVitosha, ul. "Chemshir" 2B, 1415 Sofia, Bulgaria',
        42.63537260,
        23.30780010,
        '088 787 7577',
        NULL,
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1200"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1200"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1200"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1200"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 12:00 – 11:00 PM","Tuesday: 12:00 – 11:00 PM","Wednesday: 12:00 – 11:00 PM","Thursday: 12:00 – 11:00 PM","Friday: 12:00 – 11:00 PM","Saturday: 12:00 – 11:00 PM","Sunday: 12:00 – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:32.552Z',
        '2025-08-05T17:34:32.552Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f11a60b7-2628-4700-881b-a8e9340c2edc',
        'ChIJQ6c93IGFqkAR_lpg3669DM4',
        'Пекарна SBakery',
        'Sofia Center, ul. "Lom" 1, 1000 Sofia, Bulgaria',
        42.69719070,
        23.32038960,
        '087 735 8004',
        NULL,
        NULL,
        '{point_of_interest,bakery,store,establishment,food}',
        '{"periods":[{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1800"}}],"open_now":true,"weekday_text":["Monday: 8:00 AM – 6:00 PM","Tuesday: 8:00 AM – 6:00 PM","Wednesday: 8:00 AM – 6:00 PM","Thursday: 8:00 AM – 6:00 PM","Friday: 8:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:28.151Z',
        '2025-08-05T17:34:28.151Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f23513b6-c384-49ad-87a9-fb76fbb3c08a',
        'ChIJ33om4cKZqkARE8UB7bV1taU',
        'RENY''S',
        'ul. "Ivan Vazov" 5, 1320 Bankya, Bulgaria',
        42.70411680,
        23.14649770,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:15.849Z',
        '2025-08-05T17:34:15.849Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f29375d0-d117-407c-8148-d166657ef7e0',
        'ChIJt_8KwnOFqkARE22peen1PJU',
        'Spaghetti Kitchen',
        'Old City Center, ul. "6-ti septemvri" 9, 1000 Sofia, Bulgaria',
        42.69366150,
        23.32965870,
        '089 056 6666',
        'http://spaghetti-kitchen.com/',
        NULL,
        '{establishment,food,point_of_interest,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1200"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1200"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1200"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1200"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1200"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1200"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 12:00 PM – 12:00 AM","Tuesday: 12:00 PM – 12:00 AM","Wednesday: 12:00 – 10:00 PM","Thursday: 12:00 PM – 12:00 AM","Friday: 12:00 PM – 12:00 AM","Saturday: 12:00 PM – 12:00 AM","Sunday: 12:00 PM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.10,
        false,
        '2025-08-05T17:34:32.486Z',
        '2025-08-05T17:34:32.486Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f2c57c6f-4e2d-49d2-9bda-472e3bde3cc8',
        'ChIJOb3XrliFqkARQr7tKN2yKEo',
        'Hotel Sylvia',
        'g.k. Banishora, ul. "Sofroniy Vrachanski" 149, 1233 Sofia, Bulgaria',
        42.71052560,
        23.31719150,
        '02 931 2459',
        NULL,
        NULL,
        '{lodging,point_of_interest,establishment}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:23.111Z',
        '2025-08-05T17:34:23.111Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f384dc34-3d69-4108-bd01-f8130073c686',
        'ChIJ0f4WtCOFqkARQehHBIF_Fb4',
        'Джой Фуудс ЕООД',
        'g.k. Lozenets, Blvd. "Cherni vrah" 33E, 1421 Sofia, Bulgaria',
        42.67385550,
        23.32218240,
        '087 877 1222',
        NULL,
        NULL,
        '{meal_delivery,establishment,food,point_of_interest}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:29.604Z',
        '2025-08-05T17:34:29.604Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f42b856a-3915-4437-bc51-751ea6f9ecb0',
        'ChIJEavrna-EqkAROJU22S3H1Ss',
        'Кастело ди Сан Марино',
        'BojanaVitosha, ul. "Karamfil" 22, 1616 Sofia, Bulgaria',
        42.65551760,
        23.26186640,
        '089 611 1555',
        NULL,
        NULL,
        '{establishment,point_of_interest,restaurant,food}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":1,"time":"0000"}},{"open":{"day":1,"time":"1000"},"close":{"day":2,"time":"0000"}},{"open":{"day":2,"time":"1000"},"close":{"day":3,"time":"0000"}},{"open":{"day":3,"time":"1000"},"close":{"day":4,"time":"0000"}},{"open":{"day":4,"time":"1000"},"close":{"day":5,"time":"0000"}},{"open":{"day":5,"time":"1000"},"close":{"day":6,"time":"0000"}},{"open":{"day":6,"time":"1000"},"close":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 12:00 AM","Tuesday: 10:00 AM – 12:00 AM","Wednesday: 10:00 AM – 12:00 AM","Thursday: 10:00 AM – 12:00 AM","Friday: 10:00 AM – 12:00 AM","Saturday: 10:00 AM – 12:00 AM","Sunday: 10:00 AM – 12:00 AM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:18.734Z',
        '2025-08-05T17:34:18.734Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f43369fd-4f73-4ef4-918a-1befaa9faa44',
        'ChIJ0c8i6jaFqkARDrT9qObt50g',
        'Ton Shin Yuan',
        'ж.к. Разсадника - Коньовица, bul. "Vazkresenie" 3А, 1330 Sofia, Bulgaria',
        42.69437430,
        23.29184290,
        '02 920 0117',
        'https://www.takeaway.com/bg/menu/ton-shin-yanton-shin-yuan',
        NULL,
        '{establishment,restaurant,point_of_interest,food}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.00,
        false,
        '2025-08-05T17:34:32.028Z',
        '2025-08-05T17:34:32.028Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f5cfcd30-5c4e-4b1a-9799-7d672c61c377',
        'ChIJg9MJdHSFqkARgck10EQk96g',
        'Supa Star',
        'Old City Center, ul. "Tsar Shishman" 8, 1000 Sofia, Bulgaria',
        42.69268080,
        23.33112470,
        '088 290 8678',
        'https://www.facebook.com/BarSupaStar',
        NULL,
        '{restaurant,point_of_interest,establishment,food}',
        '{"periods":[{"open":{"day":0,"time":"1200"},"close":{"day":0,"time":"1900"}},{"open":{"day":1,"time":"1130"},"close":{"day":1,"time":"1900"}},{"open":{"day":2,"time":"1130"},"close":{"day":2,"time":"1900"}},{"open":{"day":3,"time":"1130"},"close":{"day":3,"time":"1900"}},{"open":{"day":4,"time":"1130"},"close":{"day":4,"time":"1900"}},{"open":{"day":5,"time":"1130"},"close":{"day":5,"time":"1900"}},{"open":{"day":6,"time":"1200"},"close":{"day":6,"time":"1900"}}],"open_now":true,"weekday_text":["Monday: 11:30 AM – 7:00 PM","Tuesday: 11:30 AM – 7:00 PM","Wednesday: 11:30 AM – 7:00 PM","Thursday: 11:30 AM – 7:00 PM","Friday: 11:30 AM – 7:00 PM","Saturday: 12:00 – 7:00 PM","Sunday: 12:00 – 7:00 PM"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:34.979Z',
        '2025-08-05T17:34:34.979Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f5d28fac-75e5-4a96-a376-48ca88d17d19',
        'ChIJCyZ8Gm2FqkARqIRoTb7aN-E',
        'Divaka',
        'Old City Center, ul. "Hristo Belchev" 16, 1000 Sofia, Bulgaria',
        42.69307730,
        23.32117110,
        '088 821 9087',
        'http://divaka.bg/',
        NULL,
        '{establishment,food,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 11:00 PM","Tuesday: 10:00 AM – 11:00 PM","Wednesday: 10:00 AM – 11:00 PM","Thursday: 10:00 AM – 11:00 PM","Friday: 10:00 AM – 11:00 PM","Saturday: 10:00 AM – 11:00 PM","Sunday: 10:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        3.30,
        false,
        '2025-08-05T17:34:14.477Z',
        '2025-08-05T17:34:14.477Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f62f5e5f-1ee1-4781-8cb4-3df3a096d867',
        'ChIJXaJ2t3mZqkARpGRaL7eGp8E',
        'Гостилница Трите гозби',
        'ul. "Aleksandar Stamboliyski" 3, 1320 Bankya, Bulgaria',
        42.70814380,
        23.14452600,
        '089 665 0377',
        'https://tritegozbi.com/',
        NULL,
        '{restaurant,point_of_interest,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2200"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: Closed","Tuesday: 11:00 AM – 10:00 PM","Wednesday: 11:00 AM – 10:00 PM","Thursday: 11:00 AM – 10:00 PM","Friday: 11:00 AM – 10:00 PM","Saturday: 11:00 AM – 10:00 PM","Sunday: 11:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.80,
        false,
        '2025-08-05T17:34:16.701Z',
        '2025-08-05T17:34:16.701Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f64f4256-5eba-4ead-8694-9cdb377a4358',
        'ChIJ0W9GI_2EqkARyZJkbYB1szI',
        'Spetema Coffee',
        'Yuzhen, 1407 Sofia, Bulgaria',
        42.67480340,
        23.30925550,
        NULL,
        NULL,
        NULL,
        '{cafe,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 9:00 PM","Tuesday: 9:00 AM – 9:00 PM","Wednesday: 9:00 AM – 9:00 PM","Thursday: 9:00 AM – 9:00 PM","Friday: 9:00 AM – 9:00 PM","Saturday: 9:00 AM – 9:00 PM","Sunday: 9:00 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.20,
        false,
        '2025-08-05T17:34:29.015Z',
        '2025-08-05T17:34:29.015Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f6b51e95-074a-41b5-9123-8a9baa76a78b',
        'ChIJJSwME5yFqkARlGUIkwcn5Kw',
        'Левитт смарт хостел',
        'Old City Center, Solunska Street 18, 1000 Sofia, Bulgaria',
        42.69282640,
        23.31979100,
        '088 564 0012',
        NULL,
        NULL,
        '{lodging,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.415Z',
        '2025-08-05T17:34:21.415Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f94b74cb-00eb-499d-8c67-5f9ccf1e57b6',
        'ChIJyRzAQ2-GqkARJp59S-GwFKo',
        'Stivan Iskar Hotel',
        'Old City Center, ul. "Iskar" 11 Б, 1000 Sofia, Bulgaria',
        42.69979940,
        23.32633820,
        '088 423 1964',
        'http://www.stivaniskar.com/contacts.php',
        NULL,
        '{point_of_interest,establishment,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        0.00,
        false,
        '2025-08-05T17:34:21.807Z',
        '2025-08-05T17:34:21.807Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'f99129f1-d733-454f-9cd1-59ca105d801b',
        'ChIJjet60BKFqkARDh1qNwBLK-Q',
        'Nedelya',
        'Pette Kyosheta, bul. "Vitosha" 98, 1463 Sofia, Bulgaria',
        42.68641750,
        23.31745620,
        '088 560 0826',
        'https://nedelya.com/',
        NULL,
        '{store,point_of_interest,establishment,bakery,food,cafe}',
        '{"periods":[{"open":{"day":0,"time":"1000"},"close":{"day":0,"time":"2100"}},{"open":{"day":1,"time":"1000"},"close":{"day":1,"time":"2100"}},{"open":{"day":2,"time":"1000"},"close":{"day":2,"time":"2100"}},{"open":{"day":3,"time":"1000"},"close":{"day":3,"time":"2100"}},{"open":{"day":4,"time":"1000"},"close":{"day":4,"time":"2100"}},{"open":{"day":5,"time":"1000"},"close":{"day":5,"time":"2100"}},{"open":{"day":6,"time":"1000"},"close":{"day":6,"time":"2100"}}],"open_now":true,"weekday_text":["Monday: 10:00 AM – 9:00 PM","Tuesday: 10:00 AM – 9:00 PM","Wednesday: 10:00 AM – 9:00 PM","Thursday: 10:00 AM – 9:00 PM","Friday: 10:00 AM – 9:00 PM","Saturday: 10:00 AM – 9:00 PM","Sunday: 10:00 AM – 9:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:24.615Z',
        '2025-08-05T17:34:24.615Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fa698128-7438-4e56-a7fa-1ea5a009db0f',
        'ChIJIxG-Vf2EqkARnUWxbj5A_Vw',
        'UGO',
        'Old City Center, bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
        42.69167540,
        23.32005240,
        '088 431 9621',
        'http://www.ugo.bg/',
        NULL,
        '{point_of_interest,restaurant,food,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:14.278Z',
        '2025-08-05T17:34:14.278Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fb2ce092-9219-4a7c-b59f-d0ce4a7abb3d',
        'ChIJA_bYmG-FqkARcKJ1kU2t0No',
        'Rainbow Factory',
        'Old City Center, ul. "Veslets" 10, 1000 Sofia, Bulgaria',
        42.69890420,
        23.32594260,
        '088 611 6556',
        'http://www.fabrikadaga.bg/',
        NULL,
        '{establishment,point_of_interest,food,restaurant}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"1800"}},{"open":{"day":1,"time":"0800"},"close":{"day":1,"time":"1800"}},{"open":{"day":2,"time":"0800"},"close":{"day":2,"time":"1800"}},{"open":{"day":3,"time":"0800"},"close":{"day":3,"time":"1800"}},{"open":{"day":4,"time":"0800"},"close":{"day":4,"time":"1800"}},{"open":{"day":5,"time":"0800"},"close":{"day":5,"time":"1800"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"1800"}}],"open_now":false,"weekday_text":["Monday: 8:00 AM – 6:00 PM","Tuesday: 8:00 AM – 6:00 PM","Wednesday: 8:00 AM – 6:00 PM","Thursday: 8:00 AM – 6:00 PM","Friday: 8:00 AM – 6:00 PM","Saturday: 9:00 AM – 6:00 PM","Sunday: 9:00 AM – 6:00 PM"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:21.546Z',
        '2025-08-05T17:34:21.546Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fb498d5a-c2c0-42ca-83ed-ee16809ce9d8',
        'ChIJ-YDP4gyFqkARaADwgmD8VzA',
        'Diter Hotel',
        'Sofia Center, ul. "Han Asparuh" 65, 1000 Sofia, Bulgaria',
        42.68924640,
        23.32431430,
        '02 989 8998',
        'https://www.diterhotel.com/en/',
        NULL,
        '{lodging,establishment,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:22.784Z',
        '2025-08-05T17:34:22.784Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fb9a555f-9eca-4cb3-8625-580c01ae0d2a',
        'ChIJhU5sJnaFqkAR6wgiwx15NOo',
        'Santa Sofia Guestrooms',
        'Bulgaria, Sofia, Old City Center, ul. "Trapezitsa", entrance 1 floor 2',
        42.69828830,
        23.32132970,
        '089 541 7300',
        NULL,
        NULL,
        '{point_of_interest,establishment,lodging}',
        NULL,
        '{}',
        NULL,
        NULL,
        1.50,
        false,
        '2025-08-05T17:34:18.139Z',
        '2025-08-05T17:34:18.139Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fc41a193-488b-4591-9c4c-6d68b886ef4b',
        'ChIJTzekwgyFqkAR1dn8nqJKfhM',
        'Vegetarian restaurant and bakery "Sun Moon"',
        'Sofia Center, ul. "6-ti septemvri" 39, 1000 Sofia, Bulgaria',
        42.68961000,
        23.32542100,
        '089 913 8411',
        'http://www.sunmoon.bg/',
        NULL,
        '{store,bakery,food,establishment,restaurant,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":0,"time":"2200"}},{"open":{"day":1,"time":"0900"},"close":{"day":1,"time":"2200"}},{"open":{"day":2,"time":"0900"},"close":{"day":2,"time":"2200"}},{"open":{"day":3,"time":"0900"},"close":{"day":3,"time":"2200"}},{"open":{"day":4,"time":"0900"},"close":{"day":4,"time":"2200"}},{"open":{"day":5,"time":"0900"},"close":{"day":5,"time":"2200"}},{"open":{"day":6,"time":"0900"},"close":{"day":6,"time":"2200"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 10:00 PM","Tuesday: 9:00 AM – 10:00 PM","Wednesday: 9:00 AM – 10:00 PM","Thursday: 9:00 AM – 10:00 PM","Friday: 9:00 AM – 10:00 PM","Saturday: 9:00 AM – 10:00 PM","Sunday: 9:00 AM – 10:00 PM"]}',
        '{}',
        NULL,
        NULL,
        4.50,
        false,
        '2025-08-05T17:34:36.690Z',
        '2025-08-05T17:34:36.690Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fcb0cdca-8e07-4726-8e1b-f37cea128a43',
        'ChIJdbNZhReFqkARkQ0vgLvhqbE',
        'Градина "Пей сърце" София | Заведение с градина в София | Обедно меню | Европейска кухня',
        'Kriva Reka, ul. "Sveti Georgi Sofiyski" 32, 1606 Sofia, Bulgaria',
        42.68604410,
        23.30634930,
        '088 614 3574',
        'http://peisarce-bg.com/',
        NULL,
        '{restaurant,food,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2330"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2330"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2330"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2330"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2330"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2330"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:30 PM","Tuesday: 11:00 AM – 11:30 PM","Wednesday: 11:00 AM – 11:30 PM","Thursday: 11:00 AM – 11:30 PM","Friday: 11:00 AM – 11:30 PM","Saturday: 11:00 AM – 11:30 PM","Sunday: Closed"]}',
        '{}',
        NULL,
        NULL,
        3.50,
        false,
        '2025-08-05T17:34:19.782Z',
        '2025-08-05T17:34:19.782Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fd141d51-27b1-4684-ae13-c4ec5e43b7b8',
        'ChIJVVVVVYCQqkARMSR8NsEyA_Q',
        'Hotel Simona Complex Sofia',
        'Складово-производствена зона - Модерно предградие, ul. "Okolovrasten pat" 721, 1360 Sofia, Bulgaria',
        42.74028050,
        23.25249870,
        '088 942 8514',
        'https://www.simonacomplex.com/',
        NULL,
        '{food,laundry,restaurant,rv_park,point_of_interest,establishment,lodging,parking}',
        '{"periods":[{"open":{"day":0,"time":"0000"}}],"open_now":true,"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"]}',
        '{}',
        NULL,
        NULL,
        1.30,
        false,
        '2025-08-05T17:34:28.620Z',
        '2025-08-05T17:34:28.620Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fdacae24-f670-499b-b0ea-e28b10bde3b9',
        'ChIJ_aHYfmiFqkARigvqzjhDSwo',
        'CinnaMom''s bakery',
        'Old City Center, ul. "Graf Ignatiev" 37, 1400 Sofia, Bulgaria',
        42.68862070,
        23.32843860,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:34.580Z',
        '2025-08-05T17:34:34.580Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fe018509-d082-4949-94b9-07003b8f8491',
        'ChIJm4fqpMyFqkARcsb519mHDqc',
        'Marco''s Pizza',
        'Old City Center, ul. "Tsar Asen" 5, 1000 Sofia, Bulgaria',
        42.69462140,
        23.31959830,
        NULL,
        NULL,
        NULL,
        '{}',
        NULL,
        '{}',
        NULL,
        NULL,
        null,
        false,
        '2025-08-05T17:34:24.026Z',
        '2025-08-05T17:34:24.026Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'fed8f5cb-fe12-417c-8299-a0804f2b83d3',
        'ChIJTzp5rm6FqkAR7-zeuV3GSWQ',
        'Happy Bar & Grill',
        'Old City Center, pl. "Sveta Nedelya" 4, 1000 Sofia, Bulgaria',
        42.69657040,
        23.32046910,
        '0700 20 888',
        'https://happy.bg/',
        NULL,
        '{restaurant,establishment,food,point_of_interest}',
        '{"periods":[{"open":{"day":0,"time":"1100"},"close":{"day":0,"time":"2300"}},{"open":{"day":1,"time":"1100"},"close":{"day":1,"time":"2300"}},{"open":{"day":2,"time":"1100"},"close":{"day":2,"time":"2300"}},{"open":{"day":3,"time":"1100"},"close":{"day":3,"time":"2300"}},{"open":{"day":4,"time":"1100"},"close":{"day":4,"time":"2300"}},{"open":{"day":5,"time":"1100"},"close":{"day":5,"time":"2300"}},{"open":{"day":6,"time":"1100"},"close":{"day":6,"time":"2300"}}],"open_now":true,"weekday_text":["Monday: 11:00 AM – 11:00 PM","Tuesday: 11:00 AM – 11:00 PM","Wednesday: 11:00 AM – 11:00 PM","Thursday: 11:00 AM – 11:00 PM","Friday: 11:00 AM – 11:00 PM","Saturday: 11:00 AM – 11:00 PM","Sunday: 11:00 AM – 11:00 PM"]}',
        '{}',
        NULL,
        NULL,
        2.70,
        false,
        '2025-08-05T17:34:20.697Z',
        '2025-08-05T17:34:20.697Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        'ff6baf19-058d-44f2-b421-3970e6af5640',
        'ChIJF7B5R6OFqkARmG1rgWgpUBg',
        'Maymunarnika',
        'София, Алеята над колодрума, Borisova Gradina, Колодрум Сердика, 1164 Sofia, Bulgaria',
        42.68318220,
        23.34284890,
        '087 960 2112',
        'https://maimunarnika.bg/',
        NULL,
        '{bar,point_of_interest,establishment}',
        '{"periods":[{"open":{"day":0,"time":"0900"},"close":{"day":1,"time":"0200"}},{"open":{"day":1,"time":"0900"},"close":{"day":2,"time":"0200"}},{"open":{"day":2,"time":"0900"},"close":{"day":3,"time":"0200"}},{"open":{"day":3,"time":"0900"},"close":{"day":4,"time":"0200"}},{"open":{"day":4,"time":"0900"},"close":{"day":5,"time":"0200"}},{"open":{"day":5,"time":"0900"},"close":{"day":6,"time":"0200"}},{"open":{"day":6,"time":"0900"},"close":{"day":0,"time":"0200"}}],"open_now":true,"weekday_text":["Monday: 9:00 AM – 2:00 AM","Tuesday: 9:00 AM – 2:00 AM","Wednesday: 9:00 AM – 2:00 AM","Thursday: 9:00 AM – 2:00 AM","Friday: 9:00 AM – 2:00 AM","Saturday: 9:00 AM – 2:00 AM","Sunday: 9:00 AM – 2:00 AM"]}',
        '{}',
        NULL,
        NULL,
        1.00,
        false,
        '2025-08-05T17:34:26.384Z',
        '2025-08-05T17:34:26.384Z',
        NULL
      ) ON CONFLICT (id) DO NOTHING;


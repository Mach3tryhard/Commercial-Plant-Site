DROP TABLE IF EXISTS plante;
DROP TYPE IF EXISTS categ_planta;
DROP TYPE IF EXISTS mod_prezentare;

-- 1. Categoria Mare (maxim 5 valori conform cerintei)
CREATE TYPE categ_planta AS ENUM ('interior', 'exterior', 'decorativ', 'medicinal', 'exotic');

-- 2. Modul de categorizare secundar (mod prezentare)
CREATE TYPE mod_prezentare AS ENUM ('ghiveci', 'buchet', 'seminte', 'floare taiata');

CREATE TABLE IF NOT EXISTS plante (
    id serial PRIMARY KEY,
    nume VARCHAR(100) UNIQUE NOT NULL,
    descriere TEXT,
    imagine VARCHAR(300), -- Calea catre imagine
    categorie categ_planta NOT NULL,
    prezentare mod_prezentare DEFAULT 'ghiveci',
    pret NUMERIC(8,2) NOT NULL CHECK (pret > 0),
    inaltime_cm INT NOT NULL CHECK (inaltime_cm >= 0), -- A doua caracteristica numerica
    data_adaugare DATE DEFAULT current_date, -- Caracteristica de tip Date
    culoare_principala VARCHAR(30), -- Caracteristica cu o singura valoare din set
    conditii_ingrijire TEXT, -- Mai multe valori (separate prin virgula conform cerintei)
    toxic_animale BOOLEAN NOT NULL DEFAULT FALSE -- Caracteristica booleana
);

INSERT INTO plante (nume, descriere, imagine, categorie, prezentare, pret, inaltime_cm, culoare_principala, conditii_ingrijire, toxic_animale) VALUES
('Snake Plant', 'Extrem de rezistentă, tolerează lumina slabă și udările rare.', 'Dracaena_trifasciata.jpg', 'interior', 'ghiveci', 45.00, 60, 'verde inchis', 'lumina slaba, udare rara, purificare aer', True),
('ZZ Plant', 'Cunoscută pentru frunzele cerate și toleranța la secetă.', 'Zamioculcas_zamiifolia.jpg', 'interior', 'ghiveci', 55.00, 50, 'verde lucios', 'umbra, udare rara, rezistenta', True),
('Pothos', 'Viță cu creștere rapidă, foarte ușor de propagat.', 'Marble_queen.jpg', 'interior', 'ghiveci', 30.00, 100, 'verde-galben', 'lumina medie, udare moderata, agatatoare', True),
('Spider Plant', 'Produce pui cu ușurință, aspect de fântână de frunze.', 'Chlorophytum_comosum.jpg', 'interior', 'ghiveci', 25.00, 30, 'verde-alb', 'lumina indirecta, udare saptamanala, netoxic', False),
('Aloe Vera', 'Suculentă funcțională cunoscută pentru proprietățile medicinale.', 'Aloe_vera.jpg', 'medicinal', 'ghiveci', 35.00, 40, 'verde deschis', 'soare plin, udare rara, sol nisipos', False),

('Monstera Deliciosa', 'Planta "cașcaval elvețian", un element de bază în designul interior.', 'Monstera_deliciosa.jpg', 'decorativ', 'ghiveci', 150.00, 120, 'verde', 'lumina indirecta, umiditate, spatiu generos', True),
('Fiddle Leaf Fig', 'Cerere mare, deși este sensibilă la mediul înconjurător.', 'Ficus_lyrata.jpg', 'decorativ', 'ghiveci', 220.00, 160, 'verde inchis', 'lumina multa, fara curenti de aer, udare precisa', True),
('Bird of Paradise', 'Adaugă o estetică tropicală dramatică spațiului.', 'Strelitzia_nicolai.jpg', 'exotic', 'ghiveci', 280.00, 180, 'verde gri', 'soare, mult spatiu, udare moderata', True),
('Rubber Tree', 'Foliaj de un verde închis spre burgundy care iese în evidență.', 'Ficus_elastica.jpg', 'decorativ', 'ghiveci', 130.00, 140, 'burgundy', 'lumina medie, curatare frunze, udare moderata', True),
('Dracaena Marginata', 'Aspect de copac cu frunze subțiri și arhitecturale.', 'Dracaena_marginata.jpg', 'interior', 'ghiveci', 90.00, 150, 'verde-rosu', 'lumina medie, rezistenta, udare rara', True),

('Pink Princess Philodendron', 'Foarte căutată pentru frunzele sale pestrițe cu roz.', 'Princess_philodendron.png', 'exotic', 'ghiveci', 350.00, 45, 'roz-negru', 'lumina filtrata, colectie, umiditate ridicata', True),
('String of Pearls', 'Suculentă curgătoare unică, ideală pentru ghivece suspendate.', 'Curio_rowleyanus.jpg', 'decorativ', 'ghiveci', 65.00, 80, 'verde', 'soare, udare rara, drenaj excelent', True),
('Alocasia Polly', 'Frunze întunecate, izbitoare, cu nervuri alb-argintii.', 'Alocasia_polly.jpg', 'exotic', 'ghiveci', 85.00, 40, 'verde metalic', 'umiditate, caldura, lumina indirecta', True),
('Calathea Orbifolia', 'Cunoscută pentru frunzele sale mari, rotunde și dungate.', 'Calathea_orbifolia.jpg', 'interior', 'ghiveci', 110.00, 50, 'verde argintiu', 'fara soare direct, umiditate mare, apa distilata', False),
('Hoya Kerrii', 'Vândută adesea ca o singură frunză în formă de inimă.', 'Hoya_kerrii.jpg', 'exotic', 'ghiveci', 45.00, 15, 'verde', 'lumina multa, udare foarte rara, cadou', False),

('Peace Lily', 'Excelentă pentru purificarea aerului; "anunță" când vrea apă.', 'Peace_lily.jpg', 'interior', 'ghiveci', 40.00, 50, 'alb-verde', 'umbra, udare abundenta, purificare aer', True),
('Echeveria', 'Suculentă compactă și colorată, ușor de expediat.', 'Assorted_succulents.jpg', 'decorativ', 'ghiveci', 20.00, 10, 'albastrui-roz', 'soare, udare minima, compacta', False),
('Jade Plant', 'Simbolizează norocul și are o durată de viață foarte lungă.', 'Crassula_ovata.jpg', 'decorativ', 'ghiveci', 35.00, 25, 'verde smarald', 'soare, udare rara, longevitate', False),
('Air Plants', 'Nu necesită sol; unice și foarte ieftin de expediat.', 'Air_plants.jpg', 'exotic', 'seminte', 15.00, 10, 'verde gri', 'pulverizare apa, fara sol, ventilatie', False),
('African Violet', 'Oferă culoare constantă la interior prin florile sale.', 'African_violet.jpg', 'interior', 'ghiveci', 25.00, 15, 'violet', 'apa la baza, lumina indirecta, inflorire constanta', False);
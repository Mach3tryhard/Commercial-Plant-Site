DROP TABLE IF EXISTS plante;
DROP TYPE IF EXISTS categ_planta;
DROP TYPE IF EXISTS mod_prezentare;
DROP TYPE IF EXISTS culoare_planta;

-- Categoria Mare
CREATE TYPE categ_planta AS ENUM ('interior', 'exterior', 'decorativ', 'medicinal', 'exotic');

-- Modul de categorizare secundar
CREATE TYPE mod_prezentare AS ENUM ('ghiveci', 'buchet', 'seminte', 'floare taiata');

-- Enum pentru culori
CREATE TYPE culoare_planta AS ENUM (
    'verde', 'smarald', 'masliniu', 'lime', 'menta', 'fistic', 
    'kaki', 'salvie', 'argintiu', 'purpuriu', 'carmin', 'roz', 
    'jad', 'glauc', 'alb', 'cian', 'bordo', 'violet'
);

CREATE TABLE IF NOT EXISTS plante (
    id serial PRIMARY KEY,
    nume VARCHAR(100) UNIQUE NOT NULL,
    descriere TEXT,
    imagine VARCHAR(300),
    categorie categ_planta NOT NULL,
    prezentare mod_prezentare DEFAULT 'ghiveci',
    pret NUMERIC(8,2) NOT NULL CHECK (pret > 0),
    inaltime_cm INT NOT NULL CHECK (inaltime_cm >= 0),
    data_adaugare DATE DEFAULT current_date,
    culoare_principala culoare_planta,
    conditii_ingrijire TEXT,
    toxic_animale BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO plante (nume, descriere, imagine, categorie, prezentare, pret, inaltime_cm, culoare_principala, conditii_ingrijire, toxic_animale) VALUES
('Snake Plant', 'O plantă extrem de rezistentă, ideală pentru începători, care tolerează excelent lumina slabă și perioadele lungi fără apă. Pe lângă aspectul său arhitectural, este recunoscută pentru capacitatea sa remarcabilă de a purifica aerul din încăperi pe timpul nopții.', 'Dracaena_trifasciata.jpg', 'interior', 'ghiveci', 45.00, 60, 'smarald', 'lumina slaba, udare rara, purificare aer', True),

('ZZ Plant', 'Cunoscută pentru frunzele sale groase, cerate, care reflectă lumina, această plantă adaugă un strop de vitalitate oricărui spațiu. Este renumită pentru toleranța sa la secetă și la condiții de iluminare redusă, având un sistem radicular care stochează apa eficient.', 'Zamioculcas_zamiifolia.jpg', 'interior', 'ghiveci', 55.00, 50, 'verde', 'umbra, udare rara, rezistenta', True),

('Pothos', 'O plantă curgătoare cu o creștere extrem de rapidă, perfectă pentru rafturi înalte sau coșuri suspendate. Este foarte ușor de întreținut și propagat, adaptându-se la o varietate mare de medii și niveluri de umiditate din locuință.', 'Marble_queen.jpg', 'interior', 'ghiveci', 30.00, 100, 'lime', 'lumina medie, udare moderata, agatatoare', True),

('Spider Plant', 'Formează o rozetă densă de frunze arcuite, asemănătoare unei fântâni arteziene vegetale. Produce în mod constant tulpini lungi cu pui la capete, fiind foarte ușor de înmulțit și excelentă pentru familiile cu animale de companie.', 'Chlorophytum_comosum.jpg', 'interior', 'ghiveci', 25.00, 30, 'menta', 'lumina indirecta, udare saptamanala, netoxic', False),

('Aloe Vera', 'O suculentă clasică, apreciată nu doar pentru aspectul său deosebit, ci și pentru gelul din interiorul frunzelor, folosit în tratamente dermatologice. Preferă locațiile însorite și necesită un sol cu drenaj foarte bun pentru a preveni putrezirea rădăcinilor.', 'Aloe_vera.jpg', 'medicinal', 'ghiveci', 35.00, 40, 'fistic', 'soare plin, udare rara, sol nisipos', False),

('Monstera Deliciosa', 'Cunoscută sub denumirea de planta cașcaval elvețian datorită perforațiilor naturale ale frunzelor sale masive. Este un element de design interior foarte popular care are nevoie de mult spațiu pentru a se dezvolta spectaculos.', 'Monstera_deliciosa.jpg', 'decorativ', 'ghiveci', 150.00, 120, 'verde', 'lumina indirecta, umiditate, spatiu generos', True),

('Fiddle Leaf Fig', 'Un arbore de interior spectaculos, cu frunze mari, sub formă de liră, care aduce un impact vizual puternic în orice încăpere. Necesită un mediu stabil, cu multă lumină indirectă și udare precisă, fiind sensibilă la schimbările bruște de temperatură.', 'Ficus_lyrata.jpg', 'decorativ', 'ghiveci', 220.00, 160, 'masliniu', 'lumina multa, fara curenti de aer, udare precisa', True),

('Bird of Paradise', 'O plantă impunătoare care adaugă o estetică tropicală dramatică și luxuriantă spațiului tău. Necesită ferestre mari, luminoase, și spațiu generos pe verticală, frunzele sale asemănându-se cu cele ale bananierului.', 'Strelitzia_nicolai.jpg', 'exotic', 'ghiveci', 280.00, 180, 'glauc', 'soare, mult spatiu, udare moderata', True),

('Rubber Tree', 'Iese în evidență prin frunzișul său robust, de o nuanță închisă elegantă, oferind un contrast excelent în decor. Curățarea regulată a frunzelor cu o cârpă umedă nu doar că îi menține aspectul lucios, dar ajută și planta să respire.', 'Ficus_elastica.jpg', 'decorativ', 'ghiveci', 130.00, 140, 'bordo', 'lumina medie, curatare frunze, udare moderata', True),

('Dracaena Marginata', 'Se remarcă printr-un trunchi subțire, elegant, încoronat cu o cascadă de frunze înguste, mărginite fin. Oferă un aspect de palmier arhitectural, fiind perfectă pentru colțurile goale ale camerei și necesitând o îngrijire minimă.', 'Dracaena_marginata.jpg', 'interior', 'ghiveci', 90.00, 150, 'carmin', 'lumina medie, rezistenta, udare rara', True),

('Pink Princess Philodendron', 'O varietate extrem de căutată de colecționari, faimoasă pentru variațiile sale naturale de culoare pe un fundal întunecat. Pentru a menține acest model spectaculos, are nevoie de un echilibru perfect de lumină filtrată și umiditate ridicată.', 'Princess_philodendron.png', 'exotic', 'ghiveci', 350.00, 45, 'roz', 'lumina filtrata, colectie, umiditate ridicata', True),

('String of Pearls', 'O suculentă curgătoare unică, ale cărei frunze sferice seamănă cu niște boabe de mazăre sau perle înșirate pe un fir. Este ideală pentru ghivecele suspendate, necesitând multă lumină solară directă și udări rare.', 'Curio_rowleyanus.jpg', 'decorativ', 'ghiveci', 65.00, 80, 'jad', 'soare, udare rara, drenaj excelent', True),

('Alocasia Polly', 'Prezintă frunze în formă de săgeată, de un verde profund, traversate de nervuri proeminente contrastante. Este o plantă tropicală care iubește căldura și umiditatea crescută, aducând un aer exotic și sofisticat.', 'Alocasia_polly.jpg', 'exotic', 'ghiveci', 85.00, 40, 'smarald', 'umiditate, caldura, lumina indirecta', True),

('Calathea Orbifolia', 'Apreciată pentru frunzele sale supradimensionate, rotunde, decorate cu dungi paralele elegante. Este o plantă care preferă o umiditate ridicată și este sensibilă la apa de la robinet, necesitând apă distilată sau filtrată.', 'Calathea_orbifolia.jpg', 'interior', 'ghiveci', 110.00, 50, 'salvie', 'fara soare direct, umiditate mare, apa distilata', False),

('Hoya Kerrii', 'Adesea oferită cadou, această plantă este vândută frecvent sub forma unei singure frunze înrădăcinate, în formă de inimă perfectă. Ca plantă matură, crește sub formă de liană și produce flori parfumate, având cerințe minime de apă.', 'Hoya_kerrii.jpg', 'exotic', 'buchet', 45.00, 15, 'verde', 'lumina multa, udare foarte rara, cadou', False),

('Peace Lily', 'O plantă grațioasă care produce flori elegante, asemănătoare unor steaguri, și excelează în filtrarea aerului. Este recunoscută pentru faptul că își lasă frunzele în jos atunci când este însetată, comunicând clar nevoia de apă.', 'Peace_lily.jpg', 'interior', 'ghiveci', 40.00, 50, 'alb', 'umbra, udare abundenta, purificare aer', True),

('Echeveria', 'Formează rozete compacte, geometrice, acoperite adesea cu un strat de pruină care le protejează de soarele puternic. Este extrem de rezistentă și reprezintă o alegere excelentă pentru aranjamente decorative de mici dimensiuni.', 'Assorted_succulents.jpg', 'exterior', 'ghiveci', 20.00, 10, 'cian', 'soare, udare minima, compacta', False),

('Jade Plant', 'Cunoscută și sub numele de arborele banilor, această suculentă arborescentă este considerată un simbol al prosperității. Cu o îngrijire adecvată, are o durată de viață extraordinar de lungă și dezvoltă un trunchi lemnos impresionant.', 'Crassula_ovata.jpg', 'exterior', 'buchet', 35.00, 25, 'smarald', 'soare, udare rara, longevitate', False),

('Air Plants', 'Plante epifite fascinante care nu necesită sol pentru a supraviețui, extrăgându-și apa și nutrienții direct din mediul înconjurător. Oferă libertate totală în decorare, putând fi atașate de lemne decorative sau așezate în terarii.', 'Air_plants.jpg', 'exterior', 'seminte', 15.00, 10, 'argintiu', 'pulverizare apa, fara sol, ventilatie', False),

('African Violet', 'O plantă de dimensiuni mici care recompensează îngrijitorul cu o înflorire aproape continuă pe tot parcursul anului. Frunzele sale catifelate sunt sensibile la apa rece, motiv pentru care se recomandă udarea exclusiv pe la baza ghiveciului.', 'African_violet.jpg', 'interior', 'floare taiata', 25.00, 15, 'violet', 'apa la baza, lumina indirecta, inflorire constanta', False);
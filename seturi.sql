CREATE TABLE seturi (
    id SERIAL PRIMARY KEY,
    nume_set VARCHAR(100) NOT NULL,
    descriere_set TEXT
);

CREATE TABLE asociere_set (
    id SERIAL PRIMARY KEY,
    id_set INT REFERENCES seturi(id) ON DELETE CASCADE,
    id_produs INT REFERENCES plante(id) ON DELETE CASCADE
);

INSERT INTO seturi (nume_set, descriere_set) VALUES
('Set Purificarea Aerului', 'O combinație ideală de plante recunoscute pentru eliminarea toxinelor din locuință.'),
('Set Mini Oază Tropicală', 'Plante exotice cu frunziș bogat care aduc atmosfera tropicală direct în camera ta.'),
('Set Începător Fără Griji', 'Selecție de plante rezistente, perfecte pentru spații cu lumină redusă sau udare rară.'),
('Set Balcon Colorat', 'Grup de plante decorative ce oferă accente cromatice deosebite în orice colț luminos.'),
('Set Colecția de Birou', 'Plante de dimensiuni mici care se adaptează excelent pe suprafețe reduse și birouri.');

INSERT INTO asociere_set (id_set, id_produs) VALUES
(1, 1), (1, 2),
(2, 2), (2, 3), (2, 4),
(3, 1), (3, 3),
(4, 4), (4, 5),
(5, 1), (5, 5);
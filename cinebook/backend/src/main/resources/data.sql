-- ============================================================
-- CineBook Sample Data (MySQL Compatible)
-- Database: cinebook_db
-- 30 Complete Popular Movies with Real Posters & Multiple Shows
-- ============================================================

-- Disable foreign key checks for clean seeding
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Sample Users (Default user password: password123)
INSERT INTO users (user_id, name, email, password) VALUES
(1, 'Rahul Sharma', 'rahul@example.com', 'password123'),
(2, 'Priya Patel', 'priya@example.com', 'password123')
ON DUPLICATE KEY UPDATE name=name;

-- 2. 30 Popular Movies with Verified Promotional Posters
INSERT INTO movies (movie_id, title, genre, duration, rating, description, poster_url) VALUES
(1, 'Avengers: Endgame', 'Action, Sci-Fi', '181 min', '8.4', 'After devastating events wiped out half the universe, the remaining Avengers assemble once more to reverse Thanos actions and restore balance to the cosmos.', 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg'),
(2, 'Avengers: Infinity War', 'Action, Sci-Fi', '149 min', '8.4', 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of ruin destroys the universe.', 'https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg'),
(3, 'Spider-Man: No Way Home', 'Action, Adventure, Fantasy', '148 min', '8.2', 'With Spider-Mans identity revealed, Peter turns to Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds appear.', 'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg'),
(4, 'The Dark Knight', 'Action, Crime, Drama', '152 min', '9.0', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg'),
(5, 'Inception', 'Science Fiction, Action', '148 min', '8.8', 'A skilled thief who steals corporate secrets through dream-sharing technology is offered a chance to erase his criminal past by executing inception.', 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg'),
(6, 'Interstellar', 'Science Fiction, Adventure, Drama', '169 min', '8.7', 'When Earth becomes uninhabitable, a former NASA pilot leads a crew on an audacious interstellar voyage through a mysterious wormhole.', 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'),
(7, 'Titanic', 'Romance, Drama', '194 min', '7.9', 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic in 1912.', 'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png'),
(8, 'Avatar', 'Science Fiction, Action, Adventure', '162 min', '7.9', 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is home.', 'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg'),
(9, 'Avatar: The Way of Water', 'Science Fiction, Adventure, Action', '192 min', '7.6', 'Jake Sully lives with his family on Pandora. When a familiar threat returns, Jake and Neytiri must rally the Na vi to protect their oceanic home.', 'https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg'),
(10, 'Jurassic World', 'Action, Adventure, Science Fiction', '124 min', '7.0', 'A new theme park built on the original site of Jurassic Park creates a genetically modified hybrid dinosaur, which escapes and goes on a rampage.', 'https://upload.wikimedia.org/wikipedia/en/6/6e/Jurassic_World_poster.jpg'),
(11, 'Fast X', 'Action, Crime, Thriller', '141 min', '5.8', 'Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes, Dante, who seeks retribution for his fathers death.', 'https://upload.wikimedia.org/wikipedia/en/1/13/Fast_X_poster.jpg'),
(12, 'John Wick: Chapter 4', 'Action, Thriller, Crime', '169 min', '7.7', 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with global alliances.', 'https://upload.wikimedia.org/wikipedia/en/3/3b/John_Wick_-_Chapter_4_promotional_poster.jpg'),
(13, 'Mission: Impossible - Dead Reckoning', 'Action, Thriller, Adventure', '163 min', '7.7', 'Ethan Hunt and his IMF team embark on their most dangerous mission yet: to track down a terrifying AI weapon before it falls into the wrong hands.', 'https://upload.wikimedia.org/wikipedia/en/e/ed/Mission_Impossible_%E2%80%93_Dead_Reckoning_Part_One_poster.jpg'),
(14, 'Oppenheimer', 'Drama, History, Thriller', '180 min', '8.9', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II with the Manhattan Project.', 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg'),
(15, 'Barbie', 'Comedy, Fantasy, Adventure', '114 min', '6.8', 'Barbie and Ken leave Barbie Land for the real world, discovering the joys and perils of living among humans in this vibrant, thoughtful comedy.', 'https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg'),
(16, 'The Batman', 'Action, Crime, Drama', '176 min', '7.8', 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city hidden corruption.', 'https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg'),
(17, 'Doctor Strange in the Multiverse of Madness', 'Action, Fantasy, Science Fiction', '126 min', '6.9', 'Doctor Strange teams up with America Chavez, a teenager who can travel across multiverses, to battle multiple threats across alternate dimensions.', 'https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg'),
(18, 'Black Panther: Wakanda Forever', 'Action, Adventure, Drama', '161 min', '6.7', 'The people of Wakanda fight to protect their home from intervening world powers as they mourn King T Challa and confront Namor of Talokan.', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Black_Panther_Wakanda_Forever_poster.jpg'),
(19, 'Iron Man', 'Action, Science Fiction, Adventure', '126 min', '7.9', 'After being held captive in an Afghan cave, billionaire Tony Stark creates an advanced armored suit to fight evil and redeem his past.', 'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg'),
(20, 'Captain America: Civil War', 'Action, Science Fiction, Thriller', '147 min', '7.8', 'Political oversight in the Avengers operations sparks a rift between Steve Rogers and Tony Stark, fracturing the heroes into opposing sides.', 'https://upload.wikimedia.org/wikipedia/en/5/53/Captain_America_Civil_War_poster.jpg'),
(21, 'Pushpa: The Rise', 'Action, Crime, Drama', '179 min', '7.6', 'Violence erupts between red sandalwood smugglers and police in the Seshachalam forests as Pushpa Raj rises through the criminal hierarchy.', 'https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg'),
(22, 'Pushpa 2: The Rule', 'Action, Thriller, Drama', '179 min', '8.1', 'Pushpa Raj expands his sandalwood empire into international territories while locked in a relentless confrontation with SP Bhanwar Singh Shekhawat.', 'https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2_The_Rule.jpg'),
(23, 'Jawan', 'Action, Thriller', '169 min', '8.2', 'A high-octane emotional journey of a vigilante officer who sets out to rectify the wrongs in society, against the backdrop of an old promise.', 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg'),
(24, 'Chhava', 'Action, Historical, Drama', '160 min', '8.6', 'The epic saga of Chhatrapati Sambhaji Maharaj, showcasing his fierce leadership, battlefield bravery, and unwavering commitment to Swarajya.', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Chhaava_poster.jpg/220px-Chhaava_poster.jpg'),
(25, 'K.G.F: Chapter 2', 'Action, Crime, Drama', '168 min', '8.3', 'In the blood-soaked Kolar Gold Fields, Rocky commands terror and devotion while confronting formidable rivals and the armed government.', 'https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg'),
(26, 'RRR', 'Action, Drama, Adventure', '187 min', '7.8', 'A fearless revolutionary and a dedicated police officer forge an unbreakable brotherhood before discovering each others true revolutionary missions.', 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg'),
(27, 'Baahubali 2: The Conclusion', 'Action, Fantasy, Drama', '167 min', '8.2', 'When Shiva learns of his royal heritage and the betrayal of Amarendra Baahubali, he sets out to reclaim the throne of the Mahishmati Kingdom.', 'https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg'),
(28, 'Animal', 'Action, Crime, Drama', '201 min', '6.6', 'The fiercely devoted son of a wealthy industrialist undergoes a violent transformation of vengeance after an assassination attempt on his father.', 'https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg'),
(29, 'Dangal', 'Drama, Biography, Sport', '161 min', '8.3', 'Former wrestler Mahavir Singh Phogat coaches his daughters Geeta and Babita towards international glory in the Commonwealth Games.', 'https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg'),
(30, '3 Idiots', 'Comedy, Drama', '170 min', '8.4', 'Two friends search for their long-lost companion Rancho, recalling the unforgettable memories and revolutionary ideas of their college days.', 'https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg')
ON DUPLICATE KEY UPDATE title=VALUES(title), genre=VALUES(genre), duration=VALUES(duration), rating=VALUES(rating), description=VALUES(description), poster_url=VALUES(poster_url);

-- 3. Shows for All 30 Movies (At least 3 shows per movie, with varied prices ₹150, ₹200, ₹250, ₹300)
INSERT INTO shows (show_id, movie_id, show_date, show_time, ticket_price) VALUES
-- Avengers: Endgame (Movie 1)
(1, 1, '2026-09-10', '10:00 AM', 200.0),
(2, 1, '2026-09-10', '01:00 PM', 250.0),
(3, 1, '2026-09-10', '04:00 PM', 250.0),
(4, 1, '2026-09-10', '07:00 PM', 300.0),

-- Avengers: Infinity War (Movie 2)
(5, 2, '2026-09-10', '10:30 AM', 180.0),
(6, 2, '2026-09-10', '02:00 PM', 220.0),
(7, 2, '2026-09-10', '06:00 PM', 280.0),

-- Spider-Man: No Way Home (Movie 3)
(8, 3, '2026-09-10', '11:00 AM', 200.0),
(9, 3, '2026-09-10', '03:15 PM', 250.0),
(10, 3, '2026-09-10', '07:30 PM', 300.0),

-- The Dark Knight (Movie 4)
(11, 4, '2026-09-10', '10:00 AM', 180.0),
(12, 4, '2026-09-10', '02:30 PM', 220.0),
(13, 4, '2026-09-10', '08:00 PM', 280.0),

-- Inception (Movie 5)
(14, 5, '2026-09-10', '11:15 AM', 200.0),
(15, 5, '2026-09-10', '03:45 PM', 250.0),
(16, 5, '2026-09-10', '07:45 PM', 300.0),

-- Interstellar (Movie 6)
(17, 6, '2026-09-11', '10:00 AM', 220.0),
(18, 6, '2026-09-11', '02:15 PM', 260.0),
(19, 6, '2026-09-11', '07:00 PM', 300.0),

-- Titanic (Movie 7)
(20, 7, '2026-09-11', '11:00 AM', 150.0),
(21, 7, '2026-09-11', '03:30 PM', 200.0),
(22, 7, '2026-09-11', '08:00 PM', 250.0),

-- Avatar (Movie 8)
(23, 8, '2026-09-11', '10:30 AM', 200.0),
(24, 8, '2026-09-11', '02:45 PM', 250.0),
(25, 8, '2026-09-11', '07:15 PM', 300.0),

-- Avatar: The Way of Water (Movie 9)
(26, 9, '2026-09-11', '10:00 AM', 220.0),
(27, 9, '2026-09-11', '02:30 PM', 280.0),
(28, 9, '2026-09-11', '07:30 PM', 300.0),

-- Jurassic World (Movie 10)
(29, 10, '2026-09-11', '11:30 AM', 180.0),
(30, 10, '2026-09-11', '03:30 PM', 220.0),
(31, 10, '2026-09-11', '06:45 PM', 260.0),

-- Fast X (Movie 11)
(32, 11, '2026-09-12', '10:00 AM', 180.0),
(33, 11, '2026-09-12', '01:45 PM', 220.0),
(34, 11, '2026-09-12', '06:15 PM', 280.0),

-- John Wick: Chapter 4 (Movie 12)
(35, 12, '2026-09-12', '11:15 AM', 220.0),
(36, 12, '2026-09-12', '03:30 PM', 260.0),
(37, 12, '2026-09-12', '08:00 PM', 300.0),

-- Mission: Impossible - Dead Reckoning (Movie 13)
(38, 13, '2026-09-12', '10:30 AM', 200.0),
(39, 13, '2026-09-12', '02:45 PM', 250.0),
(40, 13, '2026-09-12', '07:15 PM', 300.0),

-- Oppenheimer (Movie 14)
(41, 14, '2026-09-12', '10:00 AM', 220.0),
(42, 14, '2026-09-12', '02:15 PM', 280.0),
(43, 14, '2026-09-12', '06:45 PM', 300.0),

-- Barbie (Movie 15)
(44, 15, '2026-09-12', '11:00 AM', 180.0),
(45, 15, '2026-09-12', '02:30 PM', 220.0),
(46, 15, '2026-09-12', '06:00 PM', 250.0),

-- The Batman (Movie 16)
(47, 16, '2026-09-12', '12:00 PM', 200.0),
(48, 16, '2026-09-12', '04:30 PM', 250.0),
(49, 16, '2026-09-12', '08:30 PM', 300.0),

-- Doctor Strange in the Multiverse of Madness (Movie 17)
(50, 17, '2026-09-13', '10:00 AM', 180.0),
(51, 17, '2026-09-13', '01:30 PM', 220.0),
(52, 17, '2026-09-13', '05:45 PM', 260.0),

-- Black Panther: Wakanda Forever (Movie 18)
(53, 18, '2026-09-13', '11:00 AM', 200.0),
(54, 18, '2026-09-13', '03:15 PM', 250.0),
(55, 18, '2026-09-13', '07:30 PM', 280.0),

-- Iron Man (Movie 19)
(56, 19, '2026-09-13', '10:30 AM', 150.0),
(57, 19, '2026-09-13', '02:00 PM', 200.0),
(58, 19, '2026-09-13', '06:30 PM', 250.0),

-- Captain America: Civil War (Movie 20)
(59, 20, '2026-09-13', '11:15 AM', 180.0),
(60, 20, '2026-09-13', '03:00 PM', 220.0),
(61, 20, '2026-09-13', '07:15 PM', 260.0),

-- Pushpa: The Rise (Movie 21)
(62, 21, '2026-09-13', '10:00 AM', 180.0),
(63, 21, '2026-09-13', '02:30 PM', 220.0),
(64, 21, '2026-09-13', '07:00 PM', 260.0),

-- Pushpa 2: The Rule (Movie 22)
(65, 22, '2026-09-14', '10:00 AM', 220.0),
(66, 22, '2026-09-14', '02:00 PM', 260.0),
(67, 22, '2026-09-14', '06:30 PM', 300.0),
(68, 22, '2026-09-14', '09:30 PM', 300.0),

-- Jawan (Movie 23)
(69, 23, '2026-09-14', '11:00 AM', 200.0),
(70, 23, '2026-09-14', '03:30 PM', 250.0),
(71, 23, '2026-09-14', '08:00 PM', 280.0),

-- Chhava (Movie 24)
(72, 24, '2026-09-14', '10:30 AM', 220.0),
(73, 24, '2026-09-14', '03:00 PM', 260.0),
(74, 24, '2026-09-14', '07:45 PM', 300.0),

-- K.G.F: Chapter 2 (Movie 25)
(75, 25, '2026-09-14', '11:30 AM', 200.0),
(76, 25, '2026-09-14', '04:15 PM', 250.0),
(77, 25, '2026-09-14', '08:45 PM', 300.0),

-- RRR (Movie 26)
(78, 26, '2026-09-15', '10:00 AM', 220.0),
(79, 26, '2026-09-15', '02:15 PM', 260.0),
(80, 26, '2026-09-15', '07:00 PM', 300.0),

-- Baahubali 2: The Conclusion (Movie 27)
(81, 27, '2026-09-15', '10:30 AM', 200.0),
(82, 27, '2026-09-15', '03:00 PM', 250.0),
(83, 27, '2026-09-15', '07:30 PM', 280.0),

-- Animal (Movie 28)
(84, 28, '2026-09-15', '11:00 AM', 200.0),
(85, 28, '2026-09-15', '03:45 PM', 250.0),
(86, 28, '2026-09-15', '08:30 PM', 300.0),

-- Dangal (Movie 29)
(87, 29, '2026-09-15', '10:00 AM', 150.0),
(88, 29, '2026-09-15', '02:30 PM', 200.0),
(89, 29, '2026-09-15', '06:30 PM', 250.0),

-- 3 Idiots (Movie 30)
(90, 30, '2026-09-15', '11:30 AM', 180.0),
(91, 30, '2026-09-15', '03:30 PM', 220.0),
(92, 30, '2026-09-15', '07:45 PM', 260.0)
ON DUPLICATE KEY UPDATE ticket_price=VALUES(ticket_price), show_time=VALUES(show_time), show_date=VALUES(show_date);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

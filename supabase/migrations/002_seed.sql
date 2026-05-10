-- Seed 30 locations across 5 categories
-- pano_id values are placeholders — must be verified in Street View API before production
insert into locations (name, category, difficulty, lat, lng, pano_id, heading, pitch) values

-- Landmarks (6)
('Sage Chapel', 'landmark', 1, 42.447512, -76.484524, 'Q7psJc10iIg4BTZ0e8abzQ', 180, 10),
('Statue of Ezra Cornell', 'landmark', 2, 42.449101, -76.485144, 'gQmR6Y1av5J4mIowj7jzdw', 90, 5),
('Uris Library Clock Tower', 'landmark', 1, 42.447867, -76.484894, 'gbKXBxU1LVIftNZIzE0JaA', 0, 15),
('Willard Straight Hall Entrance', 'landmark', 1, 42.447025, -76.486544, 'dpjnjU6KtwVVDJOGRi9wtA', 270, 0),
('Lynah Rink', 'landmark', 2, 42.445259, -76.477569, 'CJe5zHChOd0TmEZeNWzJVg', 45, 0),
('The Dairy Bar', 'landmark', 2, 42.447552, -76.471643, 'mMUTQKX43IM6NwpzqXOsZg', 135, 0),

-- Academic (6)
('Duffield Hall Glass Facade', 'academic', 2, 42.444322, -76.483312, 'smpDfhMR8wUD6uPicZoz2A', 0, 5),
('Arts Quad Center', 'academic', 1, 42.449056, -76.484167, 'V_7fi4JOkCdAEj58tySGBw', 180, 0),
('Ag Quad', 'academic', 2, 42.448768, -76.477933, '8vGiePxK7ndL_WNrhIN35A', 90, 0),
('Mann Library Steps', 'academic', 2, 42.448825, -76.476785, 'UgcQkEtshm14qNL4dE-sQA', 270, 5),
('Kennedy Hall', 'academic', 3, 42.448134, -76.479735, '2xOUBvCd1Qw-I0rH9DmTXg', 0, 0),
('Statler Hall', 'academic', 2, 42.445372, -76.481591, 'yqzQH4WOlncD4aBlvkqVfQ', 180, 0),

-- Residential (6)
('Balch Hall', 'residential', 2, 42.452965, -76.480152, 'yFWRZ7u__rJfKqtCk2FAbA', 270, 0),
('Risley Hall', 'residential', 3, 42.453453, -76.481448, 'zaaKrv0djqscEhYEC3qvcA', 180, 5),
('High Rise 5', 'residential', 1, 42.4555, -76.4759, 'mHsxjjOdbYWe6i_i3no2wQ', 90, 0),
('RPCC Exterior', 'residential', 2, 42.456236, -76.477568, 'urERXi3XhexarUhH6y9-_A', 180, 0),
('Court-Kay-Bauer Hall', 'residential', 2, 42.4546, -76.4767, 'ThyIRAdt35bA8L8-lyNsDA', 270, 0),
('Donlon Hall', 'residential', 3, 42.455142, -76.477871, 'GNra_ddmne9rx-IW8Tp_gw', 0, 0),

-- Gorge / outdoor (6)
('Beebe Lake Dam', 'gorge', 2, 42.451733, -76.479932, 'kK1nX7g0vnLlf5FrEKbrwg', 90, -5),
('The Fuertes Observatory', 'gorge', 2, 42.452674, -76.474425, 'zu1U5coZBtVMz3s_f_vWPg', 270, 10),
('Sibley Hall', 'gorge', 1, 42.451280, -76.485006, 'BHwpjwuNe9ECwiMwj-t68A', 0, 0),
('Cascadilla Gorge Trail Entrance', 'gorge', 3, 42.443051, -76.485877, 'V3XnQ5dosnAYpGWGt05j-Q', 45, 0),
('Libe Slope Top', 'gorge', 1, 42.449722, -76.485873, 'YoJnitPvSjLCofPfM6L0nA', 180, 5),
('Libe Slope Bottom', 'gorge', 2, 42.448162, -76.487613, 'IYNToylMNh8J-WuJoBINZA', 0, -5),

-- Collegetown (6)
('Eddy Gate', 'collegetown', 2, 42.442378, -76.487493, 'T18EPRBnd9B3efbyVY89SQ', 90, 0),
('College Ave / Dryden Rd Intersection', 'collegetown', 1, 42.441619, -76.485246, 'PZhlEWIb0cVcqoc-6urSow', 0, 0),
('Collegetown Bagels Exterior', 'collegetown', 1, 42.442373, -76.485393, '0ucp3LppjHOIwUSkLhFHTQ', 180, 0),
('Cornell University Press', 'collegetown', 2, 42.439910, -76.491424, 'u4mK0LsHYm32eaCvFk87cA', 270, 0),
('Cascadilla Street Bridge', 'collegetown', 3, 42.443183, -76.484254, '3zNm_p7SQkQMdrbo2LaFIw', 90, -5),
('El Chamos', 'collegetown', 3, 42.441990, -76.489843, '0mivEEVXnbATffvwtCu7iw', 45, 10);

-- Seed 30 locations across 5 categories
-- pano_id values are placeholders — must be verified in Street View API before production
insert into locations (name, category, difficulty, lat, lng, pano_id, heading, pitch) values

-- Landmarks (6)
('McGraw Tower', 'landmark', 1, 42.4475, -76.4854, 'CIHM0ogKEICAgICaz5CKSg', 180, 10),
('Sage Chapel', 'landmark', 2, 42.4484, -76.4841, '6XtgUP0_3rbV-T9x53x9Kg', 90, 5),
('Uris Library Clock Tower', 'landmark', 1, 42.4479, -76.4843, 'gbKXBxU1LVIftNZIzE0JaA', 0, 15),
('Willard Straight Hall Entrance', 'landmark', 1, 42.4470, -76.4872, 'CIHM0ogKEICAgIDO4vDD6AE', 270, 0),
('Lynah Rink', 'landmark', 2, 42.445259, -76.477569, 'CJe5zHChOd0TmEZeNWzJVg', 45, 0),
('Cocktail Lounge', 'landmark', 2, 42.4476, -76.4856, 'ZXgwxI5p-EVCxz7yzySgkg', 135, 0),

-- Academic (6)
('Duffield Hall Glass Facade', 'academic', 2, 42.4443, -76.4832, 'tzhlkt7lBqWLd4aA2tZWLA', 0, 5),
('Arts Quad Center', 'academic', 1, 42.4485, -76.4847, 'Q6EnKykJpF8M4KFtoNNLlg', 180, 0),
('Ag Quad', 'academic', 2, 42.4494, -76.4780, 'aW6wNNB3xIt1i7UCziLenQ', 90, 0),
('Mann Library Steps', 'academic', 2, 42.4491, -76.4770, 'i_EJzAsIIToxdkePEZJSew', 270, 5),
('Kennedy Hall', 'academic', 3, 42.448134, -76.479735, '2xOUBvCd1Qw-I0rH9DmTXg', 0, 0),
('Statler Hall', 'academic', 2, 42.4463, -76.4826, 'e7mjQFkDj5aGqfCGmOoqiA', 180, 0),

-- Residential (6)
('Balch Hall', 'residential', 2, 42.452965, -76.480152, 'yFWRZ7u__rJfKqtCk2FAbA', 270, 0),
('Risley Hall', 'residential', 3, 42.453453, -76.481448, 'zaaKrv0djqscEhYEC3qvcA', 180, 5),
('High Rise 5', 'residential', 1, 42.4555, -76.4759, 'mHsxjjOdbYWe6i_i3no2wQ', 90, 0),
('RPCC Exterior', 'residential', 2, 42.456236, -76.477568, 'urERXi3XhexarUhH6y9-_A', 180, 0),
('Court-Kay-Bauer Hall', 'residential', 2, 42.4546, -76.4767, 'ThyIRAdt35bA8L8-lyNsDA', 270, 0),
('Donlon Hall', 'residential', 3, 42.455142, -76.477871, 'GNra_ddmne9rx-IW8Tp_gw', 0, 0),

-- Gorge / outdoor (6)
('Beebe Lake Dam', 'gorge', 2, 42.451733, -76.479932, 'kK1nX7g0vnLlf5FrEKbrwg', 90, -5),
('Triphammer Falls', 'gorge', 2, 42.451123, -76.480636, 'qkj4DRfIxuHRroAdc0ymuA', 270, 10),
('Suspension Bridge over Fall Creek', 'gorge', 1, 42.451890, -76.486079, 'zF6aRZLPA3Jr0CKW_Zafag', 0, 0),
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

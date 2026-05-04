-- Seed 30 locations across 5 categories
-- pano_id values are placeholders — must be verified in Street View API before production
insert into locations (name, category, difficulty, lat, lng, pano_id, heading, pitch) values

-- Landmarks (6)
('McGraw Tower', 'landmark', 1, 42.4475, -76.4854, null, 180, 10),
('Sage Chapel', 'landmark', 2, 42.4484, -76.4841, null, 90, 5),
('Uris Library Clock Tower', 'landmark', 1, 42.4479, -76.4843, null, 0, 15),
('Willard Straight Hall Entrance', 'landmark', 1, 42.4470, -76.4872, null, 270, 0),
('A.D. White Statue', 'landmark', 2, 42.4478, -76.4858, null, 45, 0),
('Ezra Cornell Statue', 'landmark', 2, 42.4476, -76.4856, null, 135, 0),

-- Academic (6)
('Duffield Hall Glass Facade', 'academic', 2, 42.4443, -76.4832, null, 0, 5),
('Arts Quad Center', 'academic', 1, 42.4485, -76.4847, null, 180, 0),
('Ag Quad', 'academic', 2, 42.4494, -76.4780, null, 90, 0),
('Mann Library Steps', 'academic', 2, 42.4491, -76.4770, null, 270, 5),
('Kennedy Hall', 'academic', 3, 42.4498, -76.4774, null, 0, 0),
('Statler Hall', 'academic', 2, 42.4463, -76.4826, null, 180, 0),

-- Residential (6)
('Balch Hall', 'residential', 2, 42.4534, -76.4799, null, 270, 0),
('Risley Residential College', 'residential', 3, 42.4543, -76.4801, null, 180, 5),
('High Rise 5', 'residential', 1, 42.4555, -76.4759, null, 90, 0),
('RPCC Exterior', 'residential', 2, 42.4575, -76.4735, null, 180, 0),
('Court-Kay-Bauer Hall', 'residential', 2, 42.4546, -76.4767, null, 270, 0),
('Donlon Hall', 'residential', 3, 42.4558, -76.4781, null, 0, 0),

-- Gorge / outdoor (6)
('Beebe Lake Dam', 'gorge', 2, 42.4558, -76.4797, null, 90, -5),
('Triphammer Falls', 'gorge', 2, 42.4561, -76.4793, null, 270, 10),
('Suspension Bridge over Fall Creek', 'gorge', 1, 42.4553, -76.4803, null, 0, 0),
('Cascadilla Gorge Trail Entrance', 'gorge', 3, 42.4424, -76.4883, null, 45, 0),
('Libe Slope Top', 'gorge', 1, 42.4490, -76.4842, null, 180, 5),
('Libe Slope Bottom', 'gorge', 2, 42.4483, -76.4849, null, 0, -5),

-- Collegetown (6)
('Eddy Gate', 'collegetown', 2, 42.4437, -76.4882, null, 90, 0),
('College Ave / Dryden Rd Intersection', 'collegetown', 1, 42.4397, -76.4878, null, 0, 0),
('Collegetown Bagels Exterior', 'collegetown', 1, 42.4413, -76.4876, null, 180, 0),
('Schwartz Center for the Performing Arts', 'collegetown', 2, 42.4447, -76.4892, null, 270, 0),
('Cascadilla Street Bridge', 'collegetown', 3, 42.4421, -76.4919, null, 90, -5),
('Olin Hall from Below', 'collegetown', 3, 42.4451, -76.4887, null, 45, 10);

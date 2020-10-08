set SCHEMA ''

insert into ride_share.Authorization (driverId, vehicleId) values (1, 1);

insert into ride_share.Driver (id, userId, licenseNumber, licenseState) values (1, 1, 28, 1);

insert into ride_share.Drivers (driverId, rideId) values (1, 1);

insert into ride_share.Location (id, name, address, city, state, zipCode) values (1, 'Upland Post Office', '222 N Main St', 'Upland', 'IN', 46989);
insert into ride_share.Location (id, name, address, city, state, zipCode) values (2, 'Taylor University', '236 W Reade Ave', 'Upland', 'IN', 46989);

insert into ride_share.Passenger (passengerId, rideId) values (1, 1);

insert into ride_share.Ride (id, date, time, distance, fuelPrice, fee, vehicleId, fromLocationId, toLocationId) values (1, '2020-09-30', '12:00:00', 1, 4.5, 6, 1, 1, 2);

insert into ride_share.State (abbreviation, name) values ('OH', 'Ohio');
insert into ride_share.State (abbreviation, name) values ('IN', 'Indiana');

insert into ride_share.User (id, firstName, lastName, email, password, phone, is_admin) values (1, 'Logan', 'Roth', 'logan_roth@taylor.edu', 'password', 5132807223, 'false');
insert into ride_share.User (id, firstName, lastName, email, password, phone, is_admin) values (2, 'Kendall', 'Miyakawa', 'kendall_miyakawa@taylor.edu', 'pass', 1234567890, 'false');

insert into ride_share.Vehicle Type (id, type) values (1, 'Hatchback');

insert into ride_share.Vehicle (id, make, model, color, vehicleTypeId, capacity, mpg, licenseState, licensePlate) values (1, 'Ford', 'Focus', 'White', 1, 4, 33, 1, 'HSV 9938');

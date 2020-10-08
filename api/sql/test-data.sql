set schema 'ride_share';

insert into "User" ("firstName", "lastName", email, password, phone, "isAdmin")
values ('Logan', 'Roth', 'logan_roth@taylor.edu', 'password', 5132807223, 'false'),
       ('Kendall', 'Miyakawa', 'kendall_miyakawa@taylor.edu', 'pass', 1234567890, 'false');

insert into "State" (abbreviation, name)
values ('OH', 'Ohio'),
       ('IN', 'Indiana');

insert into "Driver" ("userId", "licenseNumber", "licenseState")
values (1, 28, 'OH');

insert into "Location" (name, address, city, state, "zipCode")
values ('Upland Post Office', '222 N Main St', 'Upland', 'IN', 46989),
       ('Taylor University', '236 W Reade Ave', 'Upland', 'IN', 46989);

insert into "VehicleType" (type)
values ('Hatchback');

insert into "Vehicle" (make, model, color, "vehicleTypeId", capacity, mpg, "licenseState", "licensePlate")
values ('Ford', 'Focus', 'White', 1, 4, 33, 'OH', 'HSV 9938');

insert into "Authorization" ("driverId", "vehicleId")
values (1, 1);

insert into "Ride" (date, time, distance, "fuelPrice", fee, "vehicleId", "fromLocationId", "toLocationId")
values ('2020-09-30', '12:00:00', 1, 4.5, 6, 1, 1, 2);

insert into "Drivers" ("driverId", "rideId")
values (1, 1);

insert into "Passenger" ("passengerId", "rideId")
values (1, 1);
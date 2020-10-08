drop schema ride_share cascade;
create schema ride_share;
set schema 'ride_share';

create table "User"
(
    id serial,
    "firstName" varchar(50) not null,
    "lastName" varchar(50) not null,
    email varchar(50) not null,
    password varchar(50) not null,
    phone varchar(10),
    "isAdmin" boolean not null,
    primary key (id)
);

create table "State"
(
    abbreviation varchar(2) not null,
    name varchar(50) not null,
    primary key (abbreviation)
);

create table "Location"
(
    id serial,
    name varchar(50) not null,
    address varchar(100) not null,
    city varchar(50) not null,
    state varchar(2) not null,
    "zipCode" varchar(5) not null,
    primary key (id),
    foreign key (state) references "State" (abbreviation)
);

create table "Driver"
(
    id serial,
    "userId" integer not null,
    "licenseNumber" varchar(25) not null,
    "licenseState" varchar(2) not null,
    primary key (id),
    foreign key ("userId") references "User" (id),
    foreign key ("licenseState") references "State" (abbreviation)
);

create table "VehicleType"
(
    id serial,
    type varchar(50) not null,
    primary key (id)
);

create table "Vehicle"
(
    id serial,
    make            varchar(50)      not null,
    model           varchar(50)      not null,
    color           varchar(50)      not null,
    "vehicleTypeId"   integer          not null,
    capacity        integer          not null,
    mpg             double precision not null,
    "licenseState"    varchar(2)       not null,
    "licensePlate"    varchar(10)      not null,
    primary key (id),
    foreign key ("vehicleTypeId") references "VehicleType" (id),
    foreign key ("licenseState") references "State" (abbreviation)
);


create table "Authorization" (
    "driverId" integer not null,
    "vehicleId" integer not null,
    primary key ("driverId", "vehicleId"),
    foreign key ("driverId") references "Driver" (id),
    foreign key ("vehicleId") references "Vehicle" (id)
);

create table "Ride"
(
    id serial,
    date             date             not null,
    time             time             not null,
    distance         double precision not null,
    "fuelPrice"        double precision not null,
    fee              double precision not null,
    "vehicleId"        integer          not null,
    "fromLocationId"   integer          not null,
    "toLocationId"     integer          not null,
    primary key (id),
    foreign key ("vehicleId") references "Vehicle" (id),
    foreign key ("fromLocationId") references "Location" (id),
    foreign key ("toLocationId") references "Location" (id)
);

create table "Drivers"
(
    "driverId" integer not null,
    "rideId" integer not null,
    primary key ("driverId", "rideId"),
    foreign key ("driverId") references "Driver" (id),
    foreign key ("rideId") references "Ride" (id)
);

create table "Passenger"
(
    "passengerId" integer not null,
    "rideId" integer not null,
    primary key ("passengerId", "rideId"),
    foreign key ("passengerId") references "User" (id),
    foreign key ("rideId") references "Ride" (id)
);
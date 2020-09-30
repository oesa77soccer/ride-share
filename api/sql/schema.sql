create table "User"
(
    id          serial      not null
        constraint user_pk
            primary key,
    "firstName" varchar(50) not null,
    "lastName"  varchar(50) not null,
    email       varchar(50) not null,
    password    varchar(50) not null,
    phone       varchar(10),
    is_admin    boolean     not null
);

alter table "User"
    owner to logan_roth;

create unique index user_email_uindex
    on "User" (email);

create table "Driver"
(
    id              serial      not null
        constraint driver_pk
            primary key
        constraint driver_user_id_fk
            references "User",
    "userId"        integer,
    "licenseNumber" varchar(25) not null,
    "licenseState"  integer     not null
);

alter table "Driver"
    owner to logan_roth;

create unique index driver_licensenumber_uindex
    on "Driver" ("licenseNumber");

create table "Vehicle"
(
    id              serial           not null
        constraint vehicle_pk
            primary key,
    make            varchar(50)      not null,
    model           varchar(50)      not null,
    color           varchar(50)      not null,
    "vehicleTypeId" integer          not null,
    capacity        integer          not null,
    mpg             double precision not null,
    "licenseState"  integer          not null,
    "licensePlate"  varchar(10)      not null
);

alter table "Vehicle"
    owner to logan_roth;

create table "Authorization"
(
    "driverId"  integer not null
        constraint authorization_pk
            unique
        constraint authorization_driver_id_fk
            references "Driver"
        constraint authorization_vehicle_id_fk
            references "Vehicle",
    "vehicleId" integer not null
        constraint authorization_pk_2
            unique,
    constraint "Authorization_pkey"
        primary key ("driverId", "vehicleId")
);

alter table "Authorization"
    owner to logan_roth;

create table "Ride"
(
    id               integer          not null
        constraint ride_pk
            primary key
        constraint ride_vehicle_id_fk
            references "Vehicle",
    date             date             not null,
    time             time             not null,
    distance         double precision not null,
    "fuelPrice"      double precision not null,
    fee              double precision not null,
    "vehicleId"      integer          not null,
    "fromLocationId" integer          not null,
    "toLocationId"   integer          not null
);

alter table "Ride"
    owner to logan_roth;

create table "Passenger"
(
    "passengerId" integer not null
        constraint passenger_pk
            unique
        constraint passenger_ride_id_fk
            references "Ride"
        constraint passenger_user_id_fk
            references "User",
    "rideId"      integer not null
        constraint passenger_pk_2
            unique,
    constraint "Passenger_pkey"
        primary key ("passengerId", "rideId")
);

alter table "Passenger"
    owner to logan_roth;

create table "Drivers"
(
    "driverId" integer not null
        constraint drivers_pk
            unique
        constraint drivers_driver_id_fk
            references "Driver"
        constraint drivers_ride_id_fk
            references "Ride",
    "rideId"   integer not null
        constraint drivers_pk_2
            unique,
    constraint "Drivers_pkey"
        primary key ("rideId", "driverId")
);

alter table "Drivers"
    owner to logan_roth;

create table "State"
(
    abbreviation varchar(2)  not null
        constraint state_pk
            primary key,
    name         varchar(50) not null
);

alter table "State"
    owner to logan_roth;

create unique index state_abbreviation_uindex
    on "State" (abbreviation);

create unique index state_name_uindex
    on "State" (name);

create table "Location"
(
    id        serial       not null
        constraint location_pk
            primary key,
    name      varchar(50)  not null,
    address   varchar(100) not null,
    city      varchar(50)  not null,
    state     varchar(2)   not null
        constraint location_state_abbreviation_fk
            references "State",
    "zipCode" varchar(5)   not null
);

alter table "Location"
    owner to logan_roth;

create table "Vehicle Type"
(
    id   serial      not null
        constraint "vehicle type_pk"
            primary key,
    type varchar(50) not null
);

alter table "Vehicle Type"
    owner to logan_roth;

create unique index "vehicle type_type_uindex"
    on "Vehicle Type" (type);


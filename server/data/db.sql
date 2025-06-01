CREATE TABLE IF NOT EXISTS "USER"(
	userID serial primary key,
    firstName varchar(20) not null,
    lastName  varchar(20) not null,
    passwordHash text not null,
    email varchar(40) not null unique,
    profilePicture bytea default null,
    phoneNumber varchar(12) not null
);


CREATE TABLE IF NOT EXISTS INSTRUCTOR(
    instructorID integer primary key,
    yearsOfExperience varchar(30) default '',
    resorts varchar(30)[] default '{}',
    sports varchar(30)[] default '{}',
    languages varchar(30)[] default '{}',
    summaryInfo varchar(180) default '',
    biographyNote varchar(2000) default '',
    cancelationPolicy varchar(30) default '',
    FOREIGN KEY (instructorID) REFERENCES "USER" (userID)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS STUDENT(
    studentID integer primary key,
    FOREIGN KEY (studentID) REFERENCES "USER" (userID)
            ON UPDATE CASCADE
            ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS MEETINGPOINT(
    meetingPointID serial primary key,
    resortText varchar(30) default null,
    locationText varchar(30) default null,
    picture bytea default null,
    instructorID integer not null,
    FOREIGN KEY (instructorID) references INSTRUCTOR (instructorID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TEACHING(
    teachingID serial primary key,
    sport varchar(30) not null,
    resort varchar(30) not null,
    lessonType varchar(30) not null,
    dateStart varchar(30) not null,
    dateEnd varchar(30) not null,
    weekDays varchar(30)[] default '{}',
    timeStart varchar(30) not null,
    timeEnd varchar(30) not null,
    isAllDay boolean not null,
    maxParticipants integer not null,
    costPerHour integer not null,
    groupName varchar(30) default null,
    instructorID integer not null,
    meetingPointID integer default null,
    FOREIGN KEY (instructorID) references INSTRUCTOR (instructorID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (meetingPointID) references MEETINGPOINT (meetingPointID)
        ON UPDATE CASCADE
        ON DELETE set null
);


--  on delete restrict
CREATE TABLE IF NOT EXISTS LESSON(
    lessonID serial primary key,
    "date" varchar(30) not null,
    canceled boolean not null default false,
    instructorNote varchar(300) default null,
    teachingID integer not null,
    FOREIGN KEY(teachingID) references TEACHING (teachingID)
        ON UPDATE CASCADE
        ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS RESERVATION(
    reservationID serial primary key,
    reservationDate varchar(30) not null,
    studentID integer not null,
    FOREIGN KEY(studentID) references STUDENT (studentID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS RESERVATION_LESSON(
    reservationID integer not null,
    lessonID integer not null,
    canceled boolean not null default false,
    participantNumber integer not null,
    lowestLevel varchar(30) not null,
    reservLesID serial primary key,
    FOREIGN KEY (reservationID) references RESERVATION(reservationID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (lessonID) references LESSON (lessonID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    
);

CREATE TABLE IF NOT EXISTS PAYMENT(
    paymentID serial primary key,
    amount numeric(10,2) not null,
    paymentDate varchar(30) not null,
    reservationID integer not null,
    FOREIGN KEY(reservationID) references RESERVATION (reservationID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS REVIEW(
    reviewID serial primary key,
    reviewText varchar(400) default null,
    reviewStars integer default null,
    studentID integer not null,
    FOREIGN KEY (studentID) references STUDENT(studentID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS REVIEW_LESSON(
    reviewID integer not null,
    lessonID integer not null,
    primary key(reviewID,lessonID),
    FOREIGN KEY(reviewID) references REVIEW(reviewID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(lessonID) references LESSON(lessonID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CART(
    studentID integer not null,
    lessonID integer not null,
    primary key(studentID,lessonID),
    FOREIGN KEY(studentID) references STUDENT(studentID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(lessonID) references LESSON(lessonID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create index if not exists user_email
on "USER"(email);


create index if not exists teaching_instructorID
on TEACHING(instructorID);






-- --to drop all tables

-- DO $$
-- DECLARE
--     r RECORD;
-- BEGIN
--     FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP

--         EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';

--     END LOOP;
-- END $$;




-- to view all indexes

-- SELECT * FROM pg_catalog.pg_indexes
-- WHERE schemaname = 'public'
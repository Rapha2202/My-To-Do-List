create table list
(
    id          int auto_increment
        primary key,
    name        varchar(255) default 'Nouvelle Liste'             not null,
    description varchar(255) default 'Description de votre liste' not null
);

create table priority
(
    id       int auto_increment
        primary key,
    priority varchar(255) not null
);

create table state
(
    id    int auto_increment
        primary key,
    state varchar(255) not null
);

create table todo
(
    id          int auto_increment
        primary key,
    name        varchar(255) default 'Nouvelle Tâche'             not null,
    description varchar(255) default 'Description de votre tâche' not null,
    list_id     int                                               not null,
    priority_id int                                               not null,
    state_id    int                                               not null,
    constraint todo_list
        foreign key (list_id) references list (id),
    constraint todo_priority
        foreign key (priority_id) references priority (id),
    constraint todo_state
        foreign key (state_id) references state (id)
);

create table user
(
    id            int auto_increment
        primary key,
    username      varchar(255)         not null,
    email         varchar(255)         not null,
    password      varchar(255)         not null,
    creationDate  date                 not null,
    lastLogin     date                 null,
    lastUpdate    date                 not null,
    emailVerified tinyint(1) default 0 not null,
    passwordTry   int        default 0 not null,
    lockUntil     varchar(255)         null,
    constraint user_pk
        unique (username),
    constraint user_pk_2
        unique (email)
);

create table user_list
(
    user_id int                          not null,
    list_id int                          not null,
    role    varchar(255) default 'guest' not null,
    constraint `list-list_id`
        foreign key (list_id) references list (id),
    constraint `user-user_id`
        foreign key (user_id) references user (id)
);

create table verification
(
    id          int auto_increment
        primary key,
    email       varchar(255) not null,
    verifyToken varchar(255) not null
);

insert into priority (priority) values
('Basse'),
('Moyenne'),
('Haute'),
('Urgente');

insert into state (state) values
('A faire'),
('En cours'),
('Terminée');
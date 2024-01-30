create table if not exists list
(
    id              int auto_increment
        primary key,
    listName        varchar(255) default 'Nouvelle Liste'             not null,
    listDescription varchar(255) default 'Description de votre liste' not null
);

create table if not exists priority
(
    id       int auto_increment
        primary key,
    priority varchar(255) not null
);

create table if not exists state
(
    id    int auto_increment
        primary key,
    state varchar(255) not null
);

create table if not exists todo
(
    id              int auto_increment
        primary key,
    todoName        varchar(255) default 'Nouvelle Tache'             not null,
    todoDescription varchar(255) default 'Description de votre tache' not null,
    list_id         int                                               not null,
    priority_id     int                                               not null,
    state_id        int                                               not null,
    constraint todo_list_id_fk
        foreign key (list_id) references list (id),
    constraint todo_priority_id_fk
        foreign key (priority_id) references priority (id),
    constraint todo_state_id_fk
        foreign key (state_id) references state (id)
);

create table if not exists user
(
    id           int auto_increment
        primary key,
    username     varchar(255)         not null,
    email        varchar(255)         not null,
    token        varchar(255)         null,
    password     varchar(255)         not null,
    isAdmin      tinyint(1) default 0 not null,
    lastUpdate   date                 not null,
    creationDate date                 not null
);

create table if not exists user_list
(
    user_id int not null,
    list_id int not null,
    constraint `list_id-user_id`
        foreign key (list_id) references list (id),
    constraint `user_id-list_id`
        foreign key (user_id) references user (id)
);

INSERT INTO todolist.state (id, state)
VALUES (1, 'Pas commencé');
INSERT INTO todolist.state (id, state)
VALUES (2, 'En cours');
INSERT INTO todolist.state (id, state)
VALUES (3, 'Finit');

INSERT INTO todolist.priority (id, priority)
VALUES (1, 'Très important');
INSERT INTO todolist.priority (id, priority)
VALUES (2, 'Important');
INSERT INTO todolist.priority (id, priority)
VALUES (3, 'Normal');
INSERT INTO todolist.priority (id, priority)
VALUES (4, 'Pas important');

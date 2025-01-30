import { DataSource } from "typeorm";
import { Course } from "../entities/Course";
import { Collection } from "../entities/Collection";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "pass",
    database: "osc_assessment",
    synchronize: true,
    logging: true,
    entities: [Course, Collection, User],
    subscribers: [],
    migrations: [],
});

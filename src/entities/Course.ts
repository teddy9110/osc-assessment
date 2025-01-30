import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Collection } from "./Collection";

@Entity()
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  duration: string;

  @Column()
  outcome: string;

  @ManyToOne(() => Collection, (collection: { courses: any; }) => collection.courses)
  collection: Collection;
}

import {Entity} from "@/core/entities/entity";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";


interface StudentProps {
    name: string

}

export class Student  extends Entity<StudentProps>{
    static create(props: StudentProps, id?: UniqueEntityID){
        const student = new Student(props, id)


        return student
    }
}
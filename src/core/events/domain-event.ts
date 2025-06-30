import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";


export interface DomainEvent {
    ocurredAt: Date
    getAggregateId(): UniqueEntityID
}
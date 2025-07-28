import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";


export abstract class Entity<Props>{
    private _id: UniqueEntityID
    protected props: Props

    get id() {
        return this._id
    }

    protected constructor(props: Props, id?: UniqueEntityID) {
        this._id = id ?? new UniqueEntityID(id)
        this.props = props
    }

    public equals(entity: Entity<unknown>) {
        if (entity === this) {
            return true
        }

        if (entity.id === this._id) {
            return true
        }

        return false
    }
}
import {UseCaseError} from "@/core/use-case-error";

export class NotAllowedError  extends Error implements UseCaseError{

    constructor() {
        super('Not allowed');
    }

}
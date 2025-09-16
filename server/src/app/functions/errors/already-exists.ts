export class AlreadyExistsError extends Error {
    constructor() {
        super('Already exists');
    }
}
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

export function ValidateStateArrObjs(
    property?: string,
    validationOptions?: ValidationOptions,
) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: ValidateStateArrObjsConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'ValidateStateArrObjs' })
class ValidateStateArrObjsConstraint
    implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        try {
            // Parse the JSON string to an array
            const states = JSON.parse(value);

            // Check if it's an array
            if (!Array.isArray(states)) {
                return false;
            }

            // Is required
            if (states.length === 0) {
                return false;
            }

            // Check if each item in the array has the required keys with valid data types
            const isValidStates = states.every(
                (state: any) =>
                    typeof state.state_id === 'number' &&
                    typeof state.state_name === 'string' &&
                    state.state_id !== undefined &&
                    state.state_name !== undefined
            );

            return isValidStates;
        } catch (error) {
            return false; // Invalid JSON
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid array of objects with properties state_id (number), state_name (string).`;
    }
}

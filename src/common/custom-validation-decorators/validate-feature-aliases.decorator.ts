import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

export function ValidateFeatureAliases(
    property?: string,
    validationOptions?: ValidationOptions,
) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: ValidateFeatureAliasesConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'ValidateFeatureAliases' })
class ValidateFeatureAliasesConstraint
    implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        try {
            // Parse the JSON string to an array
            const featureAliases = JSON.parse(value);

            // Check if it's an array
            if (!Array.isArray(featureAliases)) {
                return false;
            }

            // Check if each item in the array has the required keys with valid data types
            const isValidAliases = featureAliases.every(
                (alias: any) => typeof alias.name === 'string' && alias.name !== undefined
            );

            return isValidAliases;
        } catch (error) {
            return false; // Invalid JSON
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid array of objects with a property name (string).`;
    }
}

import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

export function ValidateFeatureTrackingHook(
    property?: string,
    validationOptions?: ValidationOptions,
) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: ValidateFeatureTrackingHookConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'ValidateFeatureTrackingHook' })
class ValidateFeatureTrackingHookConstraint
    implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        try {
            // Parse the JSON string to an array
            const trackingHooks = JSON.parse(value);

            // Check if it's an array
            if (!Array.isArray(trackingHooks)) {
                return false;
            }

            // Check if each item in the array has the required keys with valid data types
            const isValidHooks = trackingHooks.every(
                (hook: any) =>
                    typeof hook.hook_id === 'number' &&
                    typeof hook.hook_name === 'string' &&
                    typeof hook.hook_message === 'string' &&
                    hook.hook_id !== undefined &&
                    hook.hook_name !== undefined &&
                    hook.hook_message !== undefined
            );

            return isValidHooks;
        } catch (error) {
            return false; // Invalid JSON
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid array of objects with properties hook_id (number), hook_name (string), and hook_message (string).`;
    }
}

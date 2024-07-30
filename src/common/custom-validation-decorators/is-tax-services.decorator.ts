import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

export function IsTaxServiceArray(validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsTaxServiceArrayConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'IsTaxServiceArray' })
class IsTaxServiceArrayConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        if (!Array.isArray(value)) {
            return false;
        }

        // Check if all values in the array are valid tax services
        return value.every((service) => ["Package", "Buyer_Fee", "RSD"].includes(service));
    }

    defaultMessage(args: ValidationArguments) {
        return `Invalid tax services array, tax services must contain values from "Package", "Buyer_Fee", "RSD".`;
    }
}

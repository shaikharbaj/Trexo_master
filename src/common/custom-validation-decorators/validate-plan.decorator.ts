import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ValidatePlan(property?: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: PlanConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ValidatePlan' })
export class PlanConstraint implements ValidatorConstraintInterface {
  public validationErrorObj: any = {
    is_valid: true,
    type: '',
    message: '',
  };
  validate(value: any, args: ValidationArguments) {
    //Resetting validation error object
    this.validationErrorObj = {
      is_valid: true,
      type: '',
      message: '',
    };
    const [relatedPropertyName] = args.constraints;
    const packageType = (args.object as any)[relatedPropertyName];
    const parsedValue = JSON.parse(value);
    if (!Array.isArray(parsedValue)) {
      return false;
    }
    planLoop: for (const item of parsedValue) {
      // Your condition
      if(!item?.plan_name) {
        this.validationErrorObj = {
          is_valid: false,
          type: "plan_name",
          message: "Please enter plan name."
        };
        break planLoop; // This will exit the entire loop
      } else if(!item?.plan_description) {
        this.validationErrorObj = {
          is_valid: false,
          type: "plan_description",
          message: "Please enter plan description."
        };
        break planLoop; // This will exit the entire loop
      } else if(!item?.plan_type) {
        this.validationErrorObj = {
          is_valid: false,
          type: "plan_type",
          message: "Please enter plan type."
        };
        break planLoop; // This will exit the entire loop
      } else if(!item?.timeline_type && packageType === "Timeline Based") {
        this.validationErrorObj = {
          is_valid: false,
          type: "timeline_type",
          message: "Please enter plan timeline type."
        };
        break planLoop; // This will exit the entire loop
      } else if(!item?.timeline && packageType === "Timeline Based") {
        this.validationErrorObj = {
          is_valid: false,
          type: "timeline",
          message: "Please enter plan timeline."
        };
        break planLoop; // This will exit the entire loop
      } else if((!item?.selling_price || +item?.selling_price === 0) && packageType === "Timeline Based") {
        this.validationErrorObj = {
          is_valid: false,
          type: "selling_price",
          message: "Please enter plan selling price."
        };
        break planLoop; // This will exit the entire loop
      } else if((+item?.discounted_price >= +item?.selling_price) && packageType === "Timeline Based") {
        this.validationErrorObj = {
          is_valid: false,
          type: "discounted_price",
          message: "Discounted price is greater then selling price."
        };
        break planLoop; // This will exit the entire loop
      }
    }
    return this.validationErrorObj.is_valid;
  }
  defaultMessage(args: ValidationArguments) {
    return this.validationErrorObj.message;
  }
}

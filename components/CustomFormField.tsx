/* eslint-disable @typescript-eslint/no-explicit-any */
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import PhoneInput from "react-phone-number-input";

import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  // `control` and `name` are intentionally typed as `any` so this component
  // can be reused across forms whose typed `Control<TFieldValues>` differs.
  // React Hook Form's `Control<T>` is invariant in `T`, so a `Control<A>` is
  // not safely assignable to `Control<B>` even when `B = any`, which causes
  // errors under TypeScript 6 strict mode. The runtime behaviour is unchanged.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: any;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

/**
 * Renders different types of form fields based on the provided `fieldType` prop.
 *
 * @param {Object} param0 - The props object.
 * @param {any} param0.field - The field object containing form field properties.
 * @param {CustomProps} param0.props - The custom properties for the form field.
 * @returns {JSX.Element | null} The rendered form field component.
 *
 * @typedef {Object} CustomProps
 * @property {FormFieldType} fieldType - The type of the form field to render.
 * @property {string} [iconSrc] - The source URL for the icon image.
 * @property {string} [iconAlt] - The alt text for the icon image.
 * @property {string} [placeholder] - The placeholder text for the input field.
 * @property {boolean} [disabled] - Whether the field is disabled.
 * @property {string} [name] - The name of the field.
 * @property {string} [label] - The label text for the checkbox.
 * @property {boolean} [showTimeSelect] - Whether to show time selection in the date picker.
 * @property {React.ReactNode} [children] - The children elements for the select field.
 * @property {Function} [renderSkeleton] - The function to render a skeleton component.
 *
 * @enum {string} FormFieldType
 * @property {string} INPUT - Represents an input field.
 * @property {string} TEXTAREA - Represents a textarea field.
 * @property {string} PHONE_INPUT - Represents a phone input field.
 * @property {string} CHECKBOX - Represents a checkbox field.
 * @property {string} DATE_PICKER - Represents a date picker field.
 * @property {string} SELECT - Represents a select field.
 * @property {string} SKELETON - Represents a skeleton component.
 */
const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="BE"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="user"
            className="ml-2"
          />
          <FormControl>
            <ReactDatePicker
              timeFormat="HH:mm" // 24-hour format
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat="dd/MM/yyyy HH:mm" // European date and time format
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

/**
 * CustomFormField component renders a form field with a label and input based on the provided props.
 *
 * @param {CustomProps} props - The properties passed to the component.
 * @param {any} props.control - The control object used for form handling.
 * @param {string} props.name - The name of the form field.
 * @param {string} [props.label] - The label for the form field.
 * @param {FormFieldType} props.fieldType - The type of the form field.
 *
 * @returns {JSX.Element} The rendered form field component.
 */
const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {/* als formfieldtype niet gelijk aan checkbox en label bestaat en dan toon formlabel   */}
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;

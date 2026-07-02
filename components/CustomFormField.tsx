import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import { Control, ControllerRenderProps, FieldValues, Path } from "react-hook-form";
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

// Generic over a Zod-inferred `FieldValues` (e.g. `z.infer<typeof X>`).
// TypeScript infers T from the `control` prop at every call site, so the
// existing `<CustomFormField control={form.control} name="email" />` JSX
// stays untouched while `name` is still constrained to a real key of T.
interface CustomProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
  fieldType: FormFieldType;
}

/**
 * Renders different types of form fields based on the provided `fieldType` prop.
 */
const RenderInput = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  props: CustomProps<T>;
}) => {
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
              /* `size-6` (Tailwind v4 utility: width 1.5rem + height 1.5rem)
                 overrides Tailwind's preflight rule `img { height: auto }` via
                 CSS specificity — class selectors (0,1,0) beat tag selectors
                 (0,0,1) — and matches the HTML width/height attrs. Together
                 with `unoptimized`, this silences Next.js's
                 '...either width or height modified, but not the other'
                 console warning for the form icons. See CustomFormField
                 header comment for the full discussion. */
              className="ml-2 size-6"
              unoptimized
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
            alt="calendar"
            className="ml-2 size-6"
            unoptimized
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
 */
const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
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
          <RenderInput<T> field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;

import { WizardData } from "@/contexts/WizardContext";
import { FormikProps } from "formik";
import * as yup from "yup";

const numberString = () =>
  yup
    .string()
    .test("is-number", "Must be a number", (v) =>
      v ? !isNaN(Number(v)) : true,
    );

export const WizardSchema = yup.object({
  biological_sex: yup.string().nullable().required(),

  height_cm: numberString()
    .test(
      "height-range",
      "Invalid height",
      (v) => !v || (Number(v) >= 100 && Number(v) <= 250),
    )
    .required(),

  weight_kg: numberString()
    .test(
      "weight-range",
      "Invalid weight",
      (v) => !v || (Number(v) >= 20 && Number(v) <= 300),
    )
    .required(),

  birth_date: yup.string().nullable().required(),

  goal_type: yup.string().nullable().required(),

  target_weight_kg: numberString().required(),

  activity_level: yup.string().nullable().required(),

  diet: yup.mixed(),

  allergies: yup.array().of(yup.string()),

  restrictions: yup.array().of(yup.string()),

  daily_calorie_target: numberString(),

  protein_g: numberString(),
  carbs_g: numberString(),
  fat_g: numberString(),

  weekly_pace_kg: numberString(),
});

export const getStepSchema = (step: string) => {
  switch (step) {
    case "sex":
      return yup.object({
        biological_sex: yup.string().required("Select sex"),
      });

    case "physical":
      return yup.object({
        biological_sex: yup.string().required(),
        height_cm: WizardSchema.fields.height_cm,
        weight_kg: WizardSchema.fields.weight_kg,
        birth_date: yup
          .string()
          .test("age", "Invalid age", (v) => {
            if (!v) return false;
            const d = new Date(v);
            const age = new Date().getFullYear() - d.getFullYear();
            return age >= 10 && age <= 120;
          })
          .required("Birth date required"),
      });

    case "goal":
      return yup.object({
        goal_type: yup.string().required("Select goal"),
      });

    case "goal_details":
      return yup.object({
        target_weight_kg: yup
          .string()
          .test(
            "goal-weight-validation",
            "Invalid target weight",
            function (value: string | undefined) {
              const parent = this.parent as {
                weight_kg?: string;
                goal_type?: string;
              };

              const currentWeight = Number(parent.weight_kg);
              const target = Number(value);
              const goalType = parent.goal_type;

              if (!value) return false;
              if (!currentWeight || !goalType) return true;

              if (goalType === "lose") {
                return target < currentWeight;
              }

              if (goalType === "gain") {
                return target > currentWeight;
              }

              return true;
            },
          )
          .required("Enter target weight"),

        weekly_pace_kg: yup.string().required("Select pace"),
      });
    case "activity":
      return yup.object({
        activity_level: yup.string().required("Select activity"),
      });

    case "diet":
      return yup.object({
        diet: yup.mixed(),
        allergies: yup.array(),
        restrictions: yup.array(),
      });

    case "suggestion":
      return yup.object({
        daily_calorie_target: yup.string().required(),
        protein_g: yup.string().required(),
        carbs_g: yup.string().required(),
        fat_g: yup.string().required(),
      });

    default:
      return yup.object();
  }
};
const STEPS: string[] = [
  "sex",
  "physical",
  "goal",
  "goal_details",
  "activity",
  "diet",
  "suggestions",
];
export const validateStep = async (
  formik: FormikProps<WizardData>,
  stepIndex: number,
) => {
  const schema = getStepSchema(STEPS[stepIndex]);

  try {
    await schema.validate(formik.values, { abortEarly: false });
    return true;
  } catch (err: any) {
    if (err.inner) {
      const errors: any = {};
      err.inner.forEach((e: any) => {
        if (e.path) errors[e.path] = e.message;
      });

      formik.setErrors(errors);
      Object.keys(errors).forEach((key) => {
        formik.setFieldTouched(key as any, true, false);
      });
    }
    return false;
  }
};

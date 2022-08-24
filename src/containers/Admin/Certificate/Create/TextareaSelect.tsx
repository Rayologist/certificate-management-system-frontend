import {
  ActionIcon,
  Box,
  Group,
  Textarea as MantineTextarea,
  TextareaProps,
  Select as MantineSelect,
  SelectProps,
  SelectItem,
  useMantineTheme,
} from "@mantine/core";
import { useCustomFormik } from "../../../../components/Formik/FormikComponents/Helper";
import { FieldArray } from "formik";

import {
  IconChevronDown,
  IconMinus,
  IconPlus,
  IconAlertCircle,
} from "@tabler/icons";

import { Title } from "types";


function TextareaSelectArray({
  name,
  selectProps,
  textareaProps,
}: {
  name: string;
  selectProps: { options: SelectItem[] } & Omit<SelectProps, "data">;
  textareaProps?: TextareaProps;
}) {
  const { options, ...rest } = selectProps;
  const theme = useMantineTheme();

  const [formik, _] = useCustomFormik(name);
  const values = (formik.values as { [key: string]: any })[name] as Title[];
  const errors = (formik.errors as { [key: string]: any })[name];
  const touched = (formik.touched as { [key: string]: any })[name];

  return (
    <FieldArray
      name={name}
      render={(arrayHelper) => {
        return (
          <>
            {values.map((title, index, array) => {
              return (
                <Group
                  key={`${title}-${index}`}
                  spacing="xs"
                  sx={{ display: "flex", alignItems: "center" }}
                  mb={index === array.length - 1 ? 0 : theme.spacing.xl}
                >
                  <MantineTextarea
                    name={`${name}.${index}.text`}
                    error={
                      touched?.[index]?.text &&
                      errors?.[index]?.text && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 5,
                            position: "absolute",
                            fontSize: "15px",
                          }}
                        >
                          <>
                            <IconAlertCircle width={18} />{" "}
                            {errors?.[index]?.text}
                          </>
                        </Box>
                      )
                    }
                    {...textareaProps}
                    value={title.text}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `${name}.${index}.text`,
                        e.target.value
                      )
                    }
                    onBlur={formik.handleBlur}
                    sx={{
                      width: "70%",
                    }}
                    required
                    minRows={1}
                  />

                  <MantineSelect
                    rightSection={
                      <IconChevronDown width={15} color="#9e9e9e" />
                    }
                    styles={{ rightSection: { pointerEvents: "none" } }}
                    name={`${name}.${index}.weight`}
                    value={title.weight}
                    onChange={(value) =>
                      formik.setFieldValue(`${name}.${index}.weight`, value)
                    }
                    onBlur={() => formik.setFieldTouched(name, true)}
                    allowDeselect
                    error={
                      errors?.[index]?.weight && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 5,
                            position: "absolute",
                            fontSize: "15px",
                          }}
                        >
                          <>
                            <IconAlertCircle width={18} />{" "}
                            {errors?.[index]?.weight}
                          </>
                        </Box>
                      )
                    }
                    {...rest}
                    data={options}
                    sx={{ width: "22%" }}
                  />
                  <Group spacing={0} mt={20} sx={{ width: "1%" }}>
                    {values.length < 3 ? (
                      <ActionIcon
                        onClick={() =>
                          arrayHelper.push({ text: "", weight: "" })
                        }
                      >
                        <IconPlus size={16} stroke={1.5} />
                      </ActionIcon>
                    ) : null}

                    {values.length >= 2 ? (
                      <ActionIcon onClick={() => arrayHelper.remove(index)}>
                        <IconMinus size={16} stroke={1.5} />
                      </ActionIcon>
                    ) : null}
                  </Group>
                </Group>
              );
            })}
          </>
        );
      }}
    />
  );
}

export default TextareaSelectArray;

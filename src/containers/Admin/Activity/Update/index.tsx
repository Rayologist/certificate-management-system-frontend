import React, { SetStateAction, Dispatch, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { FormikController, ErrorMessage } from '@components/Form';
import { ControllerProps, PickAsOrNull, UpdateActivityRequest } from 'types';
import { Button, Grid, Text, useMantineTheme } from '@mantine/core';
import { object, string, date } from 'yup';
import { KeyedMutator } from 'swr';
import { updateActivity } from '@services/activity';
import { useRouter } from 'next/router';
import RichTextEditor from '@components/RichTextEditor';

type UpdateValue = {
  auid: string;
  title: string;
  startDate: Date;
  endDate: Date;
  email: string;
  subject: string;
};

type Values = Omit<PickAsOrNull<UpdateActivityRequest, 'startDate' | 'endDate'>, 'auid' | 'email'>;

const UpdateActivity = ({
  auid,
  title,
  startDate,
  endDate,
  email,
  subject,
  mutate,
  setOpened,
}: UpdateValue & {
  mutate: KeyedMutator<any>;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [mailContent, onChange] = useState(email);
  const [rteError, setRteError] = useState(false);

  const initialValue: Values = {
    title,
    startDate,
    endDate,
    subject,
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    if (mailContent === '<p><br></p>') {
      setRteError(true);
      return null;
    }

    const payload = { email: mailContent, auid, ...values } as UpdateActivityRequest;
    const [, error] = await updateActivity(payload);
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return null;
    }

    actions.setSubmitting(false);
    mutate();
    setOpened(false);
    return null;
  };

  const validationSchema = object({
    title: string().required('必填'),
    startDate: date().required('必填').nullable(),
    endDate: date().required('必填').nullable(),
    subject: string().required('必填'),
  });

  const fields: ControllerProps[] = [
    {
      control: 'text-input',
      name: 'title',
      label: '活動名稱',
      withAsterisk: true,
    },
    {
      control: 'date-picker',
      name: 'startDate',
      label: '開始日期',
      placeholder: '請點選或輸入時間',
      allowFreeInput: true,
      withAsterisk: true,
    },
    {
      control: 'date-picker',
      name: 'endDate',
      label: '結束日期',
      placeholder: '請點選或輸入時間',
      allowFreeInput: true,
      withAsterisk: true,
    },
    {
      control: 'text-input',
      name: 'subject',
      label: '信件主旨',
      withAsterisk: true,
    },
  ];

  return (
    <Formik initialValues={initialValue} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <Form>
          <Grid justify="center" gutter="xl">
            {fields.map((field, index) => (
              <Grid.Col key={`${field.name}-${index}`}>
                <FormikController {...field} />
              </Grid.Col>
            ))}
            <Grid.Col>
              <Text weight={500} color="#212529" size={14}>
                信件內容
                <span
                  aria-hidden
                  style={{
                    color: theme.fn.variant({ variant: 'filled', color: 'red' }).background,
                  }}
                >
                  {' *'}
                </span>
              </Text>

              <RichTextEditor
                id="rte"
                value={mailContent}
                onChange={onChange}
                onBlur={() => {
                  if (mailContent === '<p><br></p>') {
                    setRteError(true);
                    return null;
                  }
                  setRteError(false);
                  return null;
                }}
                controls={[
                  ['bold', 'italic', 'underline', 'strike', 'clean'],
                  ['h1', 'h2', 'h3', 'h4'],
                  ['unorderedList', 'orderedList'],
                  ['alignLeft', 'alignCenter', 'alignRight'],
                  ['link', 'blockquote'],
                  ['sup', 'sub'],
                ]}
              />
              {rteError && mailContent === '<p><br></p>' && (
                <ErrorMessage text="必填" textProps={{ color: 'red' }} />
              )}
            </Grid.Col>

            <Grid.Col
              xs={10}
              sm={10}
              md={10}
              lg={10}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button type="submit" mt={25} mb={5} loading={formik.isSubmitting} variant="outline">
                {formik.isSubmitting ? '修改中...' : '確認'}
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateActivity;

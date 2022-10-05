import React, { Dispatch, SetStateAction, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { FormikController, ErrorMessage } from '@components/Form';
import { ControllerProps, CreateActivityRequest, PickAsOrNull } from 'types';
import { Button, Grid, Text, useMantineTheme } from '@mantine/core';
import * as Yup from 'yup';
import { KeyedMutator } from 'swr';
import { createActivity } from '@services/activity';
import { useRouter } from 'next/router';
import RichTextEditor from '@components/RichTextEditor';

type Values = Omit<PickAsOrNull<CreateActivityRequest, 'startDate' | 'endDate'>, 'email'>;

const CreateNewActivity = ({
  setOpened,
  mutate,
}: {
  setOpened: Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<any>;
}) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [mailContent, onChange] = useState('<p><br></p>');
  const [rteError, setRteError] = useState(false);
  const initialValue: Values = {
    title: '',
    startDate: null,
    endDate: null,
    subject: '',
  };

  const onSubmit = async (values: Values, actions: FormikHelpers<Values>) => {
    if (mailContent === '<p><br></p>') {
      setRteError(true);
      return null;
    }

    const payload = { ...values, email: mailContent } as CreateActivityRequest;
    const [, error] = await createActivity(payload);
    if (error) {
      router.push('/500', { pathname: router.asPath });
      return null;
    }
    actions.setSubmitting(false);
    mutate();
    setOpened(false);
    return null;
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('必填'),
    startDate: Yup.date().required('必填').nullable(),
    endDate: Yup.date().required('必填').nullable(),
    subject: Yup.string().required('必填'),
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
                {formik.isSubmitting ? '建立中...' : '確認'}
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default CreateNewActivity;

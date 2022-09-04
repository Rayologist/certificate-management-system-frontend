import {
  PasswordInputProps as MantinePasswordInputProps,
  RadioGroupProps as MantineRadioGroupProps,
  SelectProps as MantineSelectProps,
  TextareaProps as MantineTextareaProps,
  TextInputProps as MantineTextInputProps,
  CheckboxGroupProps as MantineCheckboxGroupProps,
  NumberInputProps as MantineNumberInputProps,
  MultiSelectProps as MantineMultiSelectProps,
  FileInputProps as MantineFileInputProps,
  ColProps,
} from '@mantine/core';
import { DatePickerProps as MantineDatePickerProps } from '@mantine/dates';
import { NextPage } from 'next';
import { AppProps } from 'next/app';

export type PickAsOrNull<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null;
};

export type ModifyType<T, K extends keyof T, Type> = Omit<T, K> & {
  [P in K]: Type;
};

export type RemoveNull<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Exclude<T[P], null>;
};
//

export type NextPageWithLayout = NextPage & {
  auth?: boolean;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

//
export type Response<ResData = {}> = {
  status: 'success' | 'failed';
  data: ResData;
  msg?: string;
};

// Activity
export type Activity = {
  auid: string;
  title: string;
  startDate: Date;
  endDate: Date;
  url: string;
  updatedAt: Date;
  createdAt: Date;
};

export type GetActivityRespose = Response<Activity[]>;
export type CreateActivityRequest = Pick<Activity, 'title' | 'startDate' | 'endDate'>;
export type DeleteActivityRequest = Pick<Activity, 'auid'>;
export type UpdateActivityRequest = Pick<Activity, 'auid' | 'title' | 'startDate' | 'endDate'>;

// Certificate
export interface Certificate {
  id: number;
  activityUid: string;
  displayName: string;
  title: Title[];
  totalHour: number;
  dateString: string;
  filename: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SendCertificate = {
  activityName: string;
  certificateName: string;
  certificateId: number;
  activityUid: string;
};

export interface Title {
  text: string;
  weight: string;
}

export type CreateCertificateRequest = Pick<
  Certificate,
  'activityUid' | 'displayName' | 'title' | 'dateString' | 'totalHour'
>;
export type SendCertificateRequest = {
  certificateId: number;
  participantId: number;
};

export type UpdateCertificateRequest = Pick<
  Certificate,
  'id' | 'displayName' | 'title' | 'dateString' | 'totalHour'
>;
export type DeleteCertificateRequest = Pick<Certificate, 'id'>;
export type CertificateResponse = Activity & { certificate: Certificate[] };

export type GetCertificateResponse = Response<CertificateResponse[]>;

// Participant
export type Participant = {
  id: number;
  activityUid: string;
  name: string;
  from: string;
  title: string;
  email: string;
  phone: string;
  participantCertificate: {
    certificate: Pick<Certificate, 'id' | 'displayName'>;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
export type CreateParticipantRequest = {
  data: Omit<Participant, 'id' | 'createdAt' | 'updatedAt' | 'participantCertificate'>[];
};
export type UpdateParticipantRequest = Omit<
  Participant,
  'activityUid' | 'createdAt' | 'updatedAt' | 'participantCertificate'
>;

export type DeleteParticipantRequest = Pick<Participant, 'id'>;

export type ParticipantStatsResponse = Pick<Activity, 'auid' | 'title'> & {
  _count: { participant: number };
};

export type ParticipantResponse = Pick<Activity, 'title'> & {
  participant: Participant[];
  certificate: Pick<Certificate, 'displayName' | 'id'>[];
};

// ------Formik Component types------
export type Option = {
  label: string;
  value: any;
};

export interface Options {
  options: Option[];
}

export type Controlled<T> = { label: string; name: string } & T;

export type TextInputProps = Controlled<MantineTextInputProps>;
export type PasswordInputProps = Controlled<MantinePasswordInputProps>;
export type TextareaProps = Controlled<MantineTextareaProps>;
export type NumberInputProps = Controlled<MantineNumberInputProps>;
export type DatePickerProps = Controlled<MantineDatePickerProps>;
export type FileInputProps<T extends boolean> = Controlled<MantineFileInputProps<T>>;
export type SelectProps = Controlled<
  Omit<MantineSelectProps, 'data'> & {
    options: MantineSelectProps['data'];
  }
>;
export type CheckboxGroupProps = Controlled<Omit<MantineCheckboxGroupProps, 'children'> & Options>;
export type RadioGroupProps = Controlled<Omit<MantineRadioGroupProps, 'children'> & Options>;
export type MultiSelectProps = Controlled<
  Omit<MantineMultiSelectProps, 'data'> & {
    options: MantineMultiSelectProps['data'];
  }
>;

export type ControllerProps =
  | ({ control: 'text-input' } & TextInputProps)
  | ({ control: 'password-input' } & PasswordInputProps)
  | ({ control: 'select' } & SelectProps)
  | ({ control: 'checkbox-group' } & CheckboxGroupProps)
  | ({ control: 'radio-group' } & RadioGroupProps)
  | ({ control: 'text-area' } & TextareaProps)
  | ({ control: 'date-picker' } & DatePickerProps)
  | ({ control: 'number-input' } & NumberInputProps)
  | ({ control: 'multi-select' } & MultiSelectProps)
  | ({ control: 'file-input' } & FileInputProps<boolean>);

export type ControllerPropsWithCol = {
  controllers: (ControllerProps & { col?: ColProps })[];
};

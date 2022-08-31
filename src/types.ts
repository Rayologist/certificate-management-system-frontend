import {
  CheckboxProps,
  PasswordInputProps,
  RadioGroupProps,
  SelectProps,
  TextareaProps,
  TextInputProps,
  CheckboxGroupProps,
} from "@mantine/core";
import { DatePickerProps } from "@mantine/dates";
import { NextPage } from "next";
import { AppProps } from "next/app";

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
  status: "success" | "failed";
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
export type CreateActivityRequest = Pick<
  Activity,
  "title" | "startDate" | "endDate"
>;
export type DeleteActivityRequest = Pick<Activity, "auid">;
export type UpdateActivityRequest = Pick<
  Activity,
  "auid" | "title" | "startDate" | "endDate"
>;

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
  "activityUid" | "displayName" | "title" | "dateString" | "totalHour"
>;
export type SendCertificateRequest = {
  certificateId: number;
  participantId: number;
};

export type UpdateCertificateRequest = Pick<
  Certificate,
  "id" | "displayName" | "title" | "dateString" | "totalHour"
>;
export type DeleteCertificateRequest = Pick<Certificate, "id">;
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
    certificate: Pick<Certificate, "id" | "displayName">;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
export type CreateParticipantRequest = {
  data: Omit<
    Participant,
    "id" | "createdAt" | "updatedAt" | "participantCertificate"
  >[];
};
export type UpdateParticipantRequest = Omit<
  Participant,
  "activityUid" | "createdAt" | "updatedAt" | "participantCertificate"
>;

export type DeleteParticipantRequest = Pick<Participant, "id">;

export type ParticipantStatsResponse = Pick<Activity, "auid" | "title"> & {
  _count: { participant: number };
};

export type ParticipantResponse = Pick<Activity, "title"> & {
  participant: Participant[];
  certificate: Pick<Certificate, "displayName" | "id">[];
};

// ------Formik Component types------
export type OptionType = {
  label: string;
  value: any;
};

export type ControlledProps = { label: string; name: string };

export type ControllerProps = ControlledProps &
  (
    | ({ control: "text-input" } & TextInputProps)
    | ({ control: "password-input" } & PasswordInputProps)
    | ({ control: "select"; options: OptionType[] } & Omit<SelectProps, "data">)
    | ({ control: "checkbox"; options: OptionType[] } & CheckboxProps &
        Omit<CheckboxGroupProps, "children">)
    | ({ control: "radio-group"; options: OptionType[] } & Omit<
        RadioGroupProps,
        "children"
      >)
    | ({ control: "text-area" } & TextareaProps)
    | ({ control: "date-picker" } & DatePickerProps)
  );

export interface OptionsProps {
  options: OptionType[];
}

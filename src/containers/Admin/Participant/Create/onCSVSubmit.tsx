import { createParticipant } from "@services/participant";
import Papa from "papaparse";
import { Participant, Response } from "types";

const English: { [key: string]: string } = {
  姓名: "name",
  單位: "from",
  職稱: "title",
  電子信箱: "email",
  電話: "phone",
};

const parseCSV = <T,>(str: string) => {
  return Papa.parse<T>(str, {
    header: true,
    transformHeader: (header) => English[header.trim()],
  });
};

type Data = Pick<Participant, "name" | "from" | "title" | "email" | "phone">;

export default async function onCSVSubmit(
  file: File | null,
  activityUid: string,
  encoding = "big5"
) {
  if (!file) return;

  const data = await new Promise<Data[]>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, encoding);

    reader.onload = async () => {
      let { data, errors } = parseCSV<Data>(reader.result as string);

      if (errors.length) {
        for (const error of errors) {
          data.splice(error.row, 1);
        }
      }

      resolve(data);
    };
  });

  const invalids: Data[] = [];

  data.forEach((value) => {
    const allFilled = Object.values(value).every((value) => value !== "");
    if (!allFilled) {
      invalids.push(value);
    }
  });

  if (invalids.length) {
    return invalids;
  }

  const reqestDate = data.map((data) => {
    const newData = data as Data & Pick<Participant, "activityUid">;
    newData.activityUid = activityUid;
    return newData;
  });

  await createParticipant({ data: reqestDate });
}

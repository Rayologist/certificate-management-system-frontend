import { createParticipant } from "@services/participant";
import { useRouter } from "next/router";
import Papa from "papaparse";
import { Participant } from "types";

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

export default async function onCSVSubmit(
  file: File | null,
  activityUid: string,
  encoding = "big5"
) {
  const router = useRouter();

  let result;
  if (!file) return;

  const reader = new FileReader();
  reader.readAsText(file, encoding);

  reader.onload = async (ev) => {
    const { data, errors } = parseCSV<
      Omit<Participant, "id" | "createdAt" | "updatedAt" | "activityUid">
    >(reader.result as string);

    if (errors.length) {
      for (const error of errors) {
        data.splice(error.row, 1);
      }
    }

    const reqestDate = data.map((data) => {
      const newData = data as Omit<
        Participant,
        "id" | "createdAt" | "updatedAt"
      >;
      newData.activityUid = activityUid;
      return newData;
    });

    const [res, error] = await createParticipant({ data: reqestDate });
    
    if (error) {
      router.push("/500", { pathname: router.asPath });
      return;
    }

    result = res;
  };
  return result;
}

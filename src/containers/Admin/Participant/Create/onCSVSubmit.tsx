import { createParticipant } from '@services/participant';
import Papa from 'papaparse';
import { Participant } from 'types';

const English: { [key: string]: string } = {
  姓名: 'name',
  單位: 'from',
  職稱: 'title',
  電子信箱: 'email',
  電話: 'phone',
};

const parseCSV = <T,>(str: string) =>
  Papa.parse<T>(str, {
    header: true,
    transformHeader: (header) => English[header.trim()],
  });

type Data = Pick<Participant, 'name' | 'from' | 'title' | 'email' | 'phone'>;

export default async function onCSVSubmit(
  file: File | null,
  activityUid: string,
  encoding = 'big5'
) {
  if (!file) return null;

  const data = await new Promise<Data[]>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file, encoding);

    reader.onload = async () => {
      const { data: parsedData, errors } = parseCSV<Data>(reader.result as string);

      if (errors.length) {
        errors.forEach((error) => {
          parsedData.splice(error.row, 1);
        });
      }

      resolve(parsedData);
    };
  });

  const invalids: Data[] = [];

  data.forEach((value) => {
    const allFilled = Object.values(value).every((val) => val !== '');
    if (!allFilled) {
      invalids.push(value);
    }
  });

  if (invalids.length) {
    return invalids;
  }

  const requestData = data.map((datum) => {
    const newData = datum as Data & Pick<Participant, 'activityUid'>;
    newData.activityUid = activityUid;
    return newData;
  });

  await createParticipant({ data: requestData });

  return null;
}

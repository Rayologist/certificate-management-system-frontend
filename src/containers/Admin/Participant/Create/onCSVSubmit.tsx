import { createParticipant } from '@services/participant';
import { parse, ParseResult } from 'papaparse';
import { Participant } from 'types';

const English: { [key: string]: string } = {
  姓名: 'name',
  單位: 'from',
  職稱: 'title',
  電子信箱: 'email',
  電話: 'phone',
};

const parseCSV = <T,>(str: string) =>
  parse<T>(str, {
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

  const { data, errors, meta } = await new Promise<ParseResult<Data>>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file, encoding);

    reader.onload = async () => {
      resolve(parseCSV<Data>(reader.result as string));
    };
  });

  if (errors.length) {
    errors.forEach((error) => {
      data.splice(error.row, 1);
    });
  }

  const { fields: submitFields } = meta;

  const errorMessage = '請確認上傳的檔案是否包含以下欄位：姓名,單位,職稱,電子信箱,電話';

  if (!submitFields) return errorMessage;

  const participantFields = new Set(Object.values(English));

  const filteredFields = submitFields.filter((field) => participantFields.has(field));

  if (filteredFields.length !== participantFields.size) return errorMessage;

  const invalids: Data[] = [];
  const valids: Data[] = [];

  data.forEach((participant) => {
    const allFilled = Object.values(participant).every((value) => value !== '');
    const allEmpty = Object.values(participant).every((value) => value === '');

    if (allFilled) {
      return valids.push(participant);
    }

    if (!allEmpty) {
      return invalids.push(participant);
    }

    return null;
  });

  if (invalids.length) {
    return invalids;
  }

  const requestData = valids.map((datum) => {
    const newData = datum as Data & Pick<Participant, 'activityUid'>;
    newData.activityUid = activityUid;
    return newData;
  });

  await createParticipant({ data: requestData });

  return null;
}

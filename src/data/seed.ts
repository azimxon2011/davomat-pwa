import { ClassGroup } from '../types';

const STUDENT_NAMES_POOL = [
  'Abdullayev Jasurbek',
  'Akbarova Madina',
  'Alimov Sardorbek',
  'Azizova Sevinch',
  'Bozorov Muhammadali',
  'Ergasheva Muslima',
  'Gʻaniyev Diyorbek',
  'Hasanova Mohinur',
  'Ibrohimov Azizbek',
  'Ismoilova Rayhona',
  'Karimov Behruzbek',
  'Mahmudova Zilola',
  'Mirzayev Shohruxbek',
  'Nazarova Nozima',
  'Olimov Javohirbek',
  'Qodirova Shabnam',
  'Rustamov Islombek',
  'Salimova Durdona',
  'Toshmatov Umidjon',
  'Usmonova Nigora',
  'Abduqodirov Boburjon',
  'Ahmadaliyeva Farangiz',
  'Baxtiyorov Samandar',
  'Davronova Malika',
];

function makeClass(
  id: string,
  name: string,
  excelRow: number,
  count: number,
  defaultAttended: number,
  curatorName: string
): ClassGroup {
  const students = Array.from({ length: count }, (_, idx) => ({
    id: `${id}-s-${idx + 1}`,
    fullName: STUDENT_NAMES_POOL[idx % STUDENT_NAMES_POOL.length],
  }));
  return { id, name, excelRow, curatorName, defaultAttended, students };
}

export const SEED_CLASSES: ClassGroup[] = [
  makeClass('cls-5a1', '5 A1', 4, 24, 22, 'Ğulomov E'),
  makeClass('cls-5a2', '5 A2', 5, 24, 24, 'Yusufjonova D'),
  makeClass('cls-6a1', '6 A1', 6, 21, 21, 'Abdullayeva N'),
  makeClass('cls-6a2', '6 A2', 7, 23, 21, 'Yunusova B'),
  makeClass('cls-7a1', '7 A1', 8, 24, 23, 'Ğapporova N'),
  makeClass('cls-7a2', '7 A2', 9, 23, 21, 'Sulaymonova Z'),
  makeClass('cls-7t', '7 T', 10, 24, 22, 'Xoşımova X'),
  makeClass('cls-8a1', '8 A1', 11, 22, 19, 'Örınova M'),
  makeClass('cls-8a2', '8 A2', 12, 23, 23, 'Xayıtboyeva R'),
  makeClass('cls-8t', '8 T', 13, 22, 19, 'Sodıqova N'),
  makeClass('cls-9a1', '9 A1', 14, 24, 20, 'Madraxımova D'),
  makeClass('cls-9a2', '9 A2', 15, 23, 22, 'Ummatova X'),
  makeClass('cls-9a3', '9 A3', 16, 24, 23, 'Omonov A'),
  makeClass('cls-10a1', '10 A1', 17, 22, 21, 'Xadjayev A'),
  makeClass('cls-10a2', '10 A2', 18, 22, 15, 'Tadjıyeva Z'),
  makeClass('cls-10a3', '10 A3', 19, 22, 21, 'Dexkanboyeva O'),
  makeClass('cls-10t', '10 T', 20, 24, 24, 'Jörayeva F'),
  makeClass('cls-11a1', '11 A1', 21, 19, 17, 'Qözıyev T'),
  makeClass('cls-11a2', '11 A2', 22, 19, 19, 'Salıyeva G'),
  makeClass('cls-11t', '11 T', 23, 18, 12, 'Djuraboyev M'),
];

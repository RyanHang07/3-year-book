export const pictures = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const firstPictureMonth = {
  month: 5,
  year: 2023,
};

const getPictureMonth = (pictureIndex) => {
  const monthOffset = firstPictureMonth.month + pictureIndex;
  const month = monthOffset % 12;
  const year = firstPictureMonth.year + Math.floor(monthOffset / 12);

  return {
    label: `${monthNames[month]} ${year}`,
    shortLabel: `${shortMonthNames[month]} ${year}`,
  };
};

const pictureMonths = Object.fromEntries(
  pictures.map((picture, index) => [picture, getPictureMonth(index)]),
);

export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
    frontLabel: null,
    frontShortLabel: null,
    backLabel: pictureMonths[pictures[0]].label,
    backShortLabel: pictureMonths[pictures[0]].shortLabel,
  },
  ...Array.from(
    { length: Math.floor((pictures.length - 2) / 2) },
    (_, index) => {
      const pictureIndex = index * 2 + 1;

      return {
        front: pictures[pictureIndex],
        back: pictures[pictureIndex + 1],
        frontLabel: pictureMonths[pictures[pictureIndex]].label,
        frontShortLabel: pictureMonths[pictures[pictureIndex]].shortLabel,
        backLabel: pictureMonths[pictures[pictureIndex + 1]].label,
        backShortLabel: pictureMonths[pictures[pictureIndex + 1]].shortLabel,
      };
    },
  ),
  {
    front: pictures[pictures.length - 1],
    back: "book-back",
    frontLabel: pictureMonths[pictures[pictures.length - 1]].label,
    frontShortLabel: pictureMonths[pictures[pictures.length - 1]].shortLabel,
    backLabel: null,
    backShortLabel: null,
  },
];
export const texturePaths = [
  ...new Set([
    ...pages.flatMap(({ front, back }) => [
      `/textures/${front}.jpg`,
      `/textures/${back}.jpg`,
    ]),
  ]),
];

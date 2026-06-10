export const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
  ...Array.from(
    { length: Math.floor((pictures.length - 2) / 2) },
    (_, index) => {
      const pictureIndex = index * 2 + 1;

      return {
        front: pictures[pictureIndex],
        back: pictures[pictureIndex + 1],
      };
    },
  ),
  {
    front: pictures[pictures.length - 1],
    back: "book-back",
  },
];

export const texturePaths = [
  ...new Set([
    ...pages.flatMap(({ front, back }) => [
      `/textures/${front}.jpg`,
      `/textures/${back}.jpg`,
    ]),
    "/textures/book-cover-roughness.jpg",
  ]),
];

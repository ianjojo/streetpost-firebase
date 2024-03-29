import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const postIdState = atom({
  key: "postIdState",
  default: "",
});

export const locationState = atom({
  key: "locationState",
  default: [],
});
export const postsState = atom({
  key: "postsState",
  default: [],
});

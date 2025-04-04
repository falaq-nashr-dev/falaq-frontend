import { BASE_URL } from "./Request";

export const getImage = (prefix: string, name: string) => {
  return `${BASE_URL}/files/${prefix}/${name}`;
};

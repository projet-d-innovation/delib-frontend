
import { faker } from "@faker-js/faker";
import { IBaseTemplateProps } from "./BaseTemplate";

const base: IBaseTemplateProps = {
  someProp: faker.lorem.sentence(),
};

const list: IBaseTemplateProps[] = Array.from({ length: 10 }).map(() => {
  return {
    someProp: faker.lorem.sentence(),
  };
});

export const mockBaseTemplateProps = {
  base,
  list,
};

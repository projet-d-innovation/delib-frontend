import { IElement } from "../types/interfaces";
import { createEntityService } from "./entityApi";

// Usage for the IElement entity
const ELEMENTS_BASE_URL = '/elements';
const elementService = createEntityService<IElement>(ELEMENTS_BASE_URL);

export default elementService;


import { api as AXIOS_INSTANCE } from '../api/axios';
import { AcademicRecord } from '../types/interfaces';

export enum SESSION {
  SESSION1,
  SESSION2
}


interface IGetNotes {
  codeFiliere : string | null, 
  codeSemester : string | null, 
  codeSessionUniversitaire: string | null,
  annee:string | null,
  type: string | null
}


export class NoteService {


  static async getAllNotes(getNotesParams: IGetNotes): Promise<AcademicRecord[]> {
   
    const res = await AXIOS_INSTANCE.get('/deliberation', {
      params: { ...getNotesParams, annee : getNotesParams.annee?.toString() }
    })


    return res.data;
  }

}
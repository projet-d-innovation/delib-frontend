import { AcademicRecord, DeliberationData } from "../types/interfaces";



export const extractRelevantTableNoteData = (studentData : AcademicRecord[]) : DeliberationData[] => {

  return  studentData.map((student) => ({
      numero: student.inscription.etudiant.cne,
      nom: student.inscription.etudiant.nom,
      prenom: student.inscription.etudiant.prenom,
      naissance: student.inscription.etudiant.dateNaissance,
      sessionType: student.sessionType,
      modules: student.notes.map(note => {

        const elements = note.notesElement.map(n => ({
          code: n.codeElement,
          nom: n.element.intituleElement,
          note: n.note,
          bareme: 20, 
        }))


        const module = note.module;
        return [{
          code: module.codeModule,
          nom: module.intituleModule,
          note: note.note,
          bareme: 20, // Set the bareme value as needed
        }, ...elements]
      }),
    }),
  )
}


export const formatDate = (dateString : string) => {

  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Note: month index starts from 0
  const day = date.getDate();

  // Formatting the date as "YYYY-MM-DD"
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  console.log(formattedDate); // Output: "2001-12-01"

  return formattedDate;
}
import React, { useEffect, useState } from 'react';
import { extractRelevantTableNoteData, formatDate } from '../../helpers/utils';
import { useQuery } from 'react-query';
import { NoteService, SESSION } from '../../services/NotesService';
import {  DeliberationData, ModuleData } from '../../types/interfaces';
import { Flex, Group, Select } from '@mantine/core';
import { FiliereService } from '../../services/FiliereService';
import { SemestreService } from '../../services/SemestreService';
import { SessionUniversitaireervice } from '../../services/SessionUniversitaireService';

const MODULE_MAX_WIDTH = 200;



const NotePage = () => {

  const [codeFiliere, setcodeFiliere] = useState<string | null>('GLSID')
  const [codeSemester, setCodeSemester] = useState<string | null>('TII11006')
  const [codeSessionUniversitaire, setCodeSessionUniversitaire] = useState<string | null>('2021-2023')
  const [annee , setAnnee] = useState<string | null>("1")
  const [type , setType] = useState<string | null>(SESSION[SESSION.SESSION1])



  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['deliberation', codeFiliere, codeSemester, codeSessionUniversitaire, annee, type],
    queryFn: async () => await NoteService.getAllNotes(
      {
        codeFiliere, codeSemester, codeSessionUniversitaire, annee, type
      }
    ),
    keepPreviousData: true,
    onSuccess: (data) => {
      
    },
  });


  const filiereQuery = useQuery({
    queryKey: ['filieres'],
    queryFn: () => FiliereService.getFilieres({}),
    keepPreviousData: true,
  })


  const semestreQuery = useQuery({
    queryKey: ['semestre'],
    queryFn: () => SemestreService.getSemestres({}),
    keepPreviousData: true,
  })

  const setCodeSessionUniversitaireQuery = useQuery({
    queryKey: ['session-universitaire'],
    queryFn: () => SessionUniversitaireervice.getSessionUniversitaire(),
    keepPreviousData: true,
  })




  

  if (!data) {
    return <p>No data available</p>;
  }


  const students = extractRelevantTableNoteData(data);
  console.log(students)

  const MODULES = students[0]?.modules;
  const SESSIONTYPE = students[0]?.sessionType;


 
  

  return (

    <>
      <Flex direction={'row'} justify="space-between" className='mb-2' >
        <Select
          label="code Filiere"
          placeholder="code Filiere"
          value={codeFiliere}
          onChange={setcodeFiliere}
          data={filiereQuery.data?.records.map(f => f.codeFiliere) ?? []}
          nothingFound="Pas de filieres trouvés"
          dropdownPosition="bottom"
          maxDropdownHeight={300}
        />

        <Select
          label="code semestre"
          placeholder="code semestre"
          value={codeSemester}
          onChange={setCodeSemester}
          data={semestreQuery.data?.records.map(s => s.codeSemestre) ?? []}
          nothingFound="Pas de semestres trouvés"
          dropdownPosition="bottom"
          maxDropdownHeight={300}
        />

        <Select
          label="code session universitaire"
          placeholder="code session universitaire"
          value={codeSessionUniversitaire}
          onChange={setCodeSessionUniversitaire}
          data={setCodeSessionUniversitaireQuery.data?.records.map(su => su.id) ?? []}
          nothingFound="Pas de sessions univ trouvés"
          dropdownPosition="bottom"
          maxDropdownHeight={300}
        />

        <Select
          label="annee"
          placeholder="annee"
          value={annee}
          onChange={setAnnee}
          data={['1','2']}
          dropdownPosition="bottom"
          maxDropdownHeight={300}
        />

        <Select
          label="session"
          placeholder="session"
          value={type}
          onChange={setType}
          data={[SESSION[SESSION.SESSION1] , SESSION[SESSION.SESSION2]]}
          dropdownPosition="bottom"
          maxDropdownHeight={300}
        />
      </Flex>



      {students.length ? <table className="border-collapse border">
        <thead>
          <tr>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2"></th>

            {/* Generate module columns dynamically */}
            {students.length > 0 && MODULES?.map(module => module.map(m =>
              <React.Fragment key={m.code}>
                <th colSpan={2} className="border p-2 text-center" style={{ width: `${MODULE_MAX_WIDTH}px` }}>
                  {m.code} - {'\n' + m.nom}
                </th>
              </React.Fragment>
            ))}
          </tr>
          <tr>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">Session</th>
            {Array.from({ length: MODULES!.length * 3 }, (_, index) => (
              <React.Fragment key={index}>
                <td colSpan={2} className="border p-2 text-center" style={{ width: `${MODULE_MAX_WIDTH}px` }}>{SESSIONTYPE}</td>
              </React.Fragment>
            ))}
          </tr>

          <tr>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2"></th>
            <th className="border p-2">Admissibilite</th>
          </tr>

          <tr>
            <th className="border p-2">Numero</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Prenom</th>
            <th className="border p-2">Naissance</th>
            {/* Generate subcolumns for note and bareme */}
            {students!.length > 0 && MODULES?.map(module => module.map(m=>
              <React.Fragment key={m.code}>
                <th className="border p-2 text-center">Note</th>
                <th className="border p-2 text-center">Bareme</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Generate rows for each student */}
          {students.map(student => (
            <tr key={student.nom}>
              <td className="border p-2 text-center">{student.numero}</td>
              <td className="border p-2 text-center">{student.nom}</td>
              <td className="border p-2 text-center">{student.prenom}</td>
              <td className="border p-2 text-center">{`${formatDate(student.naissance)}`}</td>
              {/* Generate cells for each module */}
              {student.modules.map(module => module.map(m=>
                <React.Fragment key={m.code}>
                  <td className="border p-2 text-center">{m.note}</td>
                  <td className="border p-2 text-center">{m.bareme}</td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      : <>Il n ya pas de notes</>
    }
    
    </>

    
  );

}

export default NotePage
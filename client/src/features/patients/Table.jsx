import { useCallback} from "react"
import { formatDate, patientsTableColumns } from "@/utils/constant";
import TableBody from "@/component/TableBody";
import { RiMailFill, RiPhoneLine } from "@remixicon/react";


export default function Table({patients}) {
    const renderCell = useCallback((patient, columnKey)=>{
        const cellValue = patient[columnKey];
        switch(columnKey) { //switch matches it based on the columnKey 
            case "fullname": 
            return (
            <>
              <h1 className="font-bold">{patient?.fullname}</h1>
              {patient?.email}
            </>
          );
            case "gender": 
           return  <div className="capitalize">{patient?.gender}</div>;
           case "dateOfBirth":
            return (
              <div  className="capitalize">{formatDate(patient?.dateOfBirth)}</div>
            );
            case "action":
              return (
              <div className="flex gap-4 items-center">
              <button
              onClick={()=> window.open(`mailto:${patient?.email}`, "_blank")}
              title="send a email"
              className="cursor-pointer"
              >
                <RiMailFill className="text-blue-500"/>
              </button>
              <button
              onClick={()=> window.open(`tel:${patient?.phone}`, "_blank")}
              title={`call ${patient?.fullname}`}
              className="cursor-pointer"
              >
              <RiPhoneLine className="text-blue-500"/>
              </button>
              </div>) 
            default:
            return cellValue;
        }
    }, [])
  return (
    <>
        <TableBody tableColumns={patientsTableColumns} tableData={patients} renderCell={renderCell}/>
    </>
  )
}

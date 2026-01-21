 import { ChangeEvent } from 'react';

 export type UploaderProps = {
   handleUpload: (event: ChangeEvent<HTMLInputElement>, userId: number) => void
   userId: number;
 };

 export const Uploader = ({ handleUpload, userId }: UploaderProps) => {
   return (
     <div>
       <input type="file" name="upload_input" onChange={ev => handleUpload(ev, userId)}/>
     </div>
   );};

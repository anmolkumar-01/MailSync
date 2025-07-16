import { Skeleton } from "../ui/skeleton";
import { useAppStore } from "../../store/useAppStore";

const EmailSkeleton = () => {

  const {attachmentsAvailable} = useAppStore()

  return (

    <div className="flex flex-col gap-4 mt-0.5">
      
      {/* -------------- Skeleton for Subject --------- */}

      <div className="space-y-2"> 
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* ----------- Skeleton for Text Editor ---------*/}

      <div className="space-y-2 flex-grow flex flex-col"> 
        <Skeleton className="h-4 w-[50px]" />
        

        <div className="relative flex-grow h-[250px]">

          {/* Skeleton for the toolbar */}
          <Skeleton className="h-[42px] w-full rounded-t-md " />
          
          {/* Skeleton for the text area */}
          <Skeleton className={`h-[calc(100%-42px)] w-full rounded-b-md  ${attachmentsAvailable ? 'lg:h-67' : 'lg:h-72'}`} />
        </div>
      </div>

    </div>
  );
};

export default EmailSkeleton;
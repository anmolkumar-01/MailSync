import { useState } from "react";
import { Checkbox, ScrollArea } from "..";
import { useAppStore } from "../../store/useAppStore";
import { SquareCheck } from "lucide-react";

const SelectRecipients = () => {
  const { extractedEmails,selectedEmails, setSelectedEmails } = useAppStore();

  const allSelected = selectedEmails.length === extractedEmails.length;

  const toggleEmail = (email) => {
    if (selectedEmails.includes(email)) 
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
    
    else 
      setSelectedEmails([...selectedEmails, email]);
    
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails([...extractedEmails]);
    }
  };

  return (
    <div className="bg-card w-full rounded-md shadow-md border p-4 text-card-foreground flex flex-col gap-3">

      {/* -------- Text field ------------- */}
      <div className="w-full space-y-2">
          <div className="flex items-center gap-2">
              <SquareCheck className="w-6 h-6 text-foreground" />
              <h2 className="text-2xl font-semibold text-foreground">Step 2: Select emails</h2>
          </div>
          <div>
            <h4 className="mx-1 text-md text-muted-foreground">Select the mails you want to send email to</h4>
          </div>
      </div>

      {/* --------Email selection box --------*/}

      <div className=" flex flex-col w-full border-1 rounded-xl p-2 shadow-inner-md bg-background ">

    {extractedEmails.length > 0 ? (
      <>

        {/* Sticky Select All */}
        <div className="sticky top-0 z-10 bg-card rounded-md border-b p-2 flex items-center gap-3">
          <Checkbox
            className ='cursor-pointer'
            checked={allSelected}
            onCheckedChange={toggleSelectAll}
          />
          <span className="font-medium">Select All</span>
        </div>

        {/* Scrollable list of emails */}
        <ScrollArea className="max-h-[14.25rem] overflow-auto">
          <div className="space-y-2 py-2">
            
            {/* Each element */}
            {extractedEmails.map((email, index) => (
              <div
                key={index}
                className="flex bg-card items-center gap-3 p-2 border rounded-md shadow-sm"
              >
                <Checkbox
                  className ='cursor-pointer'
                  checked={selectedEmails.includes(email)}
                  onCheckedChange={() => toggleEmail(email)}
                />
                <span className="text-sm">{email}</span>
              </div>
            ))}

          </div>
        </ScrollArea>

      </>
    ) : (
      // no emails are found
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground p-4 text-center">
          No emails available.
        </p>
      </div>
    )}


      </div>

    </div>
  );
};

export default SelectRecipients;

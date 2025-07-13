import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Search, UserCircle2 } from "lucide-react";

const SelectRecipients = () => {
  const { extractedEmails, selectedEmails, setSelectedEmails } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmails = extractedEmails.filter((email) =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allFilteredSelected =
    filteredEmails.length > 0 &&
    filteredEmails.every((email) => selectedEmails.includes(email));

  const toggleEmail = (email) => {
    setSelectedEmails(
      selectedEmails.includes(email)
        ? selectedEmails.filter((e) => e !== email)
        : [...selectedEmails, email]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedEmails(selectedEmails.filter(email => !filteredEmails.includes(email)));
    } else {
      setSelectedEmails([...new Set([...selectedEmails, ...filteredEmails])]);
    }
  };

  return (
    <Card className="shadow-md border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <span className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-blue-500 text-white">2</span>
          <span className="text-blue-900">Select Emails</span>
        </CardTitle>
        <CardDescription className="text-gray-600">Choose the recipients for your email campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        {extractedEmails.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search recipients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full border-blue-200 focus:border-blue-500"
            />
          </div>
        )}
        <div className="border rounded-lg bg-white border-blue-100">
          {extractedEmails.length > 0 ? (
            <>
              <div className="p-3 border-b border-blue-100 bg-blue-50/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={allFilteredSelected}
                    onCheckedChange={toggleSelectAllFiltered}
                    disabled={filteredEmails.length === 0}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-blue-800 leading-none cursor-pointer">
                    Select All {filteredEmails.length > 0 ? `(${filteredEmails.length})` : ''}
                  </label>
                </div>
                <div className="text-xs font-semibold text-blue-600">
                  {selectedEmails.length} / {extractedEmails.length} selected
                </div>
              </div>
              <ScrollArea className="h-64">
                <div className="p-1">
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2.5 rounded-md hover:bg-blue-50/80 transition-colors"
                      >
                        <Checkbox
                          id={`email-${index}`}
                          checked={selectedEmails.includes(email)}
                          onCheckedChange={() => toggleEmail(email)}
                        />
                        <UserCircle2 className="h-6 w-6 text-blue-300" />
                        <label htmlFor={`email-${index}`} className="text-sm font-mono text-gray-600 cursor-pointer flex-1">
                          {email}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-40 text-sm text-gray-500">
                      <p>No emails match your search.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex items-center justify-center h-72 text-sm text-gray-500">
              <p>Upload a file to see extracted emails here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectRecipients;
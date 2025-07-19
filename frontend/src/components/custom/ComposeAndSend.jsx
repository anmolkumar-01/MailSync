import { useRef, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, Paperclip, Send, Sparkles, FileText,LoaderCircle, FileInput } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "../ui/textarea";
import EmailSkeleton from "../skeletons/EmailSkeleton";
import { useEffect } from "react";

const ComposeAndSend = () => {

  const {selectedEmails, user, askAI, isAskingAi, subject, body, setSubject, setBody, triggerNotification, isSendingEmail, send, setAttachmentsAvailable, attachmentsAvailable} = useAppStore()

  const [attachments, setAttachments] = useState([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const fileInputRef = useRef(null)

  const handleGenerateWithAI = async () => {

    setIsAiModalOpen(false); // closing modal just after submitting prompt

    await askAI(aiPrompt);
    setAiPrompt("")

  };

  useEffect(() => {
    setAttachmentsAvailable(attachments.length > 0)
  },[attachments])

  const handleFileAttach = (e) => {

    const existingFileNames = attachments.map(file => file.name);

    // avoid files which are already present
    const newUniqueFiles = Array.from(e.target.files).filter(
      file => !existingFileNames.includes(file.name)
    );

    if (newUniqueFiles.length > 0) {
      setAttachments((prev) => [...prev, ...newUniqueFiles]);
    } else {
      
      triggerNotification("All selected files were already attached.", "appError");
    }

    if(fileInputRef.current){
      fileInputRef.current.value = null;
      // console.log("after" ,fileInputRef.current.value);
    }
  }

  const handleSendEmail = async () => {
    
    if(!user){
      triggerNotification("Please sign in first to send email", "appError");
      return;
    }

    const plainTextBody = new DOMParser().parseFromString(body, 'text/html').body.textContent || "";
    // console.log("plain text ", plainTextBody.trim())

    if (selectedEmails.length === 0) {
      triggerNotification("Please select recipients", "appError")
      return;
    }
    if (!subject || !subject?.trim) {
      triggerNotification("Please add the subject line for your email", "appError")
      return;
    }
    if (!plainTextBody?.trim()) {
      triggerNotification("Please add the content of your email", "appError")
      return;
    }
    // console.log("body is here" ,body)

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('body', body);
    formData.append('recipients', JSON.stringify(selectedEmails));

    
    attachments.forEach(file =>{
      formData.append('fileData', file)
    })


    // console.log("Email Data (HTML Body) is here :" ,Object.fromEntries(formData.entries()))
    // console.log("All attachments files in frontend :", formData.getAll('fileData'))

    send(formData);
    setAttachments([]);

  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  return (
    <>
      <Card className="h-full flex flex-col shadow-md border-blue-100 pb-3">

        {/* ----------- Top Text --------- */}
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-blue-500 text-white">3</span>
            <span className="text-blue-900">Compose & Send</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Write your email, use AI for assistance, and send it.</CardDescription>
        </CardHeader>

{/* ------------------------------------------------------- here */}
        <CardContent className=" flex flex-grow flex-col gap-4 ">
          
          {/* ------------ Ask AI button --------------*/}
          <div className="space-y-1">
            <Button
              size="sm"
              onClick={() => setIsAiModalOpen(true)}
              disabled={isAskingAi}
              className="bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-900 text-white hover:from-blue-800 hover:via-indigo-600 hover:to-purple-800 border-0 hover:shadow-lg transition-all duration-300 rounded-full w-[165px]"
            >
              
              {/* ask ai call -> show button generating.... */}
              {isAskingAi ? (
                
                <div className="flex items-center justify-center">
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </div>
              ) : (


                
                <div className="flex items-center justify-center">
                  <Sparkles className="mr-2 h-4 w-4 animate-sparkle" />
                  Generate with AI
                </div>
              )}
            </Button>


          </div>

            {/* ----------- email subject and body with text editor */}
            
              {isAskingAi || isSendingEmail ? (
              <EmailSkeleton />
              ):(
                <>
                  {/* -------------- subject --------- */}
                  <div className="space-y-1">
                    <label htmlFor="subject" className="text-sm font-medium text-blue-900">Subject</label>
                    <Input id="subject" placeholder="Your email subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="border-blue-200"/>
                  </div>

                  {/* ----------- Body: Text Editor ---------*/}
                  <div className="space-y-1 flex flex-col">
                    <label className="text-sm font-medium text-blue-900">Body</label>
                    
                    {/* Quill text editor The wrapper div is the key change for robust styling */}
                    <div className="quill-container-wrapper rounded-md border border-blue-200 bg-white"
                    spellCheck="false">

                      <ReactQuill
                        theme="snow"
                        value={body}
                        onChange={setBody}
                        modules={quillModules}
                        className={`flex flex-col ${attachmentsAvailable? 'h-[272px]' : 'h-[292px]' } `}
                        placeholder="Write your email content here..."
                        style={{height: '272px'}}
                      >
                      </ReactQuill>
                      
                    </div>
                  </div>
                </>
              )}

          

        </CardContent>
        
        {/* ---------- attached files to be sent with email ------------- */}
        {attachments.length > 0 && (
          <div className="px-4 pt-1 -my-4"> {/* Added a bit more bottom padding for the scrollbar */}
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="flex w-max space-x-2 px-2">

                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="max-w-[100px] truncate font-medium text-gray-700">{file.name}</span>
                    <button onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}>
                      <X className="h-4 w-4 text-gray-500 hover:text-red-500 transition-all" />
                    </button>
                  </div>
                ))}
                
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        {/*-------------- Footer  -------------- */}
        <CardFooter className="flex justify-between items-center border-t border-blue-100 [.border-t]:pt-2">
          
          {/*-------------- Paper clip icon */}          
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <label htmlFor="attachment-input" className="cursor-pointer text-gray-500 hover:text-blue-600">
                <Paperclip className="h-5 w-5" />
              </label>
            </Button>

            <input
              id="attachment-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileAttach}
              ref={fileInputRef}
            />


          </div>
          
            {/*-------------- Send Emails button */}        
          <Button size="sm" onClick={handleSendEmail} disabled={isSendingEmail || selectedEmails.length === 0} className="bg-blue-500 hover:bg-blue-600 text-white">
            {isSendingEmail? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isSendingEmail ? "Sending..." : `Send to ${selectedEmails.length} recipients`}
          </Button>
        </CardFooter>
      </Card>

      {/* ---------Give ai prompt Modal ---------*/}
      <Dialog open={isAiModalOpen } onOpenChange={setIsAiModalOpen} >
        <DialogContent>
          
          {/* -------- Headings  */}
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-900 via-purple-900 to-purple-900 bg-clip-text text-transparent font-semibold">Generate Email with AI</DialogTitle>
            <DialogDescription>
              Describe the purpose of your email, and our AI will draft it for you
            </DialogDescription>
          </DialogHeader>

          {/*-------- Text block */}
          <div className="py-4">
            <Textarea
              placeholder="e.g., A welcome email for new subscribers..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[100px] max-h-[250px] border-blue-200 "
              spellCheck="false"
            />
          </div>
          
          {/* -------- Buttons */}
          <DialogFooter className="flex-row justify-end gap-x-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>

            {/* genrating button */}
            <Button 
              size="sm"
              onClick={handleGenerateWithAI} 
              disabled={isAskingAi}
              className=" bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-900 text-white hover:from-blue-800 hover:via-indigo-600 hover:to-purple-800 border-0 hover:shadow-lg transition-all duration-300 rounded-full w-[150px]"
            >
              
              {/* ask ai call -> show button generating.... */}
              {isAskingAi ? (
                
                <div className="flex items-center justify-center">
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </div>
              ) : (
                
                <div className="flex items-center justify-center">
                  <Sparkles className="mr-2 h-4 w-4 animate-sparkle" />
                  Generate
                </div>
              )}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default ComposeAndSend;